document.addEventListener('DOMContentLoaded', () => {
  const facultyCards = [
    { name: 'Prof. D. Shah', department: 'Computer Engineering', subject: 'DBMS', status: 'Active' },
    { name: 'Prof. N. Joshi', department: 'Computer Engineering', subject: 'Web Technology', status: 'On Leave' },
    { name: 'Prof. R. Mehta', department: 'Computer Engineering', subject: 'OOP', status: 'Active' }
  ];

  const tableRows = [
    { name: 'Prof. D. Shah', department: 'Computer Engineering', className: 'FY', division: 'FY A', subject: 'DBMS', email: 'dipali@college.edu', phone: '+91 98765 43210', status: 'Active' },
    { name: 'Prof. N. Joshi', department: 'Computer Engineering', className: 'SY', division: 'SY A', subject: 'Web Technology', email: 'nidhi@college.edu', phone: '+91 91234 56789', status: 'On Leave' }
  ];

  const cardsContainer = document.getElementById('facultyCards');
  const tableBody = document.getElementById('facultyTableBody');

  if (cardsContainer) {
    cardsContainer.innerHTML = facultyCards.map((faculty) => `
      <article class="panel-card reveal">
        <div class="panel-head">
          <h3>${faculty.name}</h3>
          <span class="badge-status ${faculty.status === 'Active' ? 'good' : 'warning'}">${faculty.status}</span>
        </div>
        <p><strong>Department:</strong> ${faculty.department}</p>
        <p><strong>Subject:</strong> ${faculty.subject}</p>
        <div class="button-row" style="margin-top: 12px;">
          <button class="btn btn-secondary">View</button>
          <button class="btn btn-primary">Edit</button>
          <button class="btn btn-secondary">Assign</button>
        </div>
      </article>
    `).join('');
  }

  if (tableBody) {
    tableBody.innerHTML = tableRows.map((row) => `
      <tr>
        <td>${row.name}</td>
        <td>${row.department}</td>
        <td>${row.className}</td>
        <td>${row.division}</td>
        <td>${row.subject}</td>
        <td>${row.email}</td>
        <td>${row.phone}</td>
        <td><span class="badge-status ${row.status === 'Active' ? 'good' : 'warning'}">${row.status}</span></td>
        <td><div class="button-row"><button class="btn btn-secondary">View</button><button class="btn btn-primary">Edit</button></div></td>
      </tr>
    `).join('');
  }
});
