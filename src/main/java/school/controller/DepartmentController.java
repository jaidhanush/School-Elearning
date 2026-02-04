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

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import school.dto.DepartmentDto;
import school.dto.TeacherDto;
import school.models.Course;
import school.models.Department;
import school.models.Teacher;
import school.services.DepartmentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/departments")
public class DepartmentController {
	

	private final DepartmentService deptService;
	
	 	@PostMapping
	    public DepartmentDto createDepartment(@Valid @RequestBody Department department) {
	        return deptService.createDepartment(department);
	    }

	    // Get all departments
	    @GetMapping
	    public List<DepartmentDto> getAllDepartments() {
	        return deptService.getAllDepartments();
	    }

	    // Get department by ID
	    @GetMapping("/{id}")
	    public DepartmentDto getDepartmentById(@PathVariable Long id) {
	        return deptService.getDepartmentById(id);
	    }

	    // Update department info
	    @PutMapping("/{id}")
	    public DepartmentDto updateDepartment(@PathVariable Long id, @RequestBody Department updatedDept) {
	        return deptService.updateDepartment(id, updatedDept);
	    }
	    
	    @PutMapping("/hod/{dept_id}/{teach_id}")
	    public DepartmentDto assaignHod(@PathVariable Long dept_id,@PathVariable Long teach_id) {
	    	return deptService.assaignHod(dept_id, teach_id);
	    }

	    // Delete department
	    @DeleteMapping("/{id}")
	    public Map<String,Object> deleteDepartment(@PathVariable Long id) {
	        return deptService.deleteDepartment(id);
	    }

	    // List courses in department
	    @GetMapping("/{id}/courses")
	    public List<Course> getCoursesByDepartment(@PathVariable Long id) {
	        return deptService.getCoursesByDepartmentId(id);
	    }

	    // List teachers in department
	    @GetMapping("/{id}/teachers")
	    public List<TeacherDto> getTeachersByDepartment(@PathVariable Long id) {
	        return deptService.getTeachersByDepartmentId(id);
	    }

}
