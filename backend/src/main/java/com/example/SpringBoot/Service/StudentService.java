package com.example.SpringBoot.Service;


import com.example.SpringBoot.Exception.StudentNotFoundException;
import com.example.SpringBoot.Model.Student;
import com.example.SpringBoot.Repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    private final StudentRepository studentRepository;
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }
    public Student saveStudent(Student student){
        return studentRepository.save(student);
    }

    public List<Student> getStudents(){
        return studentRepository.findAll();
    }

//    public Student getStudent(int id){
////        return studentRepository.findById(id).orElseThrow(()->new StudentNotFoundException("Student with this id does'nt exist"));
//        return studentRepository.findById(id).orElse(null);
//    }

    public Student getStudent(int id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new StudentNotFoundException("Student with this id doesn't exist"));
    }
    public Student updateStudent(Student student) {
        return studentRepository.save(student);
    }
    public void deleteStudent(int id){
        studentRepository.deleteById(id);
    }
}