package school.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import school.dto.course.CourseResponse;
import school.dto.enrollment.EnrollmentResponse;
import school.dto.student.StudentCreateRequest;
import school.dto.student.StudentPatchRequest;
import school.dto.student.StudentResponse;
import school.dto.student.StudentUpdateRequest;
import school.services.StudentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/")
public class StudentController {

	private final StudentService studentService;

	
	
   //Get all the Students
	@GetMapping("students")
	public List<StudentResponse> getStudents()
	{
		return studentService.getStudents();
	}
	
	//Get Students By Id
	@GetMapping("students/{id}")
	public StudentResponse getStudent(@PathVariable long id)
	{
		return studentService.getStudent(id);
	}
	
	
	//Get Students Enrollments
	@GetMapping("students/{stud_id}/enrollments")
	public List<EnrollmentResponse> getEnrollments(@PathVariable long stud_id)
	{
		return studentService.getEnrollments(stud_id);
		
	}
	
	//Get Student Available Courses
	@GetMapping("students/{stud_id}/courses/available")
	public List<CourseResponse> getAvailableCourses(@PathVariable long stud_id)
	{
		return studentService.getAvailableCourses(stud_id);
	}
	
	
	// Register the Student
	@PostMapping("students/register")
	public StudentResponse RegisterStud(@RequestBody StudentCreateRequest student)
	{
		return studentService.RegisterStudent(student);
	}
	
	@PutMapping("/{id}")
	public StudentResponse updateStudent(
	        @PathVariable Long id,
	        @Valid @RequestBody StudentUpdateRequest request) {

	    StudentResponse response = studentService.updateStudent(id, request);
	    return response;
	}
	
	//Update The Student 
	@PatchMapping("students/{stud_id}")
	public StudentResponse patchStudent(@RequestBody StudentPatchRequest student,@PathVariable long stud_id )
	{
		
		return studentService.patchStudent(student,stud_id);
	}
	
	//register the department for a student
	@PutMapping("students/department/{stud_id}/{dept_id}")
	public StudentResponse updateDepartment(@PathVariable long stud_id,@PathVariable long dept_id )
	{
			return studentService.updateDepartment(stud_id,dept_id);
	}
	
	//Delete The Student
	@DeleteMapping("students/{stud_id}")
	public Map<String,Object> delStudent(@PathVariable long stud_id )
	{
		 return studentService.delStudent(stud_id);
	}
	
	//Delete the Student Enrollment
	@DeleteMapping("students/enroll/{enroll_id}")
	public String delStudentEnroll(@PathVariable long enroll_id )
	{
		return studentService.delStudentEnroll(enroll_id);
	}
	
}
