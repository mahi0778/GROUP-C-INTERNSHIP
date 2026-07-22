document.addEventListener('DOMContentLoaded', async () => {
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
          <p>Zeal College Of Engineering And Research</p>
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

  function buildNoticeCard(notice) {
    const card = document.createElement('article');
    card.className = 'notice-card reveal visible notice-stream-card';

    const meta = document.createElement('div');
    meta.className = 'notice-meta';

    const label = document.createElement('span');
    label.className = 'notice-type-badge';
    label.textContent = 'Public Notice';

    const title = document.createElement('h3');
    title.textContent = notice.title || 'Untitled Notice';

    const date = document.createElement('span');
    date.textContent = notice.date || 'Recently';

    const metaText = document.createElement('div');
    metaText.className = 'notice-heading-block';
    metaText.append(label, title);

    meta.append(metaText, date);

    const target = document.createElement('p');
    target.className = 'notice-target';
    target.textContent = notice.target || 'All Batches';

    const message = document.createElement('p');
    message.className = 'notice-message';
    message.textContent = notice.message || 'No notice details available.';

    const footer = document.createElement('div');
    footer.className = 'notice-footer';

    const author = document.createElement('span');
    author.className = 'notice-author';
    author.textContent = notice.created_by_name || 'Department Admin';

    const status = document.createElement('span');
    status.className = 'notice-status';
    status.textContent = 'Synced from HOD';

    footer.append(author, status);

    card.append(meta, target, message, footer);
    return card;
  }

  function renderNoticeCollection(container, notices, emptyMessage) {
    if (!container) return;

    container.replaceChildren();

    if (!Array.isArray(notices) || notices.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = emptyMessage;
      container.appendChild(empty);
      return;
    }

    notices.forEach((notice) => {
      container.appendChild(buildNoticeCard(notice));
    });
  }

  async function loadPublicNotices() {
    const landingList = document.getElementById('landingNoticeList');
    const publicList = document.getElementById('publicNoticeList');

    if (!landingList && !publicList) {
      return;
    }

    try {
      if (landingList) {
        const res = await fetch('api/get_notices.php?scope=public&limit=3', {
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        renderNoticeCollection(landingList, data.notices || [], 'No public notices are available yet.');
      }

      if (publicList) {
        const res = await fetch('api/get_notices.php?scope=public&limit=12', {
          headers: { 'Accept': 'application/json' }
        });
        const data = await res.json();
        renderNoticeCollection(publicList, data.notices || [], 'No public notices are available yet.');
      }
    } catch (error) {
      renderNoticeCollection(landingList, [], 'Unable to load notices right now.');
      renderNoticeCollection(publicList, [], 'Unable to load notices right now.');
    }
  }

  await loadPublicNotices();
});
