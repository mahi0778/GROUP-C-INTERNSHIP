document.addEventListener('DOMContentLoaded', async () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const sidebar = document.querySelector('.sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      if (sidebar.style.display === 'block') {
        sidebar.style.display = 'none';
      } else {
        sidebar.style.display = 'block';
      }
    });
  }

  // Retrieve active session user
  let user = null;
  const storedUser = sessionStorage.getItem('attendance_user') || localStorage.getItem('attendance_user');
  if (storedUser) {
    try { user = JSON.parse(storedUser); } catch(e) {}
  }

  // Fallback to fetch session from PHP backend if available
  if (!user) {
    try {
      const res = await fetch('../api/session.php');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          user = data.user;
          sessionStorage.setItem('attendance_user', JSON.stringify(user));
        }
      }
    } catch(e) {}
  }

  if (user) {
    // Dynamic avatar initials
    const initials = user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';
    const profileChip = document.querySelector('.profile-chip');
    if (profileChip) profileChip.textContent = initials;

    // Sidebar & Topbar Greetings
    const brandSub = document.querySelector('.sidebar .brand p');
    if (brandSub && user.department) brandSub.textContent = `${user.department} (${user.role.toUpperCase()})`;

    const welcomeHeading = document.querySelector('.welcome-card h1, .brand h2');
    if (welcomeHeading && welcomeHeading.textContent.includes('Portal')) {
      // Keep portal title or refine
    }

    const profileEmail = document.querySelector('.user-email');
    if (profileEmail) profileEmail.textContent = user.email;
    const profileName = document.querySelector('.user-name');
    if (profileName) profileName.textContent = user.full_name;
  }

  // Wire up Logout
  const logoutLinks = document.querySelectorAll('a[href*="index.html"], a[href*="login.html"]');
  logoutLinks.forEach(link => {
    if (link.textContent.toLowerCase().includes('logout')) {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        sessionStorage.removeItem('attendance_user');
        localStorage.removeItem('attendance_user');
        try {
          await fetch('../api/logout.php');
        } catch(err) {}
        window.location.href = '../login.html';
      });
    }
  });
});
