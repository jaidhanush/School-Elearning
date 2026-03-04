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
import school.dto.department.DepartmentCreateRequest;
import school.dto.department.DepartmentPatchRequest;
import school.dto.department.DepartmentResponse;
import school.dto.department.DepartmentUpdateRequest;
import school.dto.teacher.TeacherResponse;
import school.services.DepartmentService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/departments")
public class DepartmentController {
	

	private final DepartmentService departmentService;
	

	    // Get all departments
	    @GetMapping
	    public List<DepartmentResponse> getAllDepartments() {
	        return departmentService.getAllDepartments();
	    }

	    // Get department by ID
	    @GetMapping("/{id}")
	    public DepartmentResponse getDepartmentById(@PathVariable Long id) {
	        return departmentService.getDepartmentById(id);
	    }

		  // List courses in department
	    @GetMapping("/{id}/courses")
	    public List<CourseResponse> getCoursesByDepartment(@PathVariable Long id) {
	        return departmentService.getCoursesByDepartmentId(id);
	    }

	    // List teachers in department
	    @GetMapping("/{id}/teachers")
	    public List<TeacherResponse> getTeachersByDepartment(@PathVariable Long id) {
	        return departmentService.getTeachersByDepartmentId(id);
	    }

		@PostMapping
	    public DepartmentResponse createDepartment(@Valid @RequestBody DepartmentCreateRequest department) {
	        return departmentService.createDepartment(department);
	    }
		
	    // Update department info
	    @PutMapping("/{id}")
	    public DepartmentResponse updateDepartment(@PathVariable Long id, @RequestBody DepartmentUpdateRequest updatedDept) {
	        return departmentService.updateDepartment(id, updatedDept);
	    }


		@PatchMapping("/{id}")
		public DepartmentResponse patchDepartment(
				@PathVariable Long id,
				@RequestBody @Valid DepartmentPatchRequest request) {

			return departmentService.patchDepartment(id, request);
		}
	    
	  
	    // Delete department
	    @DeleteMapping("/{id}")
	    public Map<String,Object> deleteDepartment(@PathVariable Long id) {
	        return departmentService.deleteDepartment(id);
	    }

	  

}



  // @PutMapping("/hod/{dept_id}/{teach_id}")
	    // public DepartmentResponse assaignHod(@PathVariable Long dept_id,@PathVariable Long teach_id) {
	    // 	return deptService.assaignHod(dept_id, teach_id);
	    // }
