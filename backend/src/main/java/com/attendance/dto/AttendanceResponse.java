package com.attendance.dto;
 
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceResponse {
    private Long attendanceId;
    private Long studentId;
    private String studentName;
    private String rollNo;
    private String department;
    private String attendanceDate;
    private String status;
}
