package com.example.SpringBoot.Repository;

import com.example.SpringBoot.Model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository
        extends JpaRepository<Student,Integer> {

}