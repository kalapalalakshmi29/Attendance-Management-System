package com.attendance.service;

import com.attendance.entity.Student;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    // Get student by roll number
    public Student getStudentByRollNo(String rollNo) {
        return studentRepository.findByRollNo(rollNo)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with roll number: " + rollNo));
    }

    // Add new student
    public Student addStudent(Student student) {
        if (studentRepository.existsByRollNo(student.getRollNo())) {
            throw new IllegalArgumentException("Roll number already exists: " + student.getRollNo());
        }
        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + student.getEmail());
        }
        return studentRepository.save(student);
    }

    // Update student
    public Student updateStudent(Long id, Student updatedStudent) {
        Student existing = getStudentById(id);

        // Check if new roll number belongs to another student
        studentRepository.findByRollNo(updatedStudent.getRollNo())
                .ifPresent(s -> {
                    if (!s.getId().equals(id)) {
                        throw new IllegalArgumentException("Roll number already used by another student");
                    }
                });

        existing.setName(updatedStudent.getName());
        existing.setRollNo(updatedStudent.getRollNo());
        existing.setDepartment(updatedStudent.getDepartment());
        existing.setYear(updatedStudent.getYear());
        existing.setEmail(updatedStudent.getEmail());

        return studentRepository.save(existing);
    }

    // Delete student
    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    // Get students by department
    public List<Student> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department);
    }

    // Total count
    public long getTotalStudents() {
        return studentRepository.count();
    }
}
