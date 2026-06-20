package com.attendance.repository;

import com.attendance.entity.Attendance;
import com.attendance.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // Check duplicate entry
    boolean existsByStudentAndAttendanceDate(Student student, LocalDate date);

    // Find by date
    List<Attendance> findByAttendanceDate(LocalDate date);

    // Find by student
    List<Attendance> findByStudent(Student student);

    // Find by student and date range
    List<Attendance> findByStudentAndAttendanceDateBetween(Student student, LocalDate start, LocalDate end);

    // Find by date range (for monthly reports)
    List<Attendance> findByAttendanceDateBetween(LocalDate start, LocalDate end);

    // Find specific record
    Optional<Attendance> findByStudentAndAttendanceDate(Student student, LocalDate date);

    // Count present by date
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.attendanceDate = :date AND a.status = 'PRESENT'")
    long countPresentByDate(@Param("date") LocalDate date);

    // Count absent by date
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.attendanceDate = :date AND a.status = 'ABSENT'")
    long countAbsentByDate(@Param("date") LocalDate date);

    // Count present by student
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student AND a.status = 'PRESENT'")
    long countPresentByStudent(@Param("student") Student student);

    // Count absent by student
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student = :student AND a.status = 'ABSENT'")
    long countAbsentByStudent(@Param("student") Student student);

    // Find by month and year
    @Query("SELECT a FROM Attendance a WHERE MONTH(a.attendanceDate) = :month AND YEAR(a.attendanceDate) = :year")
    List<Attendance> findByMonthAndYear(@Param("month") int month, @Param("year") int year);
}
