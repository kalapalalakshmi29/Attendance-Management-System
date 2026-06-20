import axios from 'axios';

// Base API instance
const API = axios.create({ baseURL: '/api' });

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────
export const login = (data) => API.post('/auth/login', data);

// ── Students ──────────────────────────────────────────
export const getStudents      = ()           => API.get('/students');
export const getStudentById   = (id)         => API.get(`/students/${id}`);
export const getStudentByRoll = (roll)       => API.get(`/students/roll/${roll}`);
export const addStudent       = (data)       => API.post('/students', data);
export const updateStudent    = (id, data)   => API.put(`/students/${id}`, data);
export const deleteStudent    = (id)         => API.delete(`/students/${id}`);

// ── Attendance ────────────────────────────────────────
export const markAttendance   = (data)       => API.post('/attendance/mark', data);
export const updateAttendance = (id, status) => API.put(`/attendance/${id}`, { status });
export const getByDate        = (date)       => API.get(`/attendance/date/${date}`);
export const getByStudent     = (id)         => API.get(`/attendance/student/${id}`);
export const getMonthly       = (month, year)=> API.get(`/attendance/monthly?month=${month}&year=${year}`);
export const getDashboard     = ()           => API.get('/attendance/dashboard');
export const getStudentSummary= (id)         => API.get(`/attendance/summary/${id}`);
export const exportCSV        = (start, end) =>
  API.get(`/attendance/export?start=${start}&end=${end}`, { responseType: 'blob' });
