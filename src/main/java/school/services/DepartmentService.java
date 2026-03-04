package school.services;


import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school.dto.course.CourseResponse;
import school.dto.department.DepartmentCreateRequest;
import school.dto.department.DepartmentPatchRequest;
import school.dto.department.DepartmentResponse;
import school.dto.department.DepartmentUpdateRequest;
import school.dto.teacher.TeacherResponse;
import school.mapper.CourseMapper;
import school.mapper.DepartmentMapper;
import school.mapper.TeacherMapper;
import school.models.Department;
import school.models.Teacher;
import school.repository.*;


@Service
@RequiredArgsConstructor
public class DepartmentService {
	
	private final DepartmentRepo deptRepo;
	
	private final TeacherRepo teacherRepo;
	
	private final DepartmentMapper departmentMapper;

	private final TeacherMapper teacherMapper;

	private final CourseMapper courseMapper;
	


	 // Get All Departments
		public List<DepartmentResponse> getAllDepartments() {
			 return deptRepo.findAll().stream().map(departmentMapper::toDepartmentResponse).toList();

		}

	    // Get Department by ID
	    public DepartmentResponse getDepartmentById(Long id) {
	         Department dept=deptRepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));
	        
	        return departmentMapper.toDepartmentResponse(dept);
	    }

		 public List<CourseResponse> getCoursesByDepartmentId(Long id) {
	        Department dept = deptRepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));
	        return dept.getCourse().stream().map(courseMapper::toCourseResponse).toList();
	    }

	    // Get Teachers by Department ID
	    public List<TeacherResponse> getTeachersByDepartmentId(Long id) {
	        Department dept = deptRepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));
	        return dept.getTeacher().stream().map(teacherMapper::teacherResponse).toList();
	    }
	    
	
		public DepartmentResponse createDepartment(DepartmentCreateRequest department) { 

		Teacher hod = teacherRepo.findById(department.getHeadOfDepartmentId())
            .orElseThrow(() -> new RuntimeException("Teacher not found"));						
	        
	        Department dept = departmentMapper.toEntity(department, hod);
	        Department savedDept = deptRepo.save(dept);
	        return departmentMapper.toDepartmentResponse(savedDept);
	    }


	    // Update Department
	    public DepartmentResponse updateDepartment(Long id, DepartmentUpdateRequest updatedDept) {
				Department existing = deptRepo.findById(id)
				.orElseThrow(() -> new RuntimeException("Department not found"));

		Teacher hod = teacherRepo.findById(updatedDept.getHeadOfDepartmentId())
				.orElseThrow(() -> new RuntimeException("Teacher not found"));

		existing.setDepartmentName(updatedDept.getDepartmentName());
		existing.setDescription(updatedDept.getDescription());
		existing.setEmail(updatedDept.getEmail());
		existing.setHeadOfDepartment(hod);

		Department updated = deptRepo.save(existing);

		return departmentMapper.toDepartmentResponse(updated);
	    }

		
		public DepartmentResponse patchDepartment(Long id, DepartmentPatchRequest request) {

			Department existing = deptRepo.findById(id)
					.orElseThrow(() -> new RuntimeException("Department not found"));

			// Update only if value is present

			if (request.getDepartmentName() != null) {
				existing.setDepartmentName(request.getDepartmentName());
			}

			if (request.getDescription() != null) {
				existing.setDescription(request.getDescription());
			}

			if (request.getEmail() != null) {
				existing.setEmail(request.getEmail());
			}

			if (request.getHeadOfDepartmentId() != null) {
				Teacher hod = teacherRepo.findById(request.getHeadOfDepartmentId())
						.orElseThrow(() -> new RuntimeException("Teacher not found"));
				existing.setHeadOfDepartment(hod);
			}

			Department updated = deptRepo.save(existing);

			return departmentMapper.toDepartmentResponse(updated);
		}

	    // Delete Department
	    public Map<String,Object> deleteDepartment(Long id) {
	        Department dept = deptRepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));
	        
	        if (!dept.getStudent().isEmpty()) {
	        throw new RuntimeException("Cannot delete department. Students are linked.");
	    }

	    if (!dept.getCourse().isEmpty()) {
	        throw new RuntimeException("Cannot delete department. Courses are linked.");
	    }

	    if (!dept.getTeacher().isEmpty()) {
	        throw new RuntimeException("Cannot delete department. Teachers are linked.");
	    }

	    if (dept.getHeadOfDepartment() != null) {
	        throw new RuntimeException("Cannot delete department. HOD is assigned.");
	    }

	        

	        Map<String,Object> map=new HashMap<>();
	        
	        DepartmentResponse dto=departmentMapper.toDepartmentResponse(dept);
	        deptRepo.delete(dept);
	        map.put("delete msg :","department "+id +" deleted Successfully" );
	        map.put("Department",  dto);
	        
	        
	        return map;
	    }

	    // Get Courses by Department ID
	   


		

}


// public DepartmentResponse assaignHod(Long dept_id, Long teach_id) {
			
// 			Department dept = deptRepo.findById(dept_id)
// 	                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + dept_id));
			
// 			Teacher Hod= teacherRepo.findById(teach_id).orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teach_id));
			
// 			if(Hod.getDepartment().getDepartmentId().equals(dept_id))
// 			{
// 				dept.setHeadOfDepartment(Hod);
// 				deptRepo.save(dept);
// 			}
// 			else
// 			{
// 				throw new RuntimeException("Please Assign the Teacher who working under this Department ");
// 			}
			
// 			return departmentMapper.toDepartmentResponse(dept);
// 		}