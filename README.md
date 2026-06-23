# For Live Attendance Management System Goto:
https://attendance-management-system-1-45ed.onrender.com
## The project is deployed using free cloud services (Render + Aiven). The database may automatically suspend after long inactivity and may require a short startup time before use.

# Attendance Management System

A full-stack web application built with **Spring Boot**, **React.js**, and **MySQL**.

---

## Screenshots

### Login Page
![Login Page](screenshots/Screenshot%202026-06-20%20213829.png)

### Dashboard
![Dashboard](screenshots/Screenshot%202026-06-20%20213845.png)

### Students Page
![Students](screenshots/Screenshot%202026-06-20%20213910.png)

### Attendance Page
![Attendance](screenshots/Screenshot%202026-06-20%20213941.png)

---

## Project Structure

```
Attendance Management System/
├── backend/                        # Spring Boot application
│   ├── pom.xml
│   └── src/main/java/com/attendance/
│       ├── AttendanceManagementApplication.java
│       ├── entity/
│       │   ├── Student.java
│       │   └── Attendance.java
│       ├── repository/
│       │   ├── StudentRepository.java
│       │   └── AttendanceRepository.java
│       ├── service/
│       │   ├── StudentService.java
│       │   └── AttendanceService.java
│       ├── controller/
│       │   ├── AuthController.java
│       │   ├── StudentController.java
│       │   └── AttendanceController.java
│       ├── dto/
│       │   ├── LoginRequest.java / LoginResponse.java
│       │   ├── AttendanceRequest.java / AttendanceResponse.java
│       │   ├── DashboardStats.java
│       │   └── StudentAttendanceSummary.java
│       ├── security/
│       │   ├── JwtUtil.java
│       │   ├── JwtAuthFilter.java
│       │   └── SecurityConfig.java
│       └── exception/
│           ├── GlobalExceptionHandler.java
│           ├── ResourceNotFoundException.java
│           └── DuplicateAttendanceException.java
├── frontend/                       # React application
│   ├── package.json
│   └── src/
│       ├── App.js
│       ├── index.js / index.css
│       ├── api/api.js
│       ├── context/AuthContext.js
│       ├── components/Layout.js
│       └── pages/
│           ├── Login.js
│           ├── Dashboard.js
│           ├── Students.js
│           ├── AttendancePage.js
│           └── Reports.js
├── screenshots/
└── database/
    └── schema.sql
```

---

## Prerequisites

- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.8+
- VS Code

---

## Setup Instructions

### Step 1 — MySQL Database

1. Open MySQL Workbench or MySQL CLI
2. Run the schema file:
```sql
source C:/Attendence Management System/database/schema.sql
```

### Step 2 — Backend (Spring Boot)

1. Update `src/main/resources/application.properties` with your MySQL credentials:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```
2. Open terminal and run:
```bash
cd backend
mvn spring-boot:run
```
3. Backend starts at: `http://localhost:8080`

### Step 3 — Frontend (React)

```bash
cd frontend
npm install
npm start
```
Frontend starts at: `http://localhost:3000`

---

## Login Credentials

| Username | Password |
|----------|----------|
| admin    | admin123 |

---

## API Endpoints

### Auth
| Method | Endpoint           | Description   |
|--------|--------------------|---------------|
| POST   | /api/auth/login    | Admin login   |

### Students
| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| GET    | /api/students                   | Get all students         |
| GET    | /api/students/{id}              | Get student by ID        |
| GET    | /api/students/roll/{rollNo}     | Search by roll number    |
| GET    | /api/students/department/{dept} | Filter by department     |
| POST   | /api/students                   | Add new student          |
| PUT    | /api/students/{id}              | Update student           |
| DELETE | /api/students/{id}              | Delete student           |

### Attendance
| Method | Endpoint                              | Description                    |
|--------|---------------------------------------|--------------------------------|
| POST   | /api/attendance/mark                  | Mark attendance                |
| PUT    | /api/attendance/{id}                  | Update attendance status       |
| GET    | /api/attendance/date/{date}           | Get attendance by date         |
| GET    | /api/attendance/student/{id}          | Get attendance by student      |
| GET    | /api/attendance/student/{id}/range    | Get by student + date range    |
| GET    | /api/attendance/monthly?month=&year=  | Monthly attendance report      |
| GET    | /api/attendance/dashboard             | Dashboard statistics           |
| GET    | /api/attendance/summary/{studentId}   | Student attendance summary     |
| GET    | /api/attendance/export?start=&end=    | Export CSV report              |

---

## Features

- JWT-based secure authentication
- Full CRUD for student management
- Mark Present/Absent with duplicate prevention
- Daily and monthly attendance reports
- Student-wise attendance percentage tracking
- CSV export for date range reports
- Responsive modern UI

---

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | React.js 18, React Router v6, Axios |
| Backend   | Spring Boot 3.2, Spring Security, JPA |
| Database  | MySQL 8.0               |
| Auth      | JWT (jjwt 0.11.5)       |
| Export    | OpenCSV                 |
| Build     | Maven                   |
