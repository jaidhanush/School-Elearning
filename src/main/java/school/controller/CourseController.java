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

import school.dto.CourseDto;
import school.dto.EnrollmentDto;
import school.models.Course;
import school.models.Enrollment;
import school.models.Students;
import school.services.*;

@RestController
@RequestMapping("/api")
public class CourseController {
	
	
	@Autowired
	private CourseService courseserv;
	
	
	@GetMapping("course")
	public List<CourseDto> getCourse()
	{
		return courseserv.getCourse();
	}
	
	@GetMapping("course/{id}")
	public CourseDto getCourse(@PathVariable long id)
	{
		return courseserv.getCoursebyId(id);
	}
	
	@GetMapping("course/{Course_id}/students")
	public List<Students> getStudentsbyCourse(@PathVariable long Course_id)
	{
		return courseserv.getStudentsbyCourse(Course_id);
	}
	
	@GetMapping("course/{Course_id}/enrollments")
	public List<EnrollmentDto> getenrollmentbyCourse(@PathVariable long Course_id)
	{
		return courseserv.getenrollmentbyCourse(Course_id);
	}
	
		
	
	@PutMapping("course/{id}")
	public CourseDto putCourse(@PathVariable long id,@RequestBody Course course)
	{
		return courseserv.putCourse(id,course);
	}
	
	@PutMapping("course/{course_id}/{teach_id}")
	public CourseDto addTeachertoCourse(@PathVariable long course_id,@PathVariable long teach_id)
	{
		return courseserv.addTeachertoCourse(course_id,teach_id);
	}
	
	
	//add course with existing teacher 
//	@PostMapping("course/{dep_id}/{teach_id}")
//	public Course postCourse(@RequestBody Course course,@PathVariable long dep_id,@PathVariable long teach_id ) {
//		return courseserv.postCourse(course,dep_id,teach_id);
//	}
	
	@PostMapping("course/{dep_id}")
	public CourseDto postCourse(@RequestBody Course course,@PathVariable long dep_id ) {
		return courseserv.postCourse(course,dep_id);
	}
	
	//add course with new teacher 
//	@PostMapping("course/{dep_id}")
//	public Course postCourse(@RequestBody Course course,@PathVariable long dep_id) {
//		return courseserv.postCourse(course,dep_id);
//	}
	
	@DeleteMapping("course/{course_id}")
	public Map<String,Object> DeleteCourse(@PathVariable long course_id)
	{
		return courseserv.DeleteCourse(course_id);
	}

}
