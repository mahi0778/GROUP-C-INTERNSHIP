document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const alertBox = document.getElementById('loginAlert');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');
  const demoChips = document.querySelectorAll('.demo-chip');

  // Static demo accounts for client-side fallback (if PHP server is not running)
  const fallbackAccounts = [
    {
      email: 'student@college.edu',
      password: 'student123',
      role: 'student',
      full_name: 'Rahul Sharma',
      department: 'Computer Engineering',
      roll_or_emp_id: 'STU-101',
      redirect: 'dashboards/student.html'
    },
    {
      email: 'gfm@college.edu',
      password: 'gfm123',
      role: 'gfm',
      full_name: 'Prof. Aniket Verma',
      department: 'Computer Engineering',
      roll_or_emp_id: 'GFM-204',
      redirect: 'dashboards/gfm.html'
    },
    {
      email: 'hod@college.edu',
      password: 'hod123',
      role: 'hod',
      full_name: 'Dr. Dipali Shende',
      department: 'Computer Engineering',
      roll_or_emp_id: 'HOD-001',
      redirect: 'hod/dashboard.html'
    },
    {
      email: 'dipali.shende@college.edu',
      password: 'hod123',
      role: 'hod',
      full_name: 'Dr. Dipali Shende',
      department: 'Computer Engineering',
      roll_or_emp_id: 'HOD-001',
      redirect: 'hod/dashboard.html'
    }
  ];

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

  // Quick Demo Buttons Handler
  demoChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const role = chip.dataset.role;
      const email = chip.dataset.email;
      const pass = chip.dataset.pass;

      if (emailInput) emailInput.value = email;
      if (passwordInput) passwordInput.value = pass;

      const radio = document.querySelector(`input[name="role"][value="${role}"]`);
      if (radio) radio.checked = true;

      hideAlert();
    });
  });

  // Auto-detect role on email typing
  if (emailInput) {
    emailInput.addEventListener('input', (e) => {
      const val = e.target.value.toLowerCase().trim();
      let matchedRole = null;

      if (val.includes('student')) matchedRole = 'student';
      else if (val.includes('gfm')) matchedRole = 'gfm';
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
        // Try calling PHP backend API first
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
        }
      } catch (err) {
        // If fetch fails (e.g. running statically without local PHP server), perform client-side validation
      }

      // Client-side Fallback Validation
      const account = fallbackAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

      if (!account || account.password !== password) {
        showAlert('Invalid email or password. Use demo buttons or credentials: student@college.edu (student123), gfm@college.edu (gfm123), hod@college.edu (hod123).');
        return;
      }

      if (account.role !== selectedRole) {
        showAlert(`Account role is "${account.role.toUpperCase()}", but "${selectedRole.toUpperCase()}" is selected. Please select "${account.role.toUpperCase()}".`);
        return;
      }

      showAlert('Login successful! Redirecting...', 'success');
      const userObj = {
        id: 1,
        full_name: account.full_name,
        email: account.email,
        role: account.role,
        department: account.department,
        roll_or_emp_id: account.roll_or_emp_id
      };

      sessionStorage.setItem('attendance_user', JSON.stringify(userObj));
      localStorage.setItem('attendance_user', JSON.stringify(userObj));

      setTimeout(() => {
        window.location.href = account.redirect;
      }, 600);
    });
  }
});
