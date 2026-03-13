document.addEventListener("DOMContentLoaded", () => {
  requireAuth();
  loadAllReferrals();
});

async function loadAllReferrals() {
  try {
    const referrals = await apiRequest("/referrals");
    const list = document.getElementById("referrals-list");
    list.innerHTML = "";

    if (!referrals || referrals.length === 0) {
      list.innerHTML =
        '<tr><td colspan="6" style="text-align: center; color: #9c938b; padding: 24px;">No referrals found.</td></tr>';
      return;
    }

    referrals.forEach((r) => {
      const row = document.createElement("tr");
      row.style.background = "rgba(255, 255, 255, 0.6)";
      row.style.boxShadow = "0 4px 12px rgba(67, 50, 20, 0.03)";

      row.innerHTML = `
        <td style="padding: 16px; border-radius: 12px 0 0 12px; font-weight: 700; color: #4f46e5;">
          <a href="patient_detail.html?id=${r.patient_id}" style="text-decoration:none; color:inherit;">${r.patient_id}</a>
        </td>
        <td style="padding: 16px; font-weight: 600; color: #181311;">${r.specialist}</td>
        <td style="padding: 16px; font-weight: 500; color: #756d65;">${r.hospital_name || "Not specified"}</td>
        <td style="padding: 16px;"><span class="patient-vault-pill" style="padding: 6px 12px; font-size: 11px; box-shadow: none; border: 1px solid rgba(0,0,0,0.05);">${r.status.toUpperCase()}</span></td>
        <td style="padding: 16px; font-weight: 600; color: #9c938b; font-size: 13px;">${new Date(r.updatedAt).toLocaleDateString()}</td>
        <td style="padding: 16px; border-radius: 0 12px 12px 0;">
          <select style="width: auto; padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.1); background: transparent; font-size: 13px; font-weight: 600; color: #181311; cursor: pointer;" onchange="updateStatus('${r._id}', this.value)">
            <option value="pending" ${r.status === "pending" ? "selected" : ""}>Pending</option>
            <option value="accepted" ${r.status === "accepted" ? "selected" : ""}>Accepted</option>
            <option value="completed" ${r.status === "completed" ? "selected" : ""}>Completed</option>
          </select>
        </td>
      `;
      list.appendChild(row);
    });
  } catch (err) {}
}

async function updateStatus(id, status) {
  try {
    await apiRequest(`/referrals/${id}`, "PUT", { status });
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = "Referral status updated";
      toast.className = "toast show";
      setTimeout(() => {
        toast.className = "toast";
      }, 3000);
    }
    loadAllReferrals();
  } catch (err) {
    loadAllReferrals();
  }
}

// QR Scanner Logic
let html5QrCode = null;

function openQrScanner() {
  const modal = document.getElementById("qr-scanner-modal");
  if (modal) {
    modal.classList.add("active");
    initQrScanner();
  }
}

function closeQrScanner() {
  const modal = document.getElementById("qr-scanner-modal");
  if (modal) {
    modal.classList.remove("active");
  }

  if (html5QrCode) {
    html5QrCode
      .stop()
      .then(() => {
        html5QrCode.clear();
        html5QrCode = null;
      })
      .catch((err) => console.error("Failed to stop scanner", err));
  }
}

function initQrScanner() {
  const readerElement = document.getElementById("qr-reader");
  const uploadContainer = document.getElementById("qr-upload-container");
  const btnCamera = document.getElementById("btn-scan-camera");
  const btnUpload = document.getElementById("btn-upload-qr");
  const fileInput = document.getElementById("qr-upload-file");

  if (!html5QrCode) {
    html5QrCode = new Html5Qrcode("qr-reader");
  }

  const onScanSuccess = (decodedText, decodedResult) => {
    closeQrScanner();
    // Assuming decodedText is the URL or Patient ID
    if (decodedText.startsWith("http") || decodedText.includes(".html")) {
      window.location.href = decodedText;
    } else {
      window.location.href = `patient_detail.html?id=${encodeURIComponent(decodedText)}`;
    }
  };

  const startCamera = () => {
    uploadContainer.style.display = "none";
    readerElement.style.display = "block";
    btnCamera.classList.add("active");
    btnCamera.style.background = "var(--primary)";
    btnUpload.classList.remove("active");
    btnUpload.style.background = "transparent";

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onScanSuccess,
        (errorMessage) => {
          /* ignore */
        },
      )
      .catch((err) => {
        console.error("Camera start failed", err);
        showUpload();
      });
  };

  const showUpload = () => {
    if (html5QrCode && html5QrCode.isScanning) {
      html5QrCode.stop().catch(console.error);
    }
    readerElement.style.display = "none";
    uploadContainer.style.display = "block";
    btnUpload.classList.add("active");
    btnUpload.style.background = "var(--primary)";
    btnCamera.classList.remove("active");
    btnCamera.style.background = "transparent";
  };

  btnCamera.onclick = startCamera;
  btnUpload.onclick = showUpload;

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length == 0) return;
    const imageFile = e.target.files[0];
    html5QrCode
      .scanFile(imageFile, true)
      .then((decodedText) => onScanSuccess(decodedText))
      .catch((err) => {
        alert("Failed to read QR code from image.");
        console.error("QR Scan file error", err);
      });
  });

  startCamera();
}
