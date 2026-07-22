package com.example.SpringBoot.Exception;

public class EmployeeNotFoundException extends RuntimeException
{
    public EmployeeNotFoundException(String message) {
        super(message);
    }
}
