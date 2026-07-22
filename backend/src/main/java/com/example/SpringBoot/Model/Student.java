package com.example.SpringBoot.Model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.Audited;

@Entity
@Table(name="students")

public class Student {
//    @Min(value=1,message="id must be greater then 0")
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id;
//    @NotBlank(message="Name cannot be blank")
    @Column(name="s_name")
    private String name;
//    @NotNull(message="Course Cannot be blank")
    @Column(name="s_course")
    private String course;
//    @Email()
    @Column(name="s_email")
    private String email;
//   @Pattern(regexp="^[0-9]{10}$")
    @Column(name="s_phone")
    private String  number;


//   pojo --  Plain old java object

    public Student() {
    }

    public Student(Integer id, String name, String course,String email,String number) {
        this.id = id;
        this.name = name;
        this.course = course;
        this.email=email;
        this.number=number;
    }

    public void setId(Integer id) {
        this.id = id;
    }
    public int getId() {
        return id;
    }

    public void setName(String name)
    {
        this.name=name;
    }
    public String getName()
    {
        return name;
    }

    public void setCourse(String Course)
    {
        this.course=course;
    }
    public String getCourse()
    {
        return course;
    }

    public void setEmail(String email)
    {
        this.email=email;
    }
    public String getEmail()
    {
        return email;
    }

    public void setNumber(String number)
    {
        this.number=number;
    }
    public String getNumber()
    {
        return number;
    }
}