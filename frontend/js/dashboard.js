const dashboardDemoData = {
  specialty: 'General Physician',
  facility: 'Primary Health Center',
  doctorId: 'DOC-7722',
  rating: 'Rating 4.8 · 120+ Consultations',
  appointments: {
    total: 8,
    nextUp: '2:30 PM',
    note: 'Preparation required for 2 cases',
    slots: 5,
    activeSlot: 4,
  },
  sync: {
    title: 'Live & Secure',
    copy: 'Encrypted connection active',
    used: 2.4,
    total: 10,
  },
  notifications: [
    {
      type: 'warning',
      title: 'Emergency Referral',
      message: 'Patient Arjun Singh needs immediate attention at Specialist Hospital.',
      icon: 'ri-alarm-warning-line',
    },
    {
      type: 'info',
      title: 'Teleconsultation in 15m',
      message: 'Video call scheduled with Dr. Meera for case review.',
      icon: 'ri-vidicon-line',
    },
    {
      type: 'neutral',
      title: 'Records Synced',
      message: 'All clinic records are mirrored to the shared health vault.',
      icon: 'ri-database-2-line',
    },
  ],
};

document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  loadDashboard();
});

async function loadDashboard() {
  const user = getStoredUser();
  renderDoctorIdentity(user);

  const [patientsData, alertsData, referralsData] = await Promise.all([
    fetchCollection('/patients'),
    fetchCollection('/alerts'),
    fetchCollection('/referrals'),
  ]);

  const patients = normalizePatients(patientsData);
  const alerts = normalizeAlerts(alertsData);
  const referrals = normalizeReferrals(referralsData);

  renderOverviewCards(patients, alerts, referrals);
  renderRecentPatients(patients);
  renderNotifications(alerts, referrals);
  renderAppointments();
  renderSyncCard(patients.length);
  loadDoctorMap();
}

function getStoredUser() {
  try {
    const value = localStorage.getItem('user');
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

function renderDoctorIdentity(user) {
  const rawName = user && user.name ? user.name : 'Rajesh Kumar';
  const displayName = rawName.toLowerCase().startsWith('dr.') ? rawName : `Dr. ${rawName}`;
  const avatarLetter = displayName.replace('Dr.', '').trim().charAt(0).toUpperCase() || 'D';

  setText('user-info', displayName);
  setText('doctor-name', displayName);
  setText('doctor-avatar', avatarLetter);
  setText('doctor-specialty', dashboardDemoData.specialty);
  setText('doctor-facility', user && user.hospital_name ? user.hospital_name : dashboardDemoData.facility);
  setText('doctor-id', user && user._id ? String(user._id).slice(-8).toUpperCase() : dashboardDemoData.doctorId);
  setText('doctor-rating', dashboardDemoData.rating);
}

async function fetchCollection(endpoint) {
  const token = localStorage.getItem('token');
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { method: 'GET', headers });
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return null;
  }
}

function normalizePatients(patients) {
  if (Array.isArray(patients) && patients.length) {
    return patients;
  }

  return [
    {
      patient_id: 'PAT-1001',
      name: 'Arjun Singh',
      age: 42,
      gender: 'Male',
      phone: '+91 98111 22334',
    },
    {
      patient_id: 'PAT-1002',
      name: 'Meena Devi',
      age: 33,
      gender: 'Female',
      phone: '+91 98999 11223',
    },
    {
      patient_id: 'PAT-1003',
      name: 'Rohit Verma',
      age: 27,
      gender: 'Male',
      phone: '+91 97770 88119',
    },
  ];
}

function normalizeAlerts(alerts) {
  if (Array.isArray(alerts) && alerts.length) {
    return alerts;
  }

  return [
    {
      patient_id: 'PAT-1001',
      risk_level: 'high',
      message: 'Critical blood pressure readings need urgent specialist review.',
      created_at: new Date().toISOString(),
    },
    {
      patient_id: 'PAT-1002',
      risk_level: 'medium',
      message: 'Teleconsultation follow-up pending for antenatal review.',
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
  ];
}

function normalizeReferrals(referrals) {
  if (Array.isArray(referrals) && referrals.length) {
    return referrals;
  }

  return [
    {
      _id: 'ref-1',
      patient_id: 'PAT-1001',
      specialist: 'Cardiology',
      status: 'pending',
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'ref-2',
      patient_id: 'PAT-1002',
      specialist: 'Gynecology',
      status: 'pending',
      updatedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      _id: 'ref-3',
      patient_id: 'PAT-1003',
      specialist: 'Neurology',
      status: 'accepted',
      updatedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    },
  ];
}

function renderOverviewCards(patients, alerts, referrals) {
  const patientCount = patients.length;
  const urgentReferrals = referrals.filter((referral) => String(referral.status).toLowerCase() === 'pending').length;
  const referralPercent = referrals.length ? Math.round((urgentReferrals / referrals.length) * 100) : 0;
  const growthPercent = patientCount > 1 ? Math.min(48, 8 + patientCount * 3.4).toFixed(1) : '18.4';

  setText('stats-patients', String(patientCount));
  setText('stats-growth-chip', `+${growthPercent}%`);
  setText('stats-growth-caption', 'vs last month');

  setText('stats-referrals', String(referrals.length));
  setText('urgent-referrals-badge', `${urgentReferrals} urgent`);
  setText('referral-status-label', urgentReferrals > 0 ? 'Pending Review' : 'No urgent cases');
  setText('referral-status-percent', `${referralPercent}%`);

  const referralProgressFill = document.getElementById('referral-progress-fill');
  if (referralProgressFill) {
    referralProgressFill.style.width = `${Math.max(referralPercent, 8)}%`;
  }

  if (!alerts.length && !referrals.length) {
    setText('urgent-referrals-badge', '0 urgent');
  }
}

function renderAppointments() {
  const { total, nextUp, note, slots, activeSlot } = dashboardDemoData.appointments;

  setText('stats-appointments', String(total));
  setText('appointments-next-up', nextUp);
  setText('appointments-note', note);

  const appointmentSlots = document.getElementById('appointment-slots');
  if (!appointmentSlots) {
    return;
  }

  appointmentSlots.innerHTML = '';
  for (let index = 1; index <= slots; index += 1) {
    const dot = document.createElement('span');
    dot.textContent = index === slots ? `+${activeSlot}` : String(index);
    appointmentSlots.appendChild(dot);
  }
}

function renderSyncCard(patientCount) {
  const used = (dashboardDemoData.sync.used + patientCount * 0.08).toFixed(1);
  const total = dashboardDemoData.sync.total;
  const percent = Math.min(100, Math.round((Number(used) / total) * 100));

  setText('sync-status-title', dashboardDemoData.sync.title);
  setText('sync-status-copy', dashboardDemoData.sync.copy);
  setText('storage-status', `${used} / ${total} GB`);

  const storageBarFill = document.getElementById('storage-bar-fill');
  if (storageBarFill) {
    storageBarFill.style.width = `${Math.max(percent, 12)}%`;
  }
}

function renderRecentPatients(patients) {
  const list = document.getElementById('recent-patients-list');
  if (!list) {
    return;
  }

  list.innerHTML = '';

  if (!patients.length) {
    list.innerHTML = '<p class="doctor-empty-state">No patients registered yet.</p>';
    return;
  }

  patients.slice(0, 4).forEach((patient) => {
    const row = document.createElement('div');
    row.className = 'doctor-patient-row';
    row.innerHTML = `
      <div class="doctor-patient-main">
        <span class="doctor-patient-avatar">${patient.name.charAt(0).toUpperCase()}</span>
        <div>
          <div class="doctor-patient-name">${patient.name}</div>
          <div class="doctor-patient-meta">${patient.patient_id} · ${patient.age || '--'} / ${patient.gender || 'N/A'}</div>
        </div>
      </div>
      <a class="doctor-patient-link" href="patient_detail.html?id=${patient.patient_id}">Open Case</a>
    `;
    list.appendChild(row);
  });
}

function renderNotifications(alerts, referrals) {
  const list = document.getElementById('notifications-list');
  if (!list) {
    return;
  }

  const generatedNotifications = [];

  alerts.slice(0, 2).forEach((alert) => {
    generatedNotifications.push({
      type: String(alert.risk_level).toLowerCase() === 'high' ? 'warning' : 'info',
      title: String(alert.risk_level).toLowerCase() === 'high' ? 'Emergency Referral' : 'Clinical Follow-up',
      message: `${alert.patient_id}: ${alert.message}`,
      icon: String(alert.risk_level).toLowerCase() === 'high' ? 'ri-alarm-warning-line' : 'ri-stethoscope-line',
    });
  });

  if (referrals.some((referral) => String(referral.status).toLowerCase() === 'accepted')) {
    generatedNotifications.push({
      type: 'info',
      title: 'Referral Accepted',
      message: 'A specialist hospital has accepted one of your recent cases.',
      icon: 'ri-hospital-line',
    });
  }

  const notifications = generatedNotifications.length ? generatedNotifications : dashboardDemoData.notifications;

  list.innerHTML = '';
  notifications.slice(0, 3).forEach((notification) => {
    const item = document.createElement('article');
    item.className = `doctor-notification-item ${notification.type || 'neutral'}`;
    item.innerHTML = `
      <div class="doctor-notification-icon"><i class="${notification.icon}"></i></div>
      <div>
        <h4>${notification.title}</h4>
        <p>${notification.message}</p>
      </div>
    `;
    list.appendChild(item);
  });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

/* ─────────── QR Scanner ─────────── */
let html5QrcodeScanner = null;
let qrMode = 'camera'; // 'camera' | 'upload'

function openQrScanner() {
  const modal = document.getElementById('qr-scanner-modal');
  if (!modal) return;
  modal.classList.add('active');
  startCameraScanner();

  // Tab buttons
  const btnCamera = document.getElementById('btn-scan-camera');
  const btnUpload = document.getElementById('btn-upload-qr');
  const uploadContainer = document.getElementById('qr-upload-container');
  const readerContainer = document.getElementById('qr-reader');
  const uploadFileInput = document.getElementById('qr-upload-file');

  if (btnCamera) {
    btnCamera.onclick = () => {
      qrMode = 'camera';
      btnCamera.style.background = 'var(--primary, #f6ab0f)';
      btnCamera.style.color = '#1b1714';
      if (btnUpload) { btnUpload.style.background = ''; btnUpload.style.color = ''; }
      if (uploadContainer) uploadContainer.style.display = 'none';
      if (readerContainer) readerContainer.style.display = '';
      startCameraScanner();
    };
  }

  if (btnUpload) {
    btnUpload.onclick = () => {
      qrMode = 'upload';
      btnUpload.style.background = 'var(--primary, #f6ab0f)';
      btnUpload.style.color = '#1b1714';
      if (btnCamera) { btnCamera.style.background = ''; btnCamera.style.color = ''; }
      stopCameraScanner();
      if (readerContainer) readerContainer.style.display = 'none';
      if (uploadContainer) uploadContainer.style.display = '';
    };
  }

  if (uploadFileInput) {
    uploadFileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          canvas.getContext('2d').drawImage(img, 0, 0);
          // Use html5-qrcode to scan the image file
          if (window.Html5Qrcode) {
            const qrCodeReader = new Html5Qrcode('_qr_upload_tmp_canvas');
            Html5Qrcode.scanFile(file, true)
              .then(onQrScanSuccess)
              .catch(() => { alert('Could not read QR code from image. Please try a clearer image.'); });
          }
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    };
  }
}

function startCameraScanner() {
  stopCameraScanner();
  if (!window.Html5QrcodeScanner) return;

  html5QrcodeScanner = new Html5QrcodeScanner(
    'qr-reader',
    { fps: 10, qrbox: { width: 260, height: 260 }, rememberLastUsedCamera: true },
    false
  );
  html5QrcodeScanner.render(onQrScanSuccess, onQrScanError);
}

function stopCameraScanner() {
  if (html5QrcodeScanner) {
    try { html5QrcodeScanner.clear(); } catch (_) {}
    html5QrcodeScanner = null;
  }
}

function closeQrScanner() {
  stopCameraScanner();
  const modal = document.getElementById('qr-scanner-modal');
  if (modal) modal.classList.remove('active');
  // Reset upload input
  const fileInput = document.getElementById('qr-upload-file');
  if (fileInput) fileInput.value = '';
  const uploadContainer = document.getElementById('qr-upload-container');
  const readerContainer = document.getElementById('qr-reader');
  if (uploadContainer) uploadContainer.style.display = 'none';
  if (readerContainer) readerContainer.style.display = '';
}

function onQrScanSuccess(decodedText) {
  closeQrScanner();
  // Redirect to the URL embedded in the QR code
  if (decodedText.startsWith('http://') || decodedText.startsWith('https://')) {
    window.location.href = decodedText;
  } else if (decodedText.includes('patient_detail') || decodedText.includes('?id=')) {
    // Relative path — navigate relative to the pages directory
    window.location.href = decodedText;
  } else {
    // Show raw decoded content
    alert(`QR Code decoded:\n${decodedText}`);
  }
}

function onQrScanError(error) {
  // Silent — scan errors during live feed are normal
}

let doctorMap = null;

function loadDoctorMap() {
  const listEl = document.getElementById('doctor-hospital-list');
  if (!listEl) return;
  if (!navigator.geolocation) {
    listEl.innerHTML = '<p style="color:#9c938b;">Geolocation not supported.</p>';
    return;
  }

  listEl.innerHTML = '<p style="color:#9c938b; font-size:14px;">Locating you...</p>';

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    if (!doctorMap) {
      doctorMap = L.map('doctor-map').setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(doctorMap);
    } else {
      doctorMap.setView([lat, lng], 13);
    }

    // Mark doctor location
    L.circleMarker([lat, lng], {
      radius: 8, fillColor: '#e8820c', color: '#fff', weight: 2, fillOpacity: 1
    }).addTo(doctorMap).bindPopup('<b>Your Location</b>').openPopup();

    try {
      const hospitals = await apiRequest(`/hospitals/nearby?lat=${lat}&lng=${lng}`);
      listEl.innerHTML = '';

      if (!hospitals || hospitals.length === 0) {
        listEl.innerHTML = '<p style="color:#9c938b; font-size:14px;">No hospitals found nearby.</p>';
        return;
      }

      hospitals.forEach(h => {
        const marker = L.marker([h.latitude, h.longitude]).addTo(doctorMap);
        marker.bindPopup(`<b>${h.name}</b><br>${(h.specialties || []).join(', ')}<br>${h.distance.toFixed(1)} km away`);

        const item = document.createElement('div');
        item.style.cssText = 'background: #f9f6ef; padding: 12px 14px; border-radius: 12px; border: 1px solid rgba(232,130,12,0.12); cursor: pointer; transition: background 0.2s; margin-bottom: 8px;';
        item.innerHTML = `
          <div style="font-weight: 700; color: #1b1714; font-size: 14px; margin-bottom: 2px;">${h.name}</div>
          <div style="color: #e8820c; font-size: 12px; margin-bottom: 4px;"><i class="ri-route-line"></i> ${h.distance.toFixed(2)} km away</div>
          <div style="color: #9c938b; font-size: 11px;">${(h.specialties || ['General']).join(', ')}</div>
        `;
        item.onclick = () => { doctorMap.flyTo([h.latitude, h.longitude], 16); marker.openPopup(); };
        item.onmouseover = () => { item.style.background = '#fef3d8'; };
        item.onmouseout = () => { item.style.background = '#f9f6ef'; };
        listEl.appendChild(item);
      });
    } catch {
      listEl.innerHTML = '<p style="color:#9c938b; font-size:14px;">Could not load hospitals.</p>';
    }
  }, () => {
    if (listEl) listEl.innerHTML = '<p style="color:#9c938b; font-size:14px;">Location access denied.</p>';
  });
}