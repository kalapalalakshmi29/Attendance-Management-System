import React, { useEffect, useState } from 'react';
import { getStudents, addStudent, updateStudent, deleteStudent, getStudentByRoll } from '../api/api';

const EMPTY_FORM = { name: '', rollNo: '', department: '', year: '', email: '' };

export default function Students() {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editId, setEditId]       = useState(null);
  const [search, setSearch]       = useState('');
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);

  const load = () => getStudents().then(r => setStudents(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setError(''); setShowModal(true); };

  const openEdit = (s) => {
    setForm({ name: s.name, rollNo: s.rollNo, department: s.department, year: s.year, email: s.email });
    setEditId(s.id);
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (editId) {
        await updateStudent(editId, { ...form, year: Number(form.year) });
        setSuccess('Student updated successfully');
      } else {
        await addStudent({ ...form, year: Number(form.year) });
        setSuccess('Student added successfully');
      }
      setShowModal(false);
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(id);
      setSuccess('Student deleted successfully');
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Delete failed');
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) { load(); return; }
    try {
      const { data } = await getStudentByRoll(search.trim());
      setStudents([data]);
    } catch {
      setError('Student not found with that roll number');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Student Management</h1>
        <p>Manage all student records</p>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error   && <div className="alert alert-error">{error}</div>}

      <div className="card">
        <div className="toolbar">
          <div className="search-bar" style={{ margin: 0 }}>
            <input
              placeholder="Search by roll number..."
              value={search}
              onChange={e => { setSearch(e.target.value); if (!e.target.value) load(); }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
            />
            <button className="btn btn-secondary" onClick={handleSearch}>🔍 Search</button>
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Student</button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Name</th><th>Roll No</th>
                <th>Department</th><th>Year</th><th>Email</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0
                ? <tr><td colSpan={7}><div className="empty-state">No students found</div></td></tr>
                : students.map((s, i) => (
                    <tr key={s.id}>
                      <td>{i + 1}</td>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.rollNo}</td>
                      <td>{s.department}</td>
                      <td>Year {s.year}</td>
                      <td>{s.email}</td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(s)}>✏️ Edit</button>
                        {' '}
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s.id)}>🗑️ Delete</button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editId ? '✏️ Edit Student' : '➕ Add New Student'}</h2>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input placeholder="Enter name" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Roll Number</label>
                  <input placeholder="e.g. CS2024001" value={form.rollNo}
                    onChange={e => setForm({ ...form, rollNo: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <select value={form.department}
                    onChange={e => setForm({ ...form, department: e.target.value })} required>
                    <option value="">Select Department</option>
                    {['CSE','ECE','EEE','MECH','CIVIL','IT','MBA'].map(d =>
                      <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <select value={form.year}
                    onChange={e => setForm({ ...form, year: e.target.value })} required>
                    <option value="">Select Year</option>
                    {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="student@email.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editId ? 'Update Student' : 'Add Student')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
