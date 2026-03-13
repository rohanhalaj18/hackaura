document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  loadPatients();
});

function openModal(id) {
  document.getElementById(id).classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

async function loadPatients() {
  try {
    const patients = await apiRequest('/patients');
    const list = document.getElementById('patients-list');
    list.innerHTML = '';

    if (!patients || patients.length === 0) {
      list.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No patients found.</td></tr>';
      return;
    }

    patients.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td style="font-family: monospace; color: #818cf8; font-weight: 500;">
          <a href="patient_detail.html?id=${p.patient_id}" class="link" style="text-decoration: none;">${p.patient_id}</a>
        </td>
        <td style="font-weight: 500;">${p.name}</td>
        <td style="color: var(--text-muted);">${p.age} / ${p.gender}</td>
        <td><span class="badge" style="background: rgba(236,72,153,0.2); color: #ec4899;">${p.blood_group || 'N/A'}</span></td>
        <td style="color: var(--text-muted);">${p.phone}</td>
        <td>
          <a href="patient_detail.html?id=${p.patient_id}" class="btn-small" style="text-decoration:none;">View Case</a>
          <button class="btn-small mt-2" style="background: rgba(239,68,68,0.1); color: #f87171; border: 1px solid rgba(239,68,68,0.3); padding: 4px 8px;" onclick="deletePatient('${p.patient_id}')"><i class="ri-delete-bin-line"></i> Delete</button>
        </td>
      `;
      list.appendChild(row);
    });
  } catch (err) {}
}

async function addPatient(e) {
  e.preventDefault();
  const name = document.getElementById('p-name').value;
  const email = document.getElementById('p-email').value;
  const aadhaar = document.getElementById('p-aadhaar').value;
  const age = document.getElementById('p-age').value;
  const gender = document.getElementById('p-gender').value;
  const bg = document.getElementById('p-bg').value;
  const phone = document.getElementById('p-phone').value;
  const address = document.getElementById('p-address').value;

  try {
    const res = await apiRequest('/patients', 'POST', {
      name, email, aadhaar, age, gender, blood_group: bg, phone, address
    });
    
    showToast('Patient Registered Successfully');
    closeModal('addPatientModal');
    
    // Reset Form
    document.getElementById('p-name').value = '';
    document.getElementById('p-email').value = '';
    document.getElementById('p-aadhaar').value = '';
    
    // Display QR code mapped from the response payload
    document.getElementById('qr-code-img').src = res.qr;
    openModal('qrModal');
    
    loadPatients();
  } catch (err) {
    console.error(err);
  }
}

async function deletePatient(id) {
  if (!confirm("Are you sure you want to permanently delete this patient?")) return;
  try {
    await apiRequest(`/patients/${id}`, 'DELETE');
    showToast('Patient deleted successfully');
    loadPatients();
  } catch (err) {
    console.error(err);
  }
}

function downloadDoctorQR() {
  const qrUrl = document.getElementById('qr-code-img').src;
  if (!qrUrl) return;
  
  const a = document.createElement("a");
  a.href = qrUrl;
  a.download = `Patient_QR.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
