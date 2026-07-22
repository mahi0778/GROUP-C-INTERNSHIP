document.addEventListener('DOMContentLoaded', async () => {
  const body = document.getElementById('defaulterTableBody');
  const search = document.getElementById('defaulterSearchInput');
  const divSelect = document.getElementById('defaulterDivSelect');

  let rows = [];

  const renderRows = () => {
    if (!body) return;
    const query = (search?.value || '').trim().toLowerCase();
    const selectedDiv = divSelect?.value || 'All';

    // Defaulters are students with attendance < 75%
    const filtered = rows.filter((row) => {
      const pct = parseInt(row.attendance_pct);
      const isDefaulter = pct < 75;
      
      const matchesSearch = row.name.toLowerCase().includes(query) || row.roll.toLowerCase().includes(query) || row.prn.toLowerCase().includes(query);
      const matchesDiv = selectedDiv === 'All' || row.division === selectedDiv;

      return isDefaulter && matchesSearch && matchesDiv;
    });

    if (filtered.length === 0) {
      body.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 2rem; color: var(--text-secondary);">No defaulters found matching criteria.</td></tr>`;
      return;
    }

    body.innerHTML = filtered.map((row) => {
      const pct = parseInt(row.attendance_pct);
      let status = 'Warning';
      let statusClass = 'warning';
      let reason = 'Frequent Absences';
      
      if (pct < 60) {
        status = 'Critical Defaulter';
        statusClass = 'danger';
        reason = 'Critical attendance shortage';
      }

      // Roll No, PRN, Name, Division, Attendance %, Reason, Guardian Status, Notice Sent, Action
      return `
        <tr class="danger-row">
          <td><strong>${row.roll}</strong></td>
          <td>${row.prn}</td>
          <td>${row.name}</td>
          <td>${row.division}</td>
          <td><strong style="color: #EF4444">${pct}%</strong></td>
          <td>${reason}</td>
          <td><span class="badge-status ${statusClass}">${status}</span></td>
          <td>Yes</td>
          <td>
            <button class="btn btn-secondary" onclick="alert('Sending warning details for ${row.name}')">View</button>
          </td>
        </tr>
      `;
    }).join('');
  };

  try {
    const res = await fetch('../api/get_hod_attendance.php');
    if (res.ok) {
      const result = await res.json();
      if (result.success && result.data) {
        rows = result.data;
        renderRows();
      }
    }
  } catch (err) {
    console.error("Error loading defaulters:", err);
  }

  search?.addEventListener('input', renderRows);
  divSelect?.addEventListener('change', renderRows);
});
