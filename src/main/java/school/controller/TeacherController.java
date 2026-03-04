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

import lombok.RequiredArgsConstructor;
import school.dto.course.CourseResponse;
import school.dto.student.StudentResponse;
import school.dto.teacher.TeacherCreateRequest;
import school.dto.teacher.TeacherPatchRequest;
import school.dto.teacher.TeacherResponse;
import school.dto.teacher.TeacherUpdateRequest;
import school.services.TeacherService;

@RestController
@RequestMapping("/api/teachers")
@RequiredArgsConstructor
public class TeacherController {

	private final TeacherService teachservice;
	
		//Get All Teachers
	    @GetMapping
	    public List<TeacherResponse> getAllTeachers() {
	        return teachservice.getAllTeachers();
	    }

	    //Get Teacher by Id
	    @GetMapping("/{id}")
	    public TeacherResponse getTeacherById(@PathVariable Long id) {
	        return teachservice.getTeacherById(id);
	    }
	    
	    //Get Teacher Courses
	    @GetMapping("/{id}/courses")
	    public List<CourseResponse> getCourseByTeacher(@PathVariable Long id)
	    {
			return teachservice.getCourseByTeacher(id);
	    	
	    }

	    //Get students who are all register particular course which was taken by a particular teacher
	    @GetMapping("/{teach_id}/courses/{courseId}")
	    public List<StudentResponse> getStudentsByCourse(@PathVariable Long teach_id,@PathVariable Long courseId)
	    {
	    	return teachservice.getStudentsByCourse(teach_id,courseId);
	    	
	    }
	    
	    //Add new Teacher
	    @PostMapping("teacher")
		public TeacherResponse addTeacher(@RequestBody TeacherCreateRequest teacher)
		{
			return teachservice.addTeacher(teacher);
		}
	    
	    //Update Teacher Partially
	    @PatchMapping("/{id}")
	    public TeacherResponse patchTeacher(@PathVariable Long id, @RequestBody TeacherPatchRequest teacher) {
	        return teachservice.patchTeacher(id, teacher);
	    }
	    
	    ////Update Teacher Fully
	    @PutMapping("/{id}")
	    public TeacherResponse updateTeacher(@PathVariable Long id, @RequestBody TeacherUpdateRequest teacher) {
	    	return teachservice.updateTeacher(id, teacher);
	    }
	    
	    //Assaign Department to the Teacher
	    @PutMapping("dept/{teach_id}/{dept_id}")
	    public TeacherResponse teacherDeptAssaign(@PathVariable Long teach_id,@PathVariable Long dept_id ) {
	    	return teachservice.teacherDeptAssaign(teach_id, dept_id);
	    }
	    
	    //Delete The Teacher
	    @DeleteMapping("/{id}")
	    public Map<String,Object> deleteTeacher(@PathVariable Long id) {
	        return teachservice.deleteTeacher(id);
	    }
	
		
	
	

}
