document.addEventListener('DOMContentLoaded', () => {
  const rows = [
    { roll: '2101', prn: 'PRN-112', name: 'Rahul Kulkarni', division: 'FY A', attendance: '54%', sessions: 45, attended: 24, status: 'Below 60%', statusClass: 'danger' },
    { roll: '2102', prn: 'PRN-113', name: 'Aditi Sharma', division: 'FY B', attendance: '81%', sessions: 45, attended: 37, status: 'Above 75%', statusClass: 'good' },
    { roll: '2103', prn: 'PRN-114', name: 'Devansh Rao', division: 'FY C', attendance: '69%', sessions: 45, attended: 31, status: '60–74%', statusClass: 'warning' },
    { roll: '2201', prn: 'PRN-201', name: 'Meera Joshi', division: 'SY A', attendance: '88%', sessions: 40, attended: 35, status: 'Above 75%', statusClass: 'good' }
  ];

  const body = document.getElementById('attendanceTableBody');
  const search = document.getElementById('studentSearch');

  const renderRows = () => {
    if (!body) return;
    const query = (search?.value || '').trim().toLowerCase();
    const filtered = rows.filter((row) => row.name.toLowerCase().includes(query));
    body.innerHTML = filtered.map((row) => `
      <tr>
        <td>${row.roll}</td>
        <td>${row.prn}</td>
        <td>${row.name}</td>
        <td>${row.division}</td>
        <td>${row.attendance}</td>
        <td>${row.sessions}</td>
        <td>${row.attended}</td>
        <td><span class="badge-status ${row.statusClass}">${row.status}</span></td>
        <td><div class="button-row"><button class="btn btn-secondary">View</button><button class="btn btn-primary">Export</button></div></td>
      </tr>
    `).join('');
  };

  search?.addEventListener('input', renderRows);
  renderRows();
});
