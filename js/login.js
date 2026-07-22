document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const alertBox = document.getElementById('loginAlert');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');

  function showAlert(message, type = 'error') {
    if (!alertBox) return;
    alertBox.textContent = message;
    alertBox.className = `alert-box alert-${type}`;
    alertBox.style.display = 'block';
  }

  function hideAlert() {
    if (!alertBox) return;
    alertBox.style.display = 'none';
  }

  // Password Visibility Toggle
  if (togglePasswordBtn && passwordInput && eyeIcon) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      eyeIcon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
    });
  }

  // Auto-detect role on email typing
  if (emailInput) {
    emailInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      let matchedRole = null;

      if (val.includes('student') || val.includes('@gmail.com')) matchedRole = 'student';
      else if (val.includes('gfm') || val.includes('omkar') || val.includes('pushkaraj') || val.includes('shrutika')) matchedRole = 'gfm';
      else if (val.includes('hod') || val.includes('dipali')) matchedRole = 'hod';

      if (matchedRole) {
        const radio = document.querySelector(`input[name="role"][value="${matchedRole}"]`);
        if (radio) radio.checked = true;
      }
    });
  }

  // Form Submit Handler
  if (form) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      hideAlert();

      const email = emailInput ? emailInput.value.trim() : '';
      const password = passwordInput ? passwordInput.value.trim() : '';
      const selectedRole = document.querySelector('input[name="role"]:checked')?.value || 'student';

      if (!email || !password) {
        showAlert('Please enter both email address and password.');
        return;
      }

      try {
        const response = await fetch('api/login.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password, role: selectedRole })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            showAlert('Login successful! Redirecting...', 'success');
            sessionStorage.setItem('attendance_user', JSON.stringify(data.user));
            localStorage.setItem('attendance_user', JSON.stringify(data.user));
            setTimeout(() => {
              window.location.href = data.redirect;
            }, 600);
            return;
          } else {
            showAlert(data.message || 'Login failed. Please check credentials.');
            return;
          }
        } else {
          showAlert('Server error occurred during login. Please try again.');
        }
      } catch (err) {
        showAlert('Network error. Make sure your local server is running.');
      }
    });
  }
});
