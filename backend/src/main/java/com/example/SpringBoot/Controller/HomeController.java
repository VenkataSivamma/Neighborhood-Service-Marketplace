package com.example.SpringBoot.Controller;
import org.springframework.web.bind.annotation.*;
@RestController
public class HomeController
{
//    @GetMapping("/hello")
//    public String home(@RequestParam String name,@RequestParam int age )
//    {
//
//        return "Hello ! How are you "+name +", My age "+age ;
//    }
//@GetMapping("/hello")
//public String home(@RequestParam (required=false) String name)
//{
//    if(name==null)
//    {
//        return "Hello Guest";
//    }
//    return "Hello "+name;
//}

    @GetMapping("/hello")
    public String home(@RequestParam (defaultValue="Monkey") String name)
    {

        return "Hello"+name;
    }
    @GetMapping("/welcome")
    public String welcome()
    {
        return "Wecome to Spring Boot";
    }
    @PostMapping("/contact")
    public String Contact()
    {
        return "Contact me when i am free";
    }
    @PutMapping("/update")
    public String studentDetails()
    {
        return "The Student Details are Updated succesfully";
    }
    @DeleteMapping("/delete")
    public String delete()
    {
        return "The Details are deleted";
    }
}