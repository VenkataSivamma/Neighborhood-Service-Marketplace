package com.example.SpringBoot.Exception;
public class StudentNotFoundException extends RuntimeException
{
    public StudentNotFoundException(String message)
    {
        super(message);
    }
}