package com.example.SpringBoot.Controller;

import com.example.SpringBoot.Model.Employee;
import com.example.SpringBoot.Service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("employee")
public class EmployeeController
{
    private final EmployeeService employeeservice;
    public EmployeeController(EmployeeService employeeservice)
    {
        this.employeeservice=employeeservice;
    }

    //create
    @PostMapping()
    public Employee saveEmployee(@Valid @RequestBody Employee employee)
    {
        return employeeservice.saveEmployee(employee);
    }

    //Read
    @GetMapping()
    public List<Employee> getEmployee()
    {
        return employeeservice.getEmployee();
    }

    //Update
    @PutMapping()
    public Employee updateEmployee(@RequestBody Employee employee)
    {
        return employeeservice.updateEmployee(employee);
    }

    //delete
    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable int id)
    {
        employeeservice.deleteEmployee(id);
    }

    @GetMapping("/{id}")
    public Employee findEmployeeById(@PathVariable int id)
    {
        return employeeservice.findEmployeeById(id);
    }
}