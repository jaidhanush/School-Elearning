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

import lombok.RequiredArgsConstructor;
import school.dto.CourseDto;
import school.dto.StudentDto;
import school.dto.TeacherDto;
import school.models.Course;
import school.models.Students;
import school.models.Teacher;
import school.services.DepartmentService;
import school.services.TeacherService;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

	private final TeacherService teachservice;
	
		//Get All Teachers
	    @GetMapping
	    public List<TeacherDto> getAllTeachers() {
	        return teachservice.getAllTeachers();
	    }

	    //Get Teacher by Id
	    @GetMapping("/{id}")
	    public TeacherDto getTeacherById(@PathVariable Long id) {
	        return teachservice.getTeacherById(id);
	    }
	    
	    //Get Teacher Courses
	    @GetMapping("/{id}/courses")
	    public List<CourseDto> getCourseByTeacher(@PathVariable Long id)
	    {
			return teachservice.getCourseByTeacher(id);
	    	
	    }

	    //Get students who are all register particular course which was taken by a particular teacher
	    @GetMapping("/{teach_id}/courses/{courseId}")
	    public List<StudentDto> getStudentsByCourse(@PathVariable Long teach_id,@PathVariable Long courseId)
	    {
	    	return teachservice.getStudentsByCourse(teach_id,courseId);
	    	
	    }
	    
	    
	    @PutMapping("/{id}")
	    public TeacherDto updateTeacher(@PathVariable Long id, @RequestBody Teacher teacher) {
	        return teachservice.updateTeacher(id, teacher);
	    }

	    @PutMapping("dept/{teach_id}/{dept_id}")
	    public TeacherDto updateTeacher(@PathVariable Long teach_id,@PathVariable Long dept_id ) {
	    	return teachservice.teacherDeptAssaign(teach_id, dept_id);
	    }
	    
	    
	    @DeleteMapping("/{id}")
	    public Map<String,Object> deleteTeacher(@PathVariable Long id) {
	        return teachservice.deleteTeacher(id);
	    }
	
		@PostMapping("teacher")
		public TeacherDto postTeacher(@RequestBody Teacher teacher)
		{
			return teachservice.postTeacher(teacher);
		}
	
	

}
