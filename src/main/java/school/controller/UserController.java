package school.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import school.models.Users;
import school.services.UserService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;

   
    @PostMapping("/register")
    public Map<String, String> createUser(@Valid @RequestBody Users user) {
        return service.register(user);
    }
    
    @GetMapping
    public List<Users> getAllUsers()
    {
    	return service.getAllUsers();
    }

  
//    @GetMapping("/{id}")
//    public Users getUser(@PathVariable long id) {
//        return service.getUser(id);
//    }

    // GET USER BY EMAIL
//    @GetMapping("/email/{email}")
//    public Users getUserByEmail(@PathVariable String email) {
//        return service.getByEmail(email);
//    }

    // UPDATE USER
//    @PutMapping("/{id}")
//    public Users update(@PathVariable long id, @RequestBody Users user) {
//        return service.updateUser(id, user);
//    }

    // DELETE USER
    @DeleteMapping("/{id}")
    public String delete(@PathVariable long id) {
        return service.deleteUser(id);
    }

    // LOGIN
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Users user) {
        return service.login(user.getEmail(), user.getPassword());
    }
    
    @PutMapping("/resetpassword")
    public String resetPassword(@RequestBody Map<String, String> request)
    {
		return service.resetPassword(request);
    	
    }
    
    @PutMapping("/forgetpassword")
    public String forgetPassword(Map<String, String> mail)
    {
    	return service.forgetPassword(mail);
    }
    
}
