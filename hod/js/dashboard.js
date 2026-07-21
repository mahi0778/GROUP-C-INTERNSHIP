document.addEventListener('DOMContentLoaded', async () => {
  const shell = document.querySelector('.app-shell');
  const sidebar = document.querySelector('.sidebar');
  const toggle = document.querySelector('.menu-toggle');
  const loading = document.querySelector('.page-loading');
  const revealItems = document.querySelectorAll('.reveal');

  if (loading) {
    loading.style.display = 'block';
    setTimeout(() => {
      loading.style.display = 'none';
      revealItems.forEach((item) => item.classList.add('visible'));
    }, 600);
  }

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('is-collapsed');
    });
  }

  if (shell) {
    shell.addEventListener('click', (event) => {
      if (window.innerWidth <= 860 && sidebar && !sidebar.classList.contains('is-collapsed')) {
        const clickedInsideSidebar = sidebar.contains(event.target);
        if (!clickedInsideSidebar) {
          sidebar.classList.add('is-collapsed');
        }
      }
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.14 });

  revealItems.forEach((item) => observer.observe(item));

  // Retrieve active session user
  let user = null;
  const storedUser = sessionStorage.getItem('attendance_user') || localStorage.getItem('attendance_user');
  if (storedUser) {
    try { user = JSON.parse(storedUser); } catch(e) {}
  }

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
    // Update HOD Name in Sidebar & Greetings
    const profileMetaH2 = document.querySelector('.sidebar-profile .profile-meta h2');
    if (profileMetaH2) profileMetaH2.textContent = user.full_name;

    const profileBadge = document.querySelector('.sidebar-profile .profile-badge');
    if (profileBadge) profileBadge.textContent = user.role.toUpperCase();

    const welcomeH1 = document.querySelector('.welcome-card h1');
    if (welcomeH1) welcomeH1.textContent = `Welcome, ${user.full_name}`;

    // Profile Page specific elements
    const profileCardH2 = document.querySelector('.profile-details h2');
    if (profileCardH2) profileCardH2.textContent = user.full_name;

    const profileEmail = document.querySelector('.profile-details p:nth-of-type(2)');
    if (profileEmail && profileEmail.innerHTML.includes('fa-envelope')) {
      profileEmail.innerHTML = `<i class="fa-solid fa-envelope"></i> ${user.email}`;
    }

    const profileDept = document.querySelector('.profile-details p:nth-of-type(3)');
    if (profileDept && profileDept.innerHTML.includes('fa-building-columns') && user.department) {
      profileDept.innerHTML = `<i class="fa-solid fa-building-columns"></i> ${user.department}`;
    }
  }

  // Logout Handler
  const logoutLinks = document.querySelectorAll('a[href*="index.html"]');
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
