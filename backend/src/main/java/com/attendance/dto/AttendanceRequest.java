package com.attendance.dto;
 
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceRequest {
    private Long studentId;
    private String attendanceDate; // format: yyyy-MM-dd
    private String status;         // PRESENT or ABSENT
}
