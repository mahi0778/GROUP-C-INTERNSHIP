document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const selectedRole = document.querySelector('input[name="role"]:checked')?.value || 'student';
      const targetMap = {
        student: 'dashboards/student.html',
        gfm: 'dashboards/gfm.html',
        hod: 'dashboards/hod.html'
      };

      window.location.href = targetMap[selectedRole] || 'index.html';
    });
  }
});
