document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  if (header) {
    header.innerHTML = `
      <nav class="navbar">
        <a class="brand" href="index.html">
          <span class="brand-mark">A</span>
          <span>Student Attendance Management System</span>
        </a>
        <button class="menu-toggle" aria-label="Toggle navigation">☰</button>
        <div class="nav-links">
          <a href="home.html" class="${currentPage === 'home.html' ? 'active' : ''}">Home</a>
          <a href="defaulter.html" class="${currentPage === 'defaulter.html' ? 'active' : ''}">Defaulter Criteria</a>
          <a href="schedule.html" class="${currentPage === 'schedule.html' ? 'active' : ''}">Schedule</a>
          <a href="notice.html" class="${currentPage === 'notice.html' ? 'active' : ''}">Notice</a>
          <a href="about.html" class="${currentPage === 'about.html' ? 'active' : ''}">About</a>
          <a href="help.html" class="${currentPage === 'help.html' ? 'active' : ''}">Help</a>
          <a class="nav-btn" href="login.html">Login</a>
        </div>
      </nav>
    `;
  }

  if (footer) {
    footer.innerHTML = `
      <div class="footer-grid">
        <div>
          <h3>College Name</h3>
          <p>Global College of Technology</p>
          <p>Department of Academic Administration</p>
          <div class="socials">
            <a href="#">f</a>
            <a href="#">in</a>
            <a href="#">x</a>
          </div>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul>
            <li><a href="home.html">Home</a></li>
            <li><a href="defaulter.html">Defaulter Criteria</a></li>
            <li><a href="notice.html">Notice</a></li>
          </ul>
        </div>
        <div>
          <h3>Privacy</h3>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul>
            <li>support@collegeportal.edu</li>
            <li>+91 98765 43210</li>
            <li>© 2026 College Portal</li>
          </ul>
        </div>
      </div>
    `;
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item) => observer.observe(item));

  const counters = document.querySelectorAll('.counter');
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix || '';
    let current = 0;
    const duration = 1200;
    const stepTime = 30;
    const steps = Math.ceil(duration / stepTime);
    const increment = target / steps;

    const tick = () => {
      current += increment;
      if (current < target) {
        counter.textContent = `${Math.ceil(current)}${suffix}`;
        setTimeout(tick, stepTime);
      } else {
        counter.textContent = `${target}${suffix}`;
      }
    };

    tick();
  });
});
