package com.example.SpringBoot.Repository;

import com.example.SpringBoot.Model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface  EmployeeRepository extends JpaRepository<Employee,Integer>
{

}
