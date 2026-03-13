let patientId = null;
let aiDataPayload = { symptoms: [], reports: '' };

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  patientId = new URLSearchParams(window.location.search).get('id');
  if (!patientId) {
    window.location.href = 'patients.html';
    return;
  }
  loadPatientProfile();
});

/* ─── Modal helpers ─── */
function openModal(id) {
  document.getElementById(id).classList.add('active');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

/* ─── Load Profile ─── */
async function loadPatientProfile() {
  try {
    const data = await apiRequest(`/patients/full/${patientId}`);

    const p = data.patient;
    const initials = (p.name || 'P').charAt(0).toUpperCase();
    const metaText = `ID: ${p.patient_id} | Age: ${p.age || '--'} | Blood Group: ${p.blood_group || '--'}`;

    // Hero + sidebar
    setText('patient-name', p.name || 'Patient');
    setText('patient-meta', metaText);
    setText('hero-avatar', initials);
    setText('sb-avatar', initials);
    setText('sb-name', p.name || 'Patient');
    setText('sb-meta', `Age ${p.age || '--'} · ${p.gender || 'N/A'}`);
    setText('sb-id', p.patient_id || '--');
    window.patientEmail = p.email || '';

    // ── Symptoms ──
    const symList = document.getElementById('symptoms-list');
    symList.innerHTML = '';
    aiDataPayload.symptoms = [];
    let latestTemp = '--', latestBP = '--';

    if (!data.symptoms || data.symptoms.length === 0) {
      symList.innerHTML = '<li class="pd-empty">No symptoms logged yet.</li>';
    } else {
      // Sort newest first
      const sorted = [...data.symptoms].sort((a, b) => new Date(b.visit_date) - new Date(a.visit_date));
      if (sorted[0]) {
        latestTemp = sorted[0].temperature || '--';
        latestBP = sorted[0].blood_pressure || '--';
      }

      sorted.forEach(sym => {
        aiDataPayload.symptoms.push(...sym.symptoms);
        const li = document.createElement('li');
        li.className = 'pd-list-item';
        li.innerHTML = `
          <div class="pd-list-item-title">${sym.symptoms.join(', ')}</div>
          <div class="pd-list-item-meta">BP: ${sym.blood_pressure || '--'} &nbsp;·&nbsp; Temp: ${sym.temperature || '--'}°F &nbsp;·&nbsp; ${new Date(sym.visit_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
          ${sym.notes ? `<div class="pd-list-item-meta" style="margin-top:4px; font-style:italic;">"${sym.notes}"</div>` : ''}
        `;
        symList.appendChild(li);
      });
    }

    // Set vitals
    setText('v-temp', latestTemp);
    setText('v-bp', latestBP);

    // ── Reports ──
    const repList = document.getElementById('reports-list');
    repList.innerHTML = '';
    aiDataPayload.reports = '';

    if (!data.reports || data.reports.length === 0) {
      repList.innerHTML = '<li class="pd-empty">No reports uploaded yet.</li>';
    } else {
      data.reports.forEach(rep => {
        aiDataPayload.reports += `${rep.report_type}: ${rep.notes || ''}\n`;
        const li = document.createElement('li');
        li.className = 'pd-list-item';
        li.innerHTML = `
          <div class="pd-report-row">
            <div>
              <div class="pd-list-item-title">${rep.report_type}</div>
              <div class="pd-list-item-meta">${rep.notes || 'No notes'}</div>
            </div>
            ${rep.file_url ? `<a href="${rep.file_url}" target="_blank" class="pd-report-link"><i class="ri-external-link-line"></i> View</a>` : ''}
          </div>
        `;
        repList.appendChild(li);
      });
    }

    // ── Referrals ──
    const refList = document.getElementById('referrals-list');
    refList.innerHTML = '';

    if (!data.referrals || data.referrals.length === 0) {
      refList.innerHTML = '<p class="pd-empty">No active referrals.</p>';
    } else {
      data.referrals.forEach(ref => {
        const statusClass = ref.status === 'accepted' ? 'accepted' : 'pending';
        const div = document.createElement('div');
        div.className = 'pd-referral-item';
        div.innerHTML = `
          <div class="pd-referral-to"><i class="ri-hospital-line" style="color:#e8820c;"></i> ${ref.specialist}</div>
          <div class="pd-referral-meta">${ref.hospital_name || 'Hospital TBD'}</div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-top:8px;">
            <span class="pd-badge ${statusClass}">${ref.status.toUpperCase()}</span>
            <span class="pd-referral-meta">${new Date(ref.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
          </div>
        `;
        refList.appendChild(div);
      });
    }

  } catch (err) {
    console.error('Profile load error:', err.message);
  }
}

/* ─── AI Analysis ─── */
async function analyzeAI() {
  const btn = document.getElementById('ai-btn');
  btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Analyzing...';
  btn.disabled = true;

  const outputEl = document.getElementById('ai-output');
  outputEl.textContent = 'Running AI analysis...';

  try {
    const res = await apiRequest('/ai/analyze', 'POST', {
      patient_id: patientId,
      symptoms: aiDataPayload.symptoms.length > 0 ? aiDataPayload.symptoms.join(', ') : 'None',
      reports: aiDataPayload.reports || 'None',
    });

    outputEl.textContent = res.analysis || 'No analysis returned.';

    const badge = document.getElementById('ai-risk-badge');
    const level = res.risk_level || 'low';

    const badgeHtml = {
      high: `<span class="pd-badge high"><i class="ri-alarm-warning-fill"></i> HIGH RISK DETECTED</span> <span style="font-size:13px; color:#7c6fa0; margin-left:8px;">Immediate referral recommended.</span>`,
      medium: `<span class="pd-badge medium"><i class="ri-error-warning-line"></i> MODERATE RISK</span> <span style="font-size:13px; color:#7c6fa0; margin-left:8px;">Follow-up advised.</span>`,
      low: `<span class="pd-badge low"><i class="ri-checkbox-circle-line"></i> LOW RISK</span> <span style="font-size:13px; color:#7c6fa0; margin-left:8px;">Continue monitoring.</span>`,
    };
    badge.innerHTML = badgeHtml[level] || badgeHtml.low;

    showToast('✓ AI Analysis Complete');
  } catch (err) {
    outputEl.textContent = '⚠ AI service unreachable. Ensure the Python AI service is running on port 8000.';
    showToast('AI analysis failed', 'error');
  } finally {
    btn.innerHTML = '<i class="ri-magic-line"></i> Run AI Analysis';
    btn.disabled = false;
  }
}

/* ─── Add Symptom ─── */
async function addSymptom(e) {
  e.preventDefault();
  const symptoms = document.getElementById('sym-text').value.split(',').map(s => s.trim()).filter(Boolean);
  const temp = document.getElementById('sym-temp').value;
  const bp = document.getElementById('sym-bp').value;
  const notes = document.getElementById('sym-notes').value;

  try {
    await apiRequest('/symptoms', 'POST', { patient_id: patientId, symptoms, temperature: temp, blood_pressure: bp, notes });
    showToast('Symptoms logged successfully');
    closeModal('symptomModal');
    e.target.reset();
    loadPatientProfile();
  } catch (err) {
    showToast('Failed to log symptoms', 'error');
  }
}

/* ─── Upload Report ─── */
async function uploadReport(e) {
  e.preventDefault();
  const repType = document.getElementById('rep-type').value;
  const notes = document.getElementById('rep-notes').value;
  const fileInput = document.getElementById('rep-file');

  const formData = new FormData();
  formData.append('patient_id', patientId);
  formData.append('report_type', repType);
  formData.append('notes', notes);
  if (fileInput.files.length > 0) formData.append('file', fileInput.files[0]);

  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Uploading...';
  btn.disabled = true;

  try {
    await apiRequest('/reports', 'POST', formData, true);
    showToast('Report uploaded');
    closeModal('reportModal');
    e.target.reset();
    loadPatientProfile();
  } catch (err) {
    showToast('Upload failed', 'error');
  } finally {
    btn.textContent = 'Upload Document';
    btn.disabled = false;
  }
}

/* ─── Create Referral ─── */
async function createReferral(e) {
  e.preventDefault();
  const specialist = document.getElementById('ref-specialist').value;
  const hp = document.getElementById('ref-hospital').value;
  const rec = document.getElementById('ref-summary').value;

  try {
    await apiRequest('/referrals', 'POST', { patient_id: patientId, specialist, hospital_name: hp, ai_summary: rec });
    showToast('Referral issued');
    closeModal('referralModal');
    e.target.reset();
    loadPatientProfile();
  } catch (err) {
    showToast('Referral failed', 'error');
  }
}

/* ─── Share via Email ─── */
async function shareRecordEmail(e) {
  e.preventDefault();
  const email = document.getElementById('share-email').value;
  const includeAI = document.getElementById('share-ai-check').checked;
  const btn = e.target.querySelector('button[type="submit"]');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await apiRequest('/share/email', 'POST', {
      patient_id: patientId,
      recipient_email: email,
      include_ai_summary: includeAI
    });
    showToast(res.message || 'Records sent to email');
    closeModal('shareModal');
  } catch (err) {
    showToast('Email sending failed', 'error');
  } finally {
    btn.textContent = 'Send Medical Summary';
    btn.disabled = false;
  }
}

/* ─── Helpers ─── */
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

// showToast is provided globally by api.js

// logout() is provided globally by api.js
