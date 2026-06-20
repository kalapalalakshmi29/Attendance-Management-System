package com.attendance.controller;

import com.attendance.dto.*;
import com.attendance.service.AttendanceService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    // POST mark attendance
    @PostMapping("/mark")
    public ResponseEntity<AttendanceResponse> markAttendance(@RequestBody AttendanceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(attendanceService.markAttendance(request));
    }

    // PUT update attendance status
    @PutMapping("/{id}")
    public ResponseEntity<AttendanceResponse> updateAttendance(@PathVariable Long id,
                                                               @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(attendanceService.updateAttendance(id, body.get("status")));
    }

    // GET attendance by date
    @GetMapping("/date/{date}")
    public ResponseEntity<List<AttendanceResponse>> getByDate(@PathVariable String date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }

    // GET attendance by student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceResponse>> getByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudent(studentId));
    }

    // GET attendance by student and date range
    @GetMapping("/student/{studentId}/range")
    public ResponseEntity<List<AttendanceResponse>> getByStudentAndRange(
            @PathVariable Long studentId,
            @RequestParam String start,
            @RequestParam String end) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStudentAndDateRange(studentId, start, end));
    }

    // GET monthly attendance
    @GetMapping("/monthly")
    public ResponseEntity<List<AttendanceResponse>> getMonthly(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(attendanceService.getMonthlyAttendance(month, year));
    }

    // GET dashboard stats
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard() {
        return ResponseEntity.ok(attendanceService.getDashboardStats());
    }

    // GET student attendance summary
    @GetMapping("/summary/{studentId}")
    public ResponseEntity<StudentAttendanceSummary> getStudentSummary(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentSummary(studentId));
    }

    // GET export CSV
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportCSV(@RequestParam String start, @RequestParam String end) {
        String csv = attendanceService.exportToCSV(start, end);
        byte[] data = csv.getBytes();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "attendance_report.csv");
        return ResponseEntity.ok().headers(headers).body(data);
    }
}
