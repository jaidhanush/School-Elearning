package school.mapper;

import org.springframework.stereotype.Component;

import school.dto.DepartmentDto;
import school.models.Department;

@Component
public class DepartmentMapper {
	
    public DepartmentDto convertToDTO(Department dept) {
    	DepartmentDto dto = new DepartmentDto();
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
