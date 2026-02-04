package school.services;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import school.dto.DepartmentDto;
import school.dto.TeacherDto;
import school.mapper.DepartmentMapper;
import school.mapper.TeacherMapper;
import school.models.Course;
import school.models.Department;
import school.models.Students;
import school.models.Teacher;
import school.repository.*;


@Service
@RequiredArgsConstructor
public class DepartmentService {
	
	private final DepartmentRepo deptRepo;
	
	private final StudentRepo studrepo;
	
	private final TeacherRepo teachrepo;
	
	private final DepartmentMapper mapper;
	
	private final TeacherMapper teachmapper;
	
	

//	public List<Department> getDepartment() 
//	{
//		return deptrepo.findAll();
//	}
//
//	public Department postDepartment(Department dept)
//	{	
//		for (Students s : dept.getStudent()) {
//	        s.setDepartment(dept);
//	    }
//		
//		for (Course c : dept.getCourse()) {
//	        c.setDepartment(dept);
//	        for(Teacher t:dept.getTeacher())
//	        {
//	        	c.setTeacher(t);
//	        }
//	    }
//		
//		for (Teacher teach : dept.getTeacher()) {
//	        teach.setDepartment(dept);
//	    }
//		
//		return deptrepo.save(dept);
//		
//		
//		
//	}
	
	 public DepartmentDto createDepartment(Department dept) { 
	         deptRepo.save(dept);
	         return mapper.convertToDTO(dept);
	    }

	    // Get All Departments
		public List<DepartmentDto> getAllDepartments() {
			 return deptRepo.findAll().stream().map(mapper::convertToDTO).toList();

//			List<DepartmentDto> departDto = new ArrayList<>();
//
//			for (Department dep : dept) {
//				DepartmentDto deptDto = new DepartmentDto();
//
//				deptDto.setDepartmentId(dep.getDepartmentId());
//				deptDto.setDepartmentName(dep.getDepartmentName());
//				deptDto.setDescription(dep.getDescription());
//				deptDto.setEmail(dep.getEmail());
//				deptDto.setHeadOfDepartment(dep.getHeadOfDepartment());
//
//				departDto.add(deptDto);
//
//			}
		// mapping method another method also available that is MODEL MAPPER	
//			return departments.stream().map(dept -> {
//		        DepartmentDTO dto = new DepartmentDTO();
//		        dto.setDepartmentId(dept.getDepartmentId());
//		        dto.setDepartmentName(dept.getDepartmentName());
//		        dto.setDescription(dept.getDescription());
//		        dto.setHeadOfDepartment(dept.getHeadOfDepartment());
//		        dto.setEmail(dept.getEmail());
//		        return dto;
//		    }).collect(Collectors.toList());

//			return departDto;
		}

	    // Get Department by ID
	    public DepartmentDto getDepartmentById(Long id) {
	         Department dep=deptRepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));
	        
	        return mapper.convertToDTO(dep);
	    }
	    
	    //DTO for Department
	

	    // Update Department
	    public DepartmentDto updateDepartment(Long id, Department updatedDept) {
	    	Department existing = deptRepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Department not found"));

	        if (updatedDept.getDepartmentName() != null) {
	            existing.setDepartmentName(updatedDept.getDepartmentName());
	        }
	        if (updatedDept.getDescription() != null) {
	            existing.setDescription(updatedDept.getDescription());
	        }
	        if (updatedDept.getHeadOfDepartment() != null) {
	            existing.setHeadOfDepartment(updatedDept.getHeadOfDepartment());
	        }
	        if (updatedDept.getEmail() != null) {
	            existing.setEmail(updatedDept.getEmail());
	        }

	        Department dept=deptRepo.save(existing);
	        return mapper.convertToDTO(dept);
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

	        
//	        DepartmentDto deptdto = new DepartmentDto();
	        Map<String,Object> map=new HashMap<>();
	        
//	        deptdto.setDepartmentId(dept.getDepartmentId());
//	        deptdto.setDepartmentName(dept.getDepartmentName());
//	        deptdto.setDescription(dept.getDescription());
//	        deptdto.setEmail(dept.getEmail());
//	        if (dept.getHeadOfDepartment() != null) {
//	        	 deptdto.setHeadOfDepartment(dept.getHeadOfDepartment().getName());
//		    }
//	        deptdto.setHeadOfDepartment(null);
	        DepartmentDto dto=mapper.convertToDTO(dept);
	        deptRepo.delete(dept);
	        map.put("delete msg :","department "+id +" deleted Successfully" );
	        map.put("Department",  dto);
	        
	        
	        return map;
	    }

	    // Get Courses by Department ID
	    public List<Course> getCoursesByDepartmentId(Long id) {
	        Department dept = deptRepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));
	        return dept.getCourse();
	    }

	    // Get Teachers by Department ID
	    public List<TeacherDto> getTeachersByDepartmentId(Long id) {
	        Department dept = deptRepo.findById(id)
	                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + id));
	        return dept.getTeacher().stream().map(teachmapper::teacherdto).toList();
	    }

		public DepartmentDto assaignHod(Long dept_id, Long teach_id) {
			
			Department dept = deptRepo.findById(dept_id)
	                .orElseThrow(() -> new RuntimeException("Department not found with ID: " + dept_id));
			
			Teacher Hod= teachrepo.findById(teach_id).orElseThrow(() -> new RuntimeException("Teacher not found with ID: " + teach_id));
			
			if(Hod.getDepartment().getDepartmentId().equals(dept_id))
			{
				dept.setHeadOfDepartment(Hod);
				deptRepo.save(dept);
			}
			else
			{
				throw new RuntimeException("Please Assign the Teacher who working under this Department ");
			}
			
			return mapper.convertToDTO(dept);
		}

}
