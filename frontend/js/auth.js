async function register(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const aadhaar = document.getElementById('aadhaar').value;
  const password = document.getElementById('password').value;
  const selectedRoleInput = document.querySelector('input[name="role-choice"]:checked');
  const roleField = document.getElementById('role');
  const role = selectedRoleInput ? selectedRoleInput.value : roleField.value;

  if (roleField) {
    roleField.value = role;
  }

  try {
    const res = await apiRequest('/auth/register', 'POST', { name, email, phone, aadhaar, password, role });
    showToast('Registration successful! Check email for OTP.');
    
    // Store email to verify later
    localStorage.setItem('temp_email', email);
    
    setTimeout(() => {
      window.location.href = 'verify.html';
    }, 1500);
  } catch (err) {}
}

async function verifyOtp(event) {
  event.preventDefault();
  const otp = document.getElementById('otp').value;
  const email = localStorage.getItem('temp_email');

  if (!email) {
    showToast('Session expired. Please register again.', true);
    return;
  }

  try {
    const res = await apiRequest('/auth/verify-otp', 'POST', { email, otp });
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.removeItem('temp_email');
    
    showToast('Verification successful! Logging in...');
    setTimeout(() => {
      if (res.user.role === 'patient') {
        window.location.href = '../pages/patient_dashboard.html';
      } else {
        window.location.href = '../pages/dashboard.html';
      }
    }, 1000);
  } catch (err) {}
}

async function login(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await apiRequest('/auth/login', 'POST', { email, password });
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    
    showToast('Logged in successfully!');
    setTimeout(() => {
      if (res.user.role === 'patient') {
        window.location.href = '../pages/patient_dashboard.html';
      } else {
        window.location.href = '../pages/dashboard.html';
      }
    }, 1000);
  } catch (err) {}
}
