package com.attendance.repository; 

import com.attendance.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRollNo(String rollNo);

    List<Student> findByDepartment(String department);

    List<Student> findByYear(Integer year);

    boolean existsByRollNo(String rollNo);

    boolean existsByEmail(String email);
}
