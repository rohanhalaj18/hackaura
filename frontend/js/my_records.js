document.addEventListener("DOMContentLoaded", () => {
  requireAuth();

  const userStr = localStorage.getItem("user");
  if (userStr) {
    const user = JSON.parse(userStr);

    // Identify and fetch history
    identifyPatient(user.email).then((patientId) => {
      if (patientId) {
        loadMedicalHistory(patientId);
      } else {
        document.getElementById("symptoms-list").innerHTML =
          "<li>Medical ID pending creation by physical doctor.</li>";
        document.getElementById("reports-list").innerHTML =
          "<li>No reports dynamically saved.</li>";
        document.getElementById("referrals-list").innerHTML =
          "<li>No history found.</li>";
      }
    });
  }
});

async function identifyPatient(identifier) {
  try {
    const patients = await apiRequest("/patients");
    const myProfile = patients.find(
      (p) => p.email === identifier || p.phone === identifier,
    );

    if (myProfile && myProfile.patient_id) {
      return myProfile.patient_id;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function loadMedicalHistory(patientId) {
  try {
    const data = await apiRequest(`/patients/full/${patientId}`);

    // Symptoms
    const symList = document.getElementById("symptoms-list");
    symList.innerHTML = "";
    if (!data.symptoms || data.symptoms.length === 0) {
      symList.innerHTML =
        '<li class="patient-vault-empty">No checkups currently on record.</li>';
    } else {
      data.symptoms.forEach((sym) => {
        symList.innerHTML += `<li style="background: rgba(255,255,255,0.7); padding: 18px; border-radius: 16px; margin-bottom: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="color: #181311; font-weight: 700; font-size: 16px; margin-bottom: 8px;">Symptoms: ${sym.symptoms.join(", ")}</div>
          <div style="font-size: 14px; color: #ee9800; margin-bottom: 8px; font-weight: 600;">
             <i class="ri-heart-pulse-line"></i> BP: ${sym.blood_pressure || "--"} | <i class="ri-temp-hot-line"></i> Temp: ${sym.temperature || "--"}
          </div>
          ${sym.notes ? `<div style="font-size: 14px; color: #756d65; margin-bottom: 12px;">Doctor Notes: <i>${sym.notes}</i></div>` : ""}
          <div style="font-size: 12px; color: #9c938b; font-weight: 600;"><i class="ri-time-line"></i> Logged on: ${new Date(sym.visit_date).toLocaleDateString()}</div>
        </li>`;
      });
    }

    // Reports
    const repList = document.getElementById("reports-list");
    repList.innerHTML = "";
    if (!data.reports || data.reports.length === 0) {
      repList.innerHTML =
        '<li class="patient-vault-empty">No medical documents uploaded.</li>';
    } else {
      data.reports.forEach((rep) => {
        repList.innerHTML += `<li style="background: rgba(255,255,255,0.7); padding: 18px; border-radius: 16px; margin-bottom: 16px; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <div style="color: #181311; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-weight: 700; font-size: 16px;">${rep.report_type}</span>
            ${rep.file_url ? `<a href="${rep.file_url}" target="_blank" style="color: #4f46e5; text-decoration: none; font-weight: 600; font-size: 14px; background: rgba(79, 70, 229, 0.1); padding: 6px 12px; border-radius: 8px;"><i class="ri-download-cloud-2-line"></i> View File</a>` : ""}
          </div>
          <div style="font-size: 14px; color: #756d65; margin-bottom: 12px;">Notes: ${rep.notes || "No specific remarks."}</div>
          <div style="font-size: 12px; color: #9c938b; font-weight: 600;">${new Date(rep.createdAt).toLocaleDateString()}</div>
        </li>`;
      });
    }

    // Referrals
    const refList = document.getElementById("referrals-list");
    refList.innerHTML = "";
    if (!data.referrals || data.referrals.length === 0) {
      refList.innerHTML =
        '<li class="patient-vault-empty">No referrals requested or active.</li>';
    } else {
      data.referrals.forEach((ref) => {
        refList.innerHTML += `<li style="background: rgba(255,255,255,0.8); padding: 18px; border-radius: 16px; margin-bottom: 16px; border: 1px solid rgba(79, 70, 229, 0.15); box-shadow: 0 4px 12px rgba(79, 70, 229, 0.05);">
          <strong style="color: #4f46e5; font-size: 16px; display: block; margin-bottom: 4px;">Referred to: ${ref.specialist}</strong>
          <span style="font-size:14px; color: #756d65; display: block; margin-bottom: 12px;">Facility: ${ref.hospital_name || "TBD"}</span>
          <div style="display:flex; justify-content: space-between; align-items: center;">
            <span class="patient-vault-pill" style="padding: 6px 12px; font-size: 11px; box-shadow: none; border: 1px solid rgba(0,0,0,0.05);">${ref.status.toUpperCase()}</span>
            <span style="font-size:12px; color: #9c938b; font-weight: 600;">${new Date(ref.createdAt).toLocaleDateString()}</span>
          </div>
        </li>`;
      });
    }
  } catch (err) {
    console.error(err);
  }
}
