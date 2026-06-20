package com.attendance.service;

import com.attendance.dto.*;
import com.attendance.entity.Attendance;
import com.attendance.entity.Attendance.AttendanceStatus;
import com.attendance.entity.Student;
import com.attendance.exception.DuplicateAttendanceException;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.StudentRepository;
import com.opencsv.CSVWriter;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    public AttendanceService(AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    // Mark attendance
    public AttendanceResponse markAttendance(AttendanceRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + request.getStudentId()));

        LocalDate date = LocalDate.parse(request.getAttendanceDate());

        if (attendanceRepository.existsByStudentAndAttendanceDate(student, date)) {
            throw new DuplicateAttendanceException("Attendance already marked for student "
                    + student.getName() + " on " + date);
        }

        Attendance attendance = Attendance.builder()
                .student(student)
                .attendanceDate(date)
                .status(AttendanceStatus.valueOf(request.getStatus()))
                .build();

        Attendance saved = attendanceRepository.save(attendance);
        return mapToResponse(saved);
    }

    // Update attendance
    public AttendanceResponse updateAttendance(Long id, String status) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance record not found with id: " + id));

        attendance.setStatus(AttendanceStatus.valueOf(status));
        return mapToResponse(attendanceRepository.save(attendance));
    }

    // Get attendance by date
    public List<AttendanceResponse> getAttendanceByDate(String date) {
        LocalDate localDate = LocalDate.parse(date);
        return attendanceRepository.findByAttendanceDate(localDate)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // Get attendance by student
    public List<AttendanceResponse> getAttendanceByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        return attendanceRepository.findByStudent(student)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // Get attendance by student and date range
    public List<AttendanceResponse> getAttendanceByStudentAndDateRange(Long studentId, String start, String end) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        return attendanceRepository.findByStudentAndAttendanceDateBetween(
                student, LocalDate.parse(start), LocalDate.parse(end))
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // Get monthly attendance
    public List<AttendanceResponse> getMonthlyAttendance(int month, int year) {
        return attendanceRepository.findByMonthAndYear(month, year)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // Dashboard stats
    public DashboardStats getDashboardStats() {
        LocalDate today = LocalDate.now();
        long totalStudents = studentRepository.count();
        long presentToday = attendanceRepository.countPresentByDate(today);
        long absentToday = attendanceRepository.countAbsentByDate(today);
        double percentage = totalStudents > 0 ? (presentToday * 100.0 / totalStudents) : 0;

        return new DashboardStats(totalStudents, presentToday, absentToday,
                Math.round(percentage * 100.0) / 100.0);
    }

    // Student attendance summary
    public StudentAttendanceSummary getStudentSummary(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));

        long present = attendanceRepository.countPresentByStudent(student);
        long absent = attendanceRepository.countAbsentByStudent(student);
        long total = present + absent;
        double percentage = total > 0 ? (present * 100.0 / total) : 0;

        return new StudentAttendanceSummary(
                student.getId(), student.getName(), student.getRollNo(),
                student.getDepartment(), student.getYear(),
                present, absent, total,
                Math.round(percentage * 100.0) / 100.0);
    }

    // Export to CSV
    public String exportToCSV(String startDate, String endDate) {
        List<Attendance> records = attendanceRepository.findByAttendanceDateBetween(
                LocalDate.parse(startDate), LocalDate.parse(endDate));

        StringWriter sw = new StringWriter();
        try (CSVWriter writer = new CSVWriter(sw)) {
            writer.writeNext(new String[]{"Attendance ID", "Student Name", "Roll No",
                    "Department", "Year", "Date", "Status"});
            for (Attendance a : records) {
                writer.writeNext(new String[]{
                        String.valueOf(a.getAttendanceId()),
                        a.getStudent().getName(),
                        a.getStudent().getRollNo(),
                        a.getStudent().getDepartment(),
                        String.valueOf(a.getStudent().getYear()),
                        a.getAttendanceDate().toString(),
                        a.getStatus().name()
                });
            }
        } catch (Exception e) {
            throw new RuntimeException("Error generating CSV: " + e.getMessage());
        }
        return sw.toString();
    }

    // Helper: Map entity to response DTO
    private AttendanceResponse mapToResponse(Attendance a) {
        return new AttendanceResponse(
                a.getAttendanceId(),
                a.getStudent().getId(),
                a.getStudent().getName(),
                a.getStudent().getRollNo(),
                a.getStudent().getDepartment(),
                a.getAttendanceDate().toString(),
                a.getStatus().name()
        );
    }
}
