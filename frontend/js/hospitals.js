document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  loadAllHospitals();
});

async function loadAllHospitals() {
  try {
    const data = await apiRequest('/hospitals');
    renderHospitals(data);
  } catch (err) {}
}

function locateAndLoad() {
  const list = document.getElementById('hospitals-list');
  list.innerHTML = '<tr><td colspan="4" style="text-align: center;">Requesting location... <i class="ri-loader-4-line ri-spin"></i></td></tr>';
  
  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser', true);
    loadAllHospitals();
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    try {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const data = await apiRequest(`/hospitals/nearby?lat=${lat}&lng=${lng}`);
      renderHospitals(data, true);
      showToast('Found nearby hospitals successfully.');
    } catch (err) {
      loadAllHospitals();
    }
  }, (err) => {
    showToast('Location access denied. Displaying all hospitals.', true);
    loadAllHospitals();
  });
}

function renderHospitals(hospitals, hasDistance = false) {
  const list = document.getElementById('hospitals-list');
  list.innerHTML = '';
  
  if (!hospitals || hospitals.length === 0) {
    list.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted);">No hospitals found in network.</td></tr>';
    return;
  }

  hospitals.forEach(h => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td style="font-weight: 500; color: white;">${h.name}</td>
      <td style="color: ${hasDistance ? '#34d399' : 'var(--text-muted)'}; font-family: monospace;">
        ${hasDistance ? h.distance.toFixed(2) + ' km' : '---'}
      </td>
      <td style="color: var(--text-muted); font-size: 13px;">${(h.specialties || []).join(', ')}</td>
      <td style="color: var(--text-muted);">${h.contact || 'N/A'}</td>
    `;
    list.appendChild(row);
  });
}
