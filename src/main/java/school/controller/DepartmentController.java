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
		
	@Operation(
		summary = "Get all departments",
		description = "Retrieves a list of all departments available in the system."
	)
	@GetMapping
	public List<DepartmentResponse> getAllDepartments() {
		return departmentService.getAllDepartments();
	}


	
	@Operation(
		summary = "Get department by ID",
		description = "Fetches the details of a specific department using the provided department ID."
	)
	@GetMapping("/{id}")
	public DepartmentResponse getDepartmentById(@PathVariable Long id) {
		return departmentService.getDepartmentById(id);
	}


	@Operation(
		summary = "Get courses in a department",
		description = "Retrieves all courses that belong to a specific department."
	)
	@GetMapping("/{id}/courses")
	public List<CourseResponse> getCoursesByDepartment(@PathVariable Long id) {
		return departmentService.getCoursesByDepartmentId(id);
	}



	@Operation(
		summary = "Get teachers in a department",
		description = "Retrieves all teachers who are assigned to a specific department."
	)
	@GetMapping("/{id}/teachers")
	public List<TeacherResponse> getTeachersByDepartment(@PathVariable Long id) {
		return departmentService.getTeachersByDepartmentId(id);
	}



	@Operation(
		summary = "Create a new department",
		description = "Adds a new department to the system using the provided department details."
	)
	@PostMapping
	public DepartmentResponse createDepartment(@Valid @RequestBody DepartmentCreateRequest department) {
		return departmentService.createDepartment(department);
	}



	@Operation(
		summary = "Update department details",
		description = "Updates the complete details of an existing department using the department ID."
	)
	@PutMapping("/{id}")
	public DepartmentResponse updateDepartment(@PathVariable Long id,
											@RequestBody DepartmentUpdateRequest updatedDept) {
		return departmentService.updateDepartment(id, updatedDept);
	}

	  @PutMapping("/hod/{dept_id}/{teach_id}")
	    public DepartmentResponse assignHod(@PathVariable Long dept_id,@PathVariable Long teach_id) {
	    	return departmentService.assignHod(dept_id, teach_id);
	    }



	
	@Operation(
		summary = "Partially update department",
		description = "Updates selected fields of a department without replacing the entire department record."
	)
	@PatchMapping("/{id}")
	public DepartmentResponse patchDepartment(
			@PathVariable Long id,
			@RequestBody @Valid DepartmentPatchRequest request) {

		return departmentService.patchDepartment(id, request);
	}


	@Operation(
		summary = "Delete department",
		description = "Removes a department from the system using the specified department ID."
	)
	@DeleteMapping("/{id}")
	public Map<String,Object> deleteDepartment(@PathVariable Long id) {
		return departmentService.deleteDepartment(id);

	}

}



