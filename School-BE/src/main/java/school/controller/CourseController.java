package school.controller;

import java.util.*;

import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import school.dto.course.*;
import school.dto.enrollment.EnrollmentResponse;
import school.dto.student.StudentResponse;
import school.services.CourseService;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
	
	
	private final CourseService courseserv;
	
	@Operation(
		summary = "Get all courses",
		description = "Retrieves a list of all courses available in the system."
	)
	@GetMapping("course")
	public  List<CourseResponse> getCourse()
	{
		return courseserv.getCourse();
	}
	
	@Operation(
		summary = "Get courses by department",
		description = "Retrieves all courses that belong to a specific department using the department ID."
	)
	@GetMapping("course/{dept_id}")
	public List<CourseResponse> getCoursebyId(@PathVariable long dept_id)
	{
		return courseserv.getCoursebyId(dept_id);
	}
	
	@Operation(
		summary = "Get students enrolled in a course",
		description = "Retrieves all students enrolled in a specific course using the course ID."
	)
	@GetMapping("course/{Course_id}/students")
	public List<StudentResponse> getStudentsbyCourse(@PathVariable long Course_id)
	{
		return courseserv.getStudentsbyCourse(Course_id);
	}
	
	@Operation(
		summary = "Get enrollments for a course",
		description = "Retrieves all enrollments associated with a specific course using the course ID."
	)
	@GetMapping("course/{Course_id}/enrollments")
	public List<EnrollmentResponse> getenrollmentbyCourse(@PathVariable long Course_id)
	{
		return courseserv.getenrollmentbyCourse(Course_id);
	}
	
	
	@Operation(
		summary = "Create a new course",
		description = "Creates a new course in the system. The request must contain valid course details and the department ID to which the course belongs."
	)
	@PostMapping("course/{dep_id}")
	public CourseResponse createCourse(@Valid @RequestBody CourseCreateRequest course,@PathVariable long dep_id ) {
		return courseserv.createCourse(course,dep_id);
	}
		
	
	@Operation(
		summary = "Partially update a course",
		description = "Partially updates an existing course in the system. The request must contain valid course details to be updated."
	)
	@PatchMapping("course/{id}")
	public CourseResponse patchCourse(@PathVariable long id,@RequestBody CoursePatchRequest course)
	{
		return courseserv.patchCourse(id,course);
	}
	
	
	@Operation(
		summary = "Fully update a course",
		description = "Fully updates an existing course in the system. The request must contain valid course details to be updated."
	)
	@PutMapping("course/{id}")
	public CourseResponse updateCourse(@Valid @PathVariable long id,@RequestBody CourseUpdateRequest course)
	{
		return courseserv.updateCourse(id,course);
	}
	
	
	
	@Operation(
		summary = "Add a teacher to a course",
		description = "Assigns a teacher to a specific course using the course ID and teacher ID."
	)
	@PutMapping("course/{course_id}/{teach_id}")
	public CourseResponse addTeachertoCourse(@PathVariable long course_id,@PathVariable long teach_id)
	{
		return courseserv.addTeachertoCourse(course_id,teach_id);
	}
	
	
	@Operation(
		summary = "Delete a course",
		description = "Deletes a specific course from the system using the course ID."
	)
	@DeleteMapping("course/{course_id}")
	public String DeleteCourse(@PathVariable long course_id)
	{
		return courseserv.DeleteCourse(course_id);
	}

}
