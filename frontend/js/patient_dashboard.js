const patientVaultFallback = {
  patient: {
    name: "Arjun Singh",
    patient_id: "PAT-8833",
    blood_group: "O+",
  },
  symptoms: [
    {
      symptoms: ["Seasonal Flu"],
      notes: "Rest for 3 days and drink plenty of fluids.",
      prescription: "Paracetamol 500mg, Vitamin C",
      visit_date: "2024-02-10T09:30:00.000Z",
      doctor_name: "Dr. Rajesh Kumar",
      blood_pressure: "120/80",
    },
  ],
  referrals: [
    {
      specialist: "General Medicine",
      status: "verified",
      createdAt: "2024-02-10T09:30:00.000Z",
    },
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  requireAuth();
  loadPatientVault();
});

async function loadPatientVault() {
  const user = getStoredUser();
  const profile = await resolvePatientProfile(user);
  renderPatientVault(profile, user);
}

function getStoredUser() {
  try {
    const value = localStorage.getItem("user");
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

async function resolvePatientProfile(user) {
  const identifier = user ? user.email || user.phone : null;

  try {
    const patients = await apiRequest("/patients");
    const foundPatient = Array.isArray(patients)
      ? patients.find(
          (patient) =>
            patient.email === identifier || patient.phone === identifier,
        )
      : null;

    if (foundPatient && foundPatient.patient_id) {
      try {
        return await apiRequest(`/patients/full/${foundPatient.patient_id}`);
      } catch (error) {
        return {
          patient: foundPatient,
          symptoms: [],
          referrals: [],
          reports: [],
        };
      }
    }
  } catch (error) {
    return patientVaultFallback;
  }

  return user
    ? {
        patient: {
          name: user.name || patientVaultFallback.patient.name,
          patient_id: patientVaultFallback.patient.patient_id,
          blood_group: patientVaultFallback.patient.blood_group,
        },
        symptoms: patientVaultFallback.symptoms,
        referrals: patientVaultFallback.referrals,
        reports: [],
      }
    : patientVaultFallback;
}

function renderPatientVault(data, user) {
  const patient = data.patient || patientVaultFallback.patient;
  const symptoms =
    Array.isArray(data.symptoms) && data.symptoms.length
      ? data.symptoms
      : patientVaultFallback.symptoms;
  const referrals = Array.isArray(data.referrals)
    ? data.referrals
    : patientVaultFallback.referrals;
  const latestVisit = symptoms[0];
  const nextCheckup = computeNextCheckup(latestVisit && latestVisit.visit_date);
  const name =
    patient.name || (user && user.name) || patientVaultFallback.patient.name;
  const patientId =
    patient.patient_id || patientVaultFallback.patient.patient_id;
  const bloodGroup =
    patient.blood_group || patientVaultFallback.patient.blood_group;
  const avatarLetter = name.charAt(0).toUpperCase();

  setText("patient-chip-avatar", avatarLetter);
  setText("patient-avatar", avatarLetter);
  setText("patient-chip-name", name);
  setText("patient-name", name);
  setText("patient-chip-id", `ID: ${patientId}`);
  setText("patient-id", patientId);
  setText("patient-blood-group", bloodGroup);
  setText("patient-visits", String(symptoms.length));
  setText("patient-next-checkup", nextCheckup);

  const statusLabel = referrals.some(
    (referral) => String(referral.status).toLowerCase() !== "completed",
  )
    ? "Health Status: Monitoring"
    : "Health Status: Stable";
  const banner = document.getElementById("patient-health-status-banner");
  if (banner) {
    const span = banner.querySelector("span");
    if (span) {
      span.textContent = statusLabel;
    }
  }

  renderConsultations(symptoms, referrals);
  renderQrCode(patientId);
  loadPatientMap();
}

function renderQrCode(patientId) {
  const qrContainer = document.getElementById("patient-qrcode");
  if (!qrContainer) return;

  qrContainer.innerHTML = ""; // Clear previous

  // Build absolute URL so QR is scannable from any device  
  const baseUrl = window.location.origin + window.location.pathname.replace('patient_dashboard.html', '');
  const qrData = `${baseUrl}patient_detail.html?id=${encodeURIComponent(patientId)}`;

  new QRCode(qrContainer, {
    text: qrData,
    width: 120,
    height: 120,
    colorDark: "#1f1a17",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  const downloadBtn = document.getElementById("download-qr-btn");
  if (downloadBtn) {
    downloadBtn.onclick = () => downloadQrCode(patientId);
  }
}

function downloadQrCode(patientId) {
  const qrContainer = document.getElementById("patient-qrcode");
  const canvas = qrContainer.querySelector("canvas");
  if (canvas) {
    const imageUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `arogya-qr-${patientId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Fallback if image tags are used instead of canvas by qrcodejs under some circumstances
    const img = qrContainer.querySelector("img");
    if (img) {
      const link = document.createElement("a");
      link.href = img.src;
      link.download = `arogya-qr-${patientId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function renderConsultations(symptoms, referrals) {
  const list = document.getElementById("consultations-list");
  if (!list) {
    return;
  }

  list.innerHTML = "";

  if (!symptoms.length) {
    list.innerHTML =
      '<p class="patient-vault-empty">No consultations logged yet.</p>';
    return;
  }

  symptoms
    .slice()
    .reverse()
    .slice(0, 4)
    .forEach((record, index) => {
      const title =
        Array.isArray(record.symptoms) && record.symptoms.length
          ? record.symptoms[0]
          : "General Checkup";
      const doctorName = record.doctor_name || "Dr. Rajesh Kumar";
      const visitDate = record.visit_date
        ? new Date(record.visit_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Recent";
      const referralStatus = referrals[index]
        ? String(referrals[index].status || "verified").toUpperCase()
        : "VERIFIED";
      const prescription =
        record.prescription || derivePrescription(record.notes);
      const advice =
        record.notes ||
        "Maintain your medication schedule and follow doctor guidance.";

      const card = document.createElement("article");
      card.className = "patient-vault-consultation-card";
      card.innerHTML = `
      <div class="patient-vault-consultation-head">
        <div class="patient-vault-consultation-main">
          <div class="patient-vault-consultation-icon"><i class="ri-stethoscope-line"></i></div>
          <div>
            <div class="patient-vault-consultation-title">${title}</div>
            <div class="patient-vault-consultation-meta">${doctorName} • ${visitDate}</div>
          </div>
        </div>
        <div class="patient-vault-badge">${referralStatus}</div>
      </div>
      <div class="patient-vault-consultation-body">
        <div class="patient-vault-consultation-block">
          <span>Prescription</span>
          <p>${prescription}</p>
        </div>
        <div class="patient-vault-consultation-block">
          <span>Doctor's Advice</span>
          <p><em>${advice}</em></p>
        </div>
      </div>
    `;
      list.appendChild(card);
    });
}

function derivePrescription(notes) {
  if (!notes) {
    return "Paracetamol 500mg, Vitamin C";
  }

  return notes.length > 60 ? notes.slice(0, 60).trim() : notes;
}

function computeNextCheckup(visitDate) {
  if (!visitDate) {
    return "March 25, 2024";
  }

  const nextDate = new Date(visitDate);
  nextDate.setDate(nextDate.getDate() + 45);
  return nextDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

let patientMap = null;

function loadPatientMap() {
  const listEl = document.getElementById('patient-hospital-list');
  if (!listEl) return;
  if (!navigator.geolocation) {
    listEl.innerHTML = '<p style="color:#c67600">Geolocation not supported.</p>';
    return;
  }

  listEl.innerHTML = '<p style="color:#9c938b;">Locating you...</p>';

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    // Init or reset map
    if (!patientMap) {
      patientMap = L.map('patient-map').setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(patientMap);
    } else {
      patientMap.setView([lat, lng], 13);
    }

    // User dot
    L.circleMarker([lat, lng], {
      radius: 8, fillColor: '#ef9b00', color: '#fff', weight: 2, fillOpacity: 1
    }).addTo(patientMap).bindPopup('<b>You are here</b>').openPopup();

    try {
      const hospitals = await apiRequest(`/hospitals/nearby?lat=${lat}&lng=${lng}`);
      listEl.innerHTML = '';

      if (!hospitals || hospitals.length === 0) {
        listEl.innerHTML = '<p style="color:#9c938b;">No hospitals found nearby.</p>';
        return;
      }

      hospitals.forEach(h => {
        // Map marker
        const marker = L.marker([h.latitude, h.longitude]).addTo(patientMap);
        marker.bindPopup(`<b>${h.name}</b><br>${(h.specialties || []).join(', ')}<br>${h.distance.toFixed(1)} km away`);

        // Sidebar item
        const item = document.createElement('div');
        item.style.cssText = 'background: #fdf8ee; padding: 14px; border-radius: 14px; border: 1px solid rgba(238,152,0,0.15); cursor: pointer; transition: all 0.2s;';
        item.innerHTML = `
          <div style="font-weight: 700; color: #1d1915; margin-bottom: 4px;">${h.name}</div>
          <div style="color: #ee9800; font-size: 13px; margin-bottom: 6px;"><i class="ri-route-line"></i> ${h.distance.toFixed(2)} km away</div>
          <div style="color: #9c938b; font-size: 12px;">${(h.specialties || ['General']).join(', ')}</div>
        `;
        item.onclick = () => { patientMap.flyTo([h.latitude, h.longitude], 16); marker.openPopup(); };
        item.onmouseover = () => { item.style.background = '#fef3d8'; };
        item.onmouseout = () => { item.style.background = '#fdf8ee'; };
        listEl.appendChild(item);
      });
    } catch (err) {
      listEl.innerHTML = '<p style="color:#c67600">Could not load hospitals.</p>';
    }
  }, () => {
    if (listEl) listEl.innerHTML = '<p style="color:#9c938b;">Location access denied. Cannot show nearby hospitals.</p>';
  });
}
