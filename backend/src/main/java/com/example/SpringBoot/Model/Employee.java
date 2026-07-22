package com.example.SpringBoot.Model;

//public class Employee {
//    private int id;
//    private String name;
//    private int salary;
//
//    public Employee() {
//
//    }
//
//    public Employee(int id, String name, int salary) {
//        this.id = id;
//        this.name = name;
//        this.salary = salary;
//    }
//
//    public void setId(int id) {
//        this.id = id;
//    }
//
//    public int getId() {
//        return id;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setSalary(int salary)
//    {
//        this.salary=salary;
//    }
//    public int getSalary()
//    {
//        return salary;
//    }
//}

import jakarta.persistence.Entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import lombok.*;
@Data
//@Builder
@Entity
//@Getter
//@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Employee
{
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private double salary;


}