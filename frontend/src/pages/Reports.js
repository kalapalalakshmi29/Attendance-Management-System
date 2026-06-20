import React, { useEffect, useState } from 'react';
import { getStudents, getMonthly, getStudentSummary, exportCSV } from '../api/api';

export default function Reports() {
  const [activeTab, setActiveTab]   = useState('monthly');
  const [students, setStudents]     = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [summary, setSummary]       = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear]   = useState(now.getFullYear());
  const [exportStart, setExportStart] = useState('');
  const [exportEnd, setExportEnd]     = useState('');
  const [message, setMessage]         = useState('');

  useEffect(() => {
    getStudents().then(r => setStudents(r.data)).catch(() => {});
  }, []);

  const loadMonthly = () => {
    getMonthly(month, year).then(r => setMonthlyData(r.data)).catch(() => setMonthlyData([]));
  };

  const loadStudentSummary = () => {
    if (!selectedStudent) return;
    getStudentSummary(selectedStudent).then(r => setSummary(r.data)).catch(() => setSummary(null));
  };

  const handleExport = async () => {
    if (!exportStart || !exportEnd) { setMessage('Please select start and end dates'); return; }
    try {
      const { data } = await exportCSV(exportStart, exportEnd);
      const url  = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href  = url;
      link.setAttribute('download', `attendance_${exportStart}_${exportEnd}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMessage('CSV exported successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Export failed. Please try again.');
    }
  };

  const tabs = [
    { id: 'monthly',  label: '📅 Monthly Report' },
    { id: 'student',  label: '👤 Student Report' },
    { id: 'export',   label: '📥 Export CSV' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Reports</h1>
        <p>View and export attendance reports</p>
      </div>

      {/* Tab buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        {tabs.map(tab => (
          <button key={tab.id}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab(tab.id)}>
            {tab.label}
          </button>
        ))}
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      {/* Monthly Report */}
      {activeTab === 'monthly' && (
        <div className="card">
          <div className="toolbar">
            <h2 style={{ fontSize: 16 }}>📅 Monthly Attendance Report</h2>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <select value={month} onChange={e => setMonth(Number(e.target.value))}
                style={{ padding: '8px 12px', border: '1px solid #dee2e6', borderRadius: 8, fontSize: 14 }}>
                {['January','February','March','April','May','June',
                  'July','August','September','October','November','December']
                  .map((m, i) => <option key={i} value={i+1}>{m}</option>)}
              </select>
              <select value={year} onChange={e => setYear(Number(e.target.value))}
                style={{ padding: '8px 12px', border: '1px solid #dee2e6', borderRadius: 8, fontSize: 14 }}>
                {[2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <button className="btn btn-primary" onClick={loadMonthly}>View Report</button>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr><th>#</th><th>Student</th><th>Roll No</th><th>Department</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {monthlyData.length === 0
                  ? <tr><td colSpan={6}><div className="empty-state">Click "View Report" to load data</div></td></tr>
                  : monthlyData.map((r, i) => (
                      <tr key={r.attendanceId}>
                        <td>{i + 1}</td>
                        <td>{r.studentName}</td>
                        <td>{r.rollNo}</td>
                        <td>{r.department}</td>
                        <td>{r.attendanceDate}</td>
                        <td><span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span></td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Student Summary Report */}
      {activeTab === 'student' && (
        <div className="card">
          <h2 style={{ fontSize: 16, marginBottom: 20 }}>👤 Student Attendance Summary</h2>
          <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
            <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)}
              style={{ padding: '10px 14px', border: '1px solid #dee2e6', borderRadius: 8, fontSize: 14, flex: 1 }}>
              <option value="">-- Select a Student --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>)}
            </select>
            <button className="btn btn-primary" onClick={loadStudentSummary}>View Summary</button>
          </div>

          {summary && (
            <div>
              <div className="stats-grid" style={{ marginBottom: 20 }}>
                {[
                  { label: 'Total Days',    value: summary.totalDays,              color: 'blue',   icon: '📆' },
                  { label: 'Present Days',  value: summary.totalPresent,           color: 'green',  icon: '✅' },
                  { label: 'Absent Days',   value: summary.totalAbsent,            color: 'red',    icon: '❌' },
                  { label: 'Attendance %',  value: `${summary.attendancePercentage}%`, color: 'orange', icon: '📈' },
                ].map(card => (
                  <div className="stat-card" key={card.label}>
                    <div className={`stat-icon ${card.color}`}>{card.icon}</div>
                    <div className="stat-info">
                      <h3>{card.value}</h3>
                      <p>{card.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#f8f9fa', borderRadius: 10, padding: 20 }}>
                <h3 style={{ marginBottom: 12, fontSize: 15 }}>Student Details</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 14 }}>
                  <p><strong>Name:</strong> {summary.studentName}</p>
                  <p><strong>Roll No:</strong> {summary.rollNo}</p>
                  <p><strong>Department:</strong> {summary.department}</p>
                  <p><strong>Year:</strong> Year {summary.year}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export CSV */}
      {activeTab === 'export' && (
        <div className="card" style={{ maxWidth: 500 }}>
          <h2 style={{ fontSize: 16, marginBottom: 20 }}>📥 Export Attendance to CSV</h2>
          <div className="form-group">
            <label>Start Date</label>
            <input type="date" value={exportStart} onChange={e => setExportStart(e.target.value)} />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input type="date" value={exportEnd} onChange={e => setExportEnd(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={handleExport} style={{ width: '100%' }}>
            📥 Download CSV Report
          </button>
          <p style={{ fontSize: 13, color: '#868e96', marginTop: 12 }}>
            Exports all attendance records between the selected dates as a CSV file.
          </p>
        </div>
      )}
    </div>
  );
}
