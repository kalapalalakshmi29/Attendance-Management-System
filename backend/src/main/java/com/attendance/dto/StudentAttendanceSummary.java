package com.attendance.dto;
 
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentAttendanceSummary {
    private Long studentId;
    private String studentName;
    private String rollNo;
    private String department;
    private int year;
    private long totalPresent;
    private long totalAbsent;
    private long totalDays;
    private double attendancePercentage;
}
