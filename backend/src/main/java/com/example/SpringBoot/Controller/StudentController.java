package com.example.SpringBoot.Controller;

import com.example.SpringBoot.Model.Student;
import com.example.SpringBoot.Service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
//@CrossOrigin
@RestController
@RequestMapping("/student")
//@CrossOrigin(origins="http://localhost:5173/")
public class StudentController
{

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @PostMapping
    public ResponseEntity<Student> saveStudent(@Valid @RequestBody Student student) {
        Student saved =studentService.saveStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<Student> getStudents() {
        return studentService.getStudents();
    }

    @GetMapping("/{id}")
    public Student getStudent(@PathVariable int id) {
        return studentService.getStudent(id);
    }

    @PutMapping()
    public Student updateStudent(@RequestBody Student student)
    {
        return studentService.updateStudent(student);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteStudent(@PathVariable int id)
    {
        studentService.deleteStudent(id);
    }
}





//@RestController
//public class StudentController

//    @GetMapping("/student/{name}/{age}")
//    public String getStudent(@PathVariable String name,@PathVariable int age)
//    {
//        return "Hello! My Name is "+name+" and I am "+age+"Years old";
//  }
//@GetMapping("/add/{a}/{b}")
//public String getStudent(@PathVariable int a,@PathVariable int b)
//{
//    return "sum of a and b "+(a+b);
//}

//@GetMapping("/student")
//public Student getStudent()
//{
//   return "Hello student ";
//    Student st=new Student(1,"venkat","CST");
//    return st;
//}

//@GetMapping("/list")
//public List<Student> getStudent()
//{
//    List<Student> list=new ArrayList<>();
//    list.add( new Student(1,"venkat","CST"));
//    list.add(new Student(2,"Thaara","CSE"));
//    list.add(new Student(3,"Maaya","CSD"));
//    return list;
//}

//    @PostMapping("/student")
//    public String  AddStudent(@RequestBody Student student)
//    {
//        System.out.println(student.getName());
//        System.out.println(student.getId());
//        System.out.println(student.getCourse());
//        return student.getName()+" Added Successfully";
//    }

//    @PostMapping("/student")
//    public Student  AddStudent(@RequestBody Student student)
//    {
//        student.setName("Kothi");
//        return student;
//    }

//    @PostMapping("/student")
//    public Student addStudent(@Valid @RequestBody Student student) {
//
//     student.setName("Kothi");
//
//        return student;
//    }
//
//@PostMapping("/student")
//public Student addStudent( @RequestBody Student student) {
//
//    student.setName("Kothi");
//
//    return student;
//}
//    @PutMapping("/student")
//    public String studentDetails()
//    {
//        return "Put / Update Student details";
//    }
//    @DeleteMapping("/student")
//    public String delete()
//    {
//        return "Delete student details";
//    }


