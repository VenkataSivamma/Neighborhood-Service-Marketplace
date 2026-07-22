package com.example.SpringBoot.Service;

import com.example.SpringBoot.Exception.EmployeeNotFoundException;
import com.example.SpringBoot.Model.Employee;
import com.example.SpringBoot.Repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService
{
    private final EmployeeRepository employeerepository;
    public EmployeeService(EmployeeRepository employeerepository)
    {
        this.employeerepository=employeerepository;
    }

    public Employee saveEmployee(Employee employee)
    {
        return employeerepository.save(employee);
    }

    public List<Employee> getEmployee()
    {
        return employeerepository.findAll();
    }

    public Employee findEmployeeById(int id)
    {
        return employeerepository.findById(id).orElseThrow(()-> new EmployeeNotFoundException("Employee not found with this id"));
    }

    public Employee updateEmployee(Employee employee)
    {
        return employeerepository.save(employee);
    }

    public void deleteEmployee(int id)
    {
        employeerepository.deleteById(id);
    }
}
