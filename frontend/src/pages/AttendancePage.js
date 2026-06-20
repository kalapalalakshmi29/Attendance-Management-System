import React, { useEffect, useState } from 'react';
import { getStudents, markAttendance, getByDate, updateAttendance } from '../api/api';

export default function AttendancePage() {
  const [students, setStudents]     = useState([]);
  const [records, setRecords]       = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [form, setForm]             = useState({ studentId: '', attendanceDate: new Date().toISOString().split('T')[0], status: 'PRESENT' });
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState('');
  const [loading, setLoading]       = useState(false);
  const [editId, setEditId]         = useState(null);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    getStudents().then(r => setStudents(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (selectedDate) {
      getByDate(selectedDate).then(r => setRecords(r.data)).catch(() => setRecords([]));
    }
  }, [selectedDate]);

  const handleMark = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      await markAttendance(form);
      setSuccess('Attendance marked successfully!');
      getByDate(selectedDate).then(r => setRecords(r.data));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
      setTimeout(() => setError(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await updateAttendance(id, editStatus);
      setEditId(null);
      setSuccess('Attendance updated!');
      getByDate(selectedDate).then(r => setRecords(r.data));
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Update failed');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Mark Attendance</h1>
        <p>Record and manage daily student attendance</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 24 }}>
        {/* Mark Attendance Form */}
        <div className="card">
          <h2 style={{ fontSize: 16, marginBottom: 20 }}>✅ Mark Attendance</h2>
          <form onSubmit={handleMark}>
            <div className="form-group">
              <label>Select Student</label>
              <select value={form.studentId}
                onChange={e => setForm({ ...form, studentId: e.target.value })} required>
                <option value="">-- Choose Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" value={form.attendanceDate}
                onChange={e => setForm({ ...form, attendanceDate: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="PRESENT">✅ Present</option>
                <option value="ABSENT">❌ Absent</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Marking...' : 'Mark Attendance'}
            </button>
          </form>
        </div>

        {/* Attendance List by Date */}
        <div className="card">
          <div className="toolbar">
            <h2 style={{ fontSize: 16 }}>📋 Attendance for Date</h2>
            <input type="date" value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ padding: '8px 12px', border: '1px solid #dee2e6', borderRadius: 8, fontSize: 14 }} />
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr><th>#</th><th>Student Name</th><th>Roll No</th><th>Department</th><th>Status</th><th>Action</th></tr>
              </thead>
              <tbody>
                {records.length === 0
                  ? <tr><td colSpan={6}><div className="empty-state">No attendance records for this date</div></td></tr>
                  : records.map((r, i) => (
                      <tr key={r.attendanceId}>
                        <td>{i + 1}</td>
                        <td><strong>{r.studentName}</strong></td>
                        <td>{r.rollNo}</td>
                        <td>{r.department}</td>
                        <td>
                          {editId === r.attendanceId
                            ? <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                                style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #ddd' }}>
                                <option value="PRESENT">PRESENT</option>
                                <option value="ABSENT">ABSENT</option>
                              </select>
                            : <span className={`badge badge-${r.status.toLowerCase()}`}>{r.status}</span>
                          }
                        </td>
                        <td>
                          {editId === r.attendanceId
                            ? <>
                                <button className="btn btn-success btn-sm" onClick={() => handleUpdate(r.attendanceId)}>Save</button>
                                {' '}
                                <button className="btn btn-secondary btn-sm" onClick={() => setEditId(null)}>Cancel</button>
                              </>
                            : <button className="btn btn-secondary btn-sm"
                                onClick={() => { setEditId(r.attendanceId); setEditStatus(r.status); }}>
                                ✏️ Edit
                              </button>
                          }
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
