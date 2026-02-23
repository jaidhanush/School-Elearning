package school.controller;

import java.util.*;

import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import school.dto.course.*;
import school.dto.response.*;
import school.models.Course;
import school.services.CourseService;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
	
	
	private final CourseService courseserv;
	
	//Get All the Course
	@GetMapping("course")
	public  List<CourseResponse> getCourse()
	{
		return courseserv.getCourse();
	}
	
	//Get Course byId
	@GetMapping("course/{id}")
	public CourseResponse getCoursebyId(@PathVariable long id)
	{
		return courseserv.getCoursebyId(id);
	}
	
	//Get Students by Course
	@GetMapping("course/{Course_id}/students")
	public List<StudentDto> getStudentsbyCourse(@PathVariable long Course_id)
	{
		return courseserv.getStudentsbyCourse(Course_id);
	}
	
	
	//Get Enrollment by Courses
	@GetMapping("course/{Course_id}/enrollments")
	public List<EnrollmentDto> getenrollmentbyCourse(@PathVariable long Course_id)
	{
		return courseserv.getenrollmentbyCourse(Course_id);
	}
	
	
	//Create New Course
	@PostMapping("course/{dep_id}")
	public CourseResponse createCourse(@RequestBody Course course,@PathVariable long dep_id ) {
		return courseserv.createCourse(course,dep_id);
	}
		
	
	//Partially update the Course
	@PatchMapping("course/{id}")
	public CourseResponse patchCourse(@PathVariable long id,@RequestBody CoursePatchRequest course)
	{
		return courseserv.patchCourse(id,course);
	}
	
	//Fully Update the Course 
	@PutMapping("course/{id}")
	public CourseResponse updateCourse(@PathVariable long id,@RequestBody CourseUpdateRequest course)
	{
		return courseserv.updateCourse(id,course);
	}
	
	
	//update the Teacher to the Course
	@PutMapping("course/{course_id}/{teach_id}")
	public CourseResponse addTeachertoCourse(@PathVariable long course_id,@PathVariable long teach_id)
	{
		return courseserv.addTeachertoCourse(course_id,teach_id);
	}
	
	
	//Delete the Course
	@DeleteMapping("course/{course_id}")
	public Map<String,Object> DeleteCourse(@PathVariable long course_id)
	{
		return courseserv.DeleteCourse(course_id);
	}

}
