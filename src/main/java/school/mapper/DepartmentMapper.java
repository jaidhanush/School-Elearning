package school.mapper;

import org.springframework.stereotype.Component;

import school.dto.department.DepartmentCreateRequest;
import school.dto.department.DepartmentResponse;
import school.models.Department;
import school.models.Teacher;

@Component
public class DepartmentMapper {


     public Department toEntity(DepartmentCreateRequest request, Teacher hod) {

        Department department = new Department();
        department.setDepartmentName(request.getDepartmentName());
        department.setDescription(request.getDescription());
        department.setEmail(request.getEmail());
        department.setHeadOfDepartment(hod);

        return department;
    }
	
    public DepartmentResponse toDepartmentResponse(Department dept) {
    	DepartmentResponse dto = new DepartmentResponse();
        dto.setDepartmentId(dept.getDepartmentId());
        dto.setDepartmentName(dept.getDepartmentName());
        dto.setDescription(dept.getDescription());
        dto.setEmail(dept.getEmail());
    
        	dto.setHeadOfDepartment(
                    dept.getHeadOfDepartment() != null ? 
                    dept.getHeadOfDepartment().getName() : 
                    null
                );
        
        return dto;
    }
}
