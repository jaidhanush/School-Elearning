package school.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import school.dto.EnrollmentDto;
import school.dto.StudentDto;
import school.models.Course;
import school.models.Students;
import school.repository.DepartmentRepo;
import school.services.StudentService;

@RestController
@RequestMapping("/api/")
public class StudentController {
	
	@Autowired
	private StudentService studservice;

	@Autowired
	private DepartmentRepo deptrepo;
	
	
   
	@GetMapping("students")
	public List<StudentDto> getStudents()
	{
		return studservice.getStudents();
	}
	
	@GetMapping("students/{id}")
	public StudentDto getStudent(@PathVariable long id)
	{
		return studservice.getStudent(id);
	}
	
	
	
	@GetMapping("students/{stud_id}/enrollments")
	public List<EnrollmentDto> getEnrollments(@PathVariable long stud_id)
	{
		return studservice.getEnrollments(stud_id);
		
	}
	
	@GetMapping("students/{stud_id}/courses/available")
	public List<Course> getAvailableCourses(@PathVariable long stud_id)
	{
		return studservice.getAvailableCourses(stud_id);
	}
	
	
	//register the department for a student
	@PutMapping("students/department/{stud_id}/{dept_id}")
	public StudentDto updateDepartment(@PathVariable long stud_id,@PathVariable long dept_id )
	{
			return studservice.updateDepartment(stud_id,dept_id);
	}
	
	// Register the Student
	@PostMapping("students/register")
	public StudentDto RegisterStud(@RequestBody Students stud)
	{
		return studservice.RegisterStudent(stud);
	}
	
	@PutMapping("students/{stud_id}")
	public StudentDto putStudent(@RequestBody Students student,@PathVariable long stud_id )
	{
		
		return studservice.putStudent(student,stud_id);
	}
	
	@DeleteMapping("students/{stud_id}")
	public Map<String,Object> delStudent(@PathVariable long stud_id )
	{
		 return studservice.delStudent(stud_id);
	}
	
	@DeleteMapping("students/enroll/{enroll_id}")
	public String delStudentEnroll(@PathVariable long enroll_id )
	{
		return studservice.delStudentEnroll(enroll_id);
	}
	
}
