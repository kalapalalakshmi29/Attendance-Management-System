import React, { useEffect, useState } from 'react';
import { getDashboard, getStudents, getByDate } from '../api/api';

export default function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [students, setStudents] = useState([]);
  const [todayList, setTodayList] = useState([]);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    getDashboard().then(r => setStats(r.data)).catch(() => {});
    getStudents().then(r => setStudents(r.data)).catch(() => {});
    getByDate(today).then(r => setTodayList(r.data)).catch(() => {});
  }, [today]);

  const statCards = stats ? [
    { icon: '👨‍🎓', label: 'Total Students',    value: stats.totalStudents,           color: 'blue' },
    { icon: '✅',   label: 'Present Today',     value: stats.presentToday,            color: 'green' },
    { icon: '❌',   label: 'Absent Today',      value: stats.absentToday,             color: 'red' },
    { icon: '📈',   label: 'Attendance %',      value: `${stats.attendancePercentageToday}%`, color: 'orange' },
  ] : [];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of today's attendance — {today}</p>
      </div>

      <div className="stats-grid">
        {statCards.map(card => (
          <div className="stat-card" key={card.label}>
            <div className={`stat-icon ${card.color}`}>{card.icon}</div>
            <div className="stat-info">
              <h3>{card.value}</h3>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent Students */}
        <div className="card">
          <h2 style={{ marginBottom: 16, fontSize: 16 }}>👨‍🎓 Recent Students</h2>
          {students.length === 0
            ? <div className="empty-state"><p>No students found</p></div>
            : <div className="table-container">
                <table>
                  <thead><tr><th>Name</th><th>Roll No</th><th>Dept</th></tr></thead>
                  <tbody>
                    {students.slice(0, 6).map(s => (
                      <tr key={s.id}>
                        <td>{s.name}</td>
                        <td>{s.rollNo}</td>
                        <td>{s.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>

        {/* Today's Attendance */}
        <div className="card">
          <h2 style={{ marginBottom: 16, fontSize: 16 }}>📋 Today's Attendance</h2>
          {todayList.length === 0
            ? <div className="empty-state"><p>No attendance marked today</p></div>
            : <div className="table-container">
                <table>
                  <thead><tr><th>Student</th><th>Roll No</th><th>Status</th></tr></thead>
                  <tbody>
                    {todayList.slice(0, 6).map(a => (
                      <tr key={a.attendanceId}>
                        <td>{a.studentName}</td>
                        <td>{a.rollNo}</td>
                        <td>
                          <span className={`badge badge-${a.status.toLowerCase()}`}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          }
        </div>
      </div>
    </div>
  );
}
