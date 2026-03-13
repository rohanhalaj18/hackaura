document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  loadAllAlerts();
});

async function loadAllAlerts() {
  try {
    const alerts = await apiRequest('/alerts');
    const list = document.getElementById('alerts-list');
    list.innerHTML = '';

    if (!alerts || alerts.length === 0) {
      list.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No AI alerts to review.</td></tr>';
      return;
    }

    alerts.forEach(a => {
      const row = document.createElement('tr');
      const risk = a.risk_level === 'high' ? 'high' : 
                   a.risk_level === 'medium' ? 'medium' : 'low';
      
      row.innerHTML = `
        <td style="font-family: monospace; color: #818cf8; font-weight: 500;">
          <a href="patient_detail.html?id=${a.patient_id}" style="text-decoration:none; color:inherit;">${a.patient_id}</a>
        </td>
        <td><span class="badge ${risk}">${a.risk_level.toUpperCase()}</span></td>
        <td style="color: var(--text-muted); font-size: 13px;">${a.message.substring(0, 100)}...</td>
        <td style="color: var(--text-muted); font-size: 13px;">${new Date(a.created_at).toLocaleString()}</td>
        <td>
          <a href="patient_detail.html?id=${a.patient_id}" class="btn-small" style="text-decoration:none;">Investigate</a>
        </td>
      `;
      list.appendChild(row);
    });
  } catch (err) {}
}
