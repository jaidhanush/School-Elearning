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
	
	@Operation(
        summary = "Get all teachers",
        description = "Retrieves a list of all teachers available in the system."
    )
    @GetMapping
    public List<TeacherResponse> getAllTeachers() {
        return teachservice.getAllTeachers();
    }

    
    @Operation(
        summary = "Get teacher by ID",
        description = "Fetches the details of a specific teacher using the provided teacher ID."
    )
    @GetMapping("/{id}")
    public TeacherResponse getTeacherById(@PathVariable Long id) {
        return teachservice.getTeacherById(id);
    }

   
    @Operation(
        summary = "Get courses taught by a teacher",
        description = "Retrieves all courses assigned to a specific teacher using the teacher ID."
    )
    @GetMapping("/{id}/courses")
    public List<CourseResponse> getCourseByTeacher(@PathVariable Long id) {
        return teachservice.getCourseByTeacher(id);
    }

    
    @Operation(
        summary = "Get students enrolled in a teacher's course",
        description = "Retrieves all students who are registered for a specific course taught by a particular teacher."
    )
    @GetMapping("/{teach_id}/courses/{courseId}")
    public List<StudentResponse> getStudentsByCourse(@PathVariable Long teach_id, @PathVariable Long courseId) {
        return teachservice.getStudentsByCourse(teach_id, courseId);
    }

   
    @Operation(
        summary = "Create a new teacher",
        description = "Adds a new teacher to the system using the provided teacher details."
    )
    @PostMapping("teacher")
    public TeacherResponse addTeacher(@RequestBody @Valid TeacherCreateRequest teacher) {
        return teachservice.addTeacher(teacher);
    }

  
    @Operation(
        summary = "Partially update teacher",
        description = "Updates specific fields of an existing teacher without replacing the entire record."
    )
    @PatchMapping("/{id}")
    public TeacherResponse patchTeacher(@PathVariable Long id, @RequestBody TeacherPatchRequest teacher) {
        return teachservice.patchTeacher(id, teacher);
    }

    @Operation(
        summary = "Update teacher completely",
        description = "Replaces the existing teacher details with the new information provided."
    )
    @PutMapping("/{id}")
    public TeacherResponse updateTeacher(@PathVariable Long id, @Valid @RequestBody TeacherUpdateRequest teacher) {
        return teachservice.updateTeacher(id, teacher);
    }

    
    // @Operation(
    //     summary = "Assign department to teacher",
    //     description = "Associates a department with a teacher using the provided teacher ID and department ID."
    // )
    // @PutMapping("dept/{teach_id}/{dept_id}")
    // public TeacherResponse teacherDeptAssaign(@PathVariable Long teach_id, @PathVariable Long dept_id) {
    //     return teachservice.teacherDeptAssaign(teach_id, dept_id);
    // }

    @Operation(
        summary = "Delete teacher",
        description = "Removes a teacher from the system using the specified teacher ID."
    )
    @DeleteMapping("/{id}")
    public Map<String, Object> deleteTeacher(@PathVariable Long id) {
        return teachservice.deleteTeacher(id);
    }
		
	
	

}
