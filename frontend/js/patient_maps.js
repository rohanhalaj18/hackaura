document.addEventListener('DOMContentLoaded', () => {
  requireAuth();
  loadMapHospitals();
});

let map = null;
let currentMarkers = [];

function loadMapHospitals() {
  const listContainer = document.getElementById('closest-hospitals');
  
  if (!navigator.geolocation) {
    showToast('Geolocation not supported.', true);
    return;
  }

  listContainer.innerHTML = '<div style="color:var(--text-muted); text-align:center;">Locating you...</div>';

  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    
    // Initialize Map if it doesn't exist
    if (!map) {
       map = L.map('map').setView([lat, lng], 13);
       L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
         subdomains: 'abcd',
         maxZoom: 20
       }).addTo(map);
    } else {
       map.setView([lat, lng], 13);
       // Clear old markers
       currentMarkers.forEach(m => map.removeLayer(m));
       currentMarkers = [];
    }

    // Add user marker
    const userMarker = L.circleMarker([lat, lng], {
         radius: 8,
         fillColor: "#4f46e5",
         color: "#ffffff",
         weight: 2,
         opacity: 1,
         fillOpacity: 0.8
    }).addTo(map);
    userMarker.bindPopup("<b>You are here</b>").openPopup();
    currentMarkers.push(userMarker);

    try {
      const data = await apiRequest(`/hospitals/nearby?lat=${lat}&lng=${lng}`);
      
      listContainer.innerHTML = '';
      
      if (!data || data.length === 0) {
         listContainer.innerHTML = '<span style="color:var(--text-muted);">No partnered hospitals found nearby.</span>';
         return;
      }
      
      data.forEach(h => {
         // Plot on Map
         const marker = L.marker([h.latitude, h.longitude]).addTo(map);
         marker.bindPopup(`<b>${h.name}</b><br>${(h.specialties||[]).join(', ')}<br>${h.distance.toFixed(1)} km`);
         currentMarkers.push(marker);
         
         // Add to Sidebar specific list
         const item = document.createElement('div');
         item.style.cssText = "background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); cursor:pointer; transition: transform 0.2s;";
         
         item.onmouseover = () => { item.style.transform = 'translateY(-2px)'; item.style.background = 'rgba(79,70,229,0.1)'; };
         item.onmouseout = () => { item.style.transform = ''; item.style.background = 'rgba(255,255,255,0.05)'; };
         item.onclick = () => {
             map.flyTo([h.latitude, h.longitude], 16);
             marker.openPopup();
         };
         
         item.innerHTML = `
           <div style="font-weight:600; font-size:16px; margin-bottom:4px; color:white;">${h.name}</div>
           <div style="font-size:13px; color:var(--success); margin-bottom:8px;">
             <i class="ri-route-line"></i> ${h.distance.toFixed(2)} km away
           </div>
           <div style="font-size:12px; color:var(--text-muted);">
             ${(h.specialties || ['General Medicine']).join(', ')}
           </div>
           ${h.contact ? `<div style="font-size:12px; color:#a5b4fc; margin-top:8px;"><i class="ri-phone-fill"></i> ${h.contact}</div>` : ''}
         `;
         listContainer.appendChild(item);
      });
      
      showToast('Map updated with nearby centers');
    } catch (err) {}
  }, (err) => {
    listContainer.innerHTML = '<span style="color:var(--danger)">Location access denied. Cannot load map markers.</span>';
  });
}
