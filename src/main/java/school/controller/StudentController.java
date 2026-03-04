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

import io.swagger.v3.oas.annotations.Operation;
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

	
	@Operation(
		summary = "Get all students",
		description = "Retrieves a list of all students available in the system."
	)
	@GetMapping("students")
	public List<StudentResponse> getStudents() {
		return studentService.getStudents();
	}



	@Operation(
		summary = "Get student by ID",
		description = "Fetches the details of a specific student using the provided student ID."
	)
	@GetMapping("students/{id}")
	public StudentResponse getStudent(@PathVariable long id) {
		return studentService.getStudent(id);
	}



	@Operation(
		summary = "Get student enrollments",
		description = "Retrieves all enrollments associated with a specific student."
	)
	@GetMapping("students/{stud_id}/enrollments")
	public List<EnrollmentResponse> getEnrollments(@PathVariable long stud_id) {
		return studentService.getEnrollments(stud_id);
	}



	@Operation(
		summary = "Get available courses for a student",
		description = "Retrieves all courses that a student can enroll in but has not yet registered."
	)
	@GetMapping("students/{stud_id}/courses/available")
	public List<CourseResponse> getAvailableCourses(@PathVariable long stud_id) {
		return studentService.getAvailableCourses(stud_id);
	}


	@Operation(
		summary = "Register a new student",
		description = "Creates a new student in the system using the provided student details."
	)
	@PostMapping("students/register")
	public StudentResponse RegisterStud(@Valid @RequestBody StudentCreateRequest student) {
		return studentService.RegisterStudent(student);
	}


	@Operation(
		summary = "Update student details",
		description = "Updates the complete details of an existing student using the student ID."
	)
	@PutMapping("/students/{stud_id}")
	public StudentResponse updateStudent(
			@PathVariable Long stud_id,
			@Valid @RequestBody StudentUpdateRequest request) {

		StudentResponse response = studentService.updateStudent(stud_id, request);
		return response;
	}


	@Operation(
		summary = "Partially update student",
		description = "Updates selected fields of a student without replacing the entire record."
	)
	@PatchMapping("students/{stud_id}")
	public StudentResponse patchStudent(
			@Valid @RequestBody StudentPatchRequest student,
			@PathVariable long stud_id) {

		return studentService.patchStudent(student, stud_id);
	}



	@Operation(
		summary = "Assign department to student",
		description = "Associates a department with a student using the student ID and department ID."
	)
	@PutMapping("students/department/{stud_id}/{dept_id}")
	public StudentResponse updateDepartment(@PathVariable long stud_id, @PathVariable long dept_id) {
		return studentService.updateDepartment(stud_id, dept_id);
	}



	@Operation(
		summary = "Delete student",
		description = "Removes a student from the system using the provided student ID."
	)
	@DeleteMapping("students/{stud_id}")
	public Map<String, Object> delStudent(@PathVariable long stud_id) {
		return studentService.delStudent(stud_id);
	}



	@Operation(
		summary = "Delete student enrollment",
		description = "Removes a specific enrollment record using the enrollment ID."
	)
	@DeleteMapping("students/enroll/{enroll_id}")
	public String delStudentEnroll(@PathVariable long enroll_id) {
		return studentService.delStudentEnroll(enroll_id);
	}
	
}
