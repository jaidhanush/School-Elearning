package school.mapper;

import org.springframework.stereotype.Component;

import school.dto.StudentDto;
import school.models.Students;

@Component
public class StudentMapper {
	
	public StudentDto studDto(Students student)
	{
		StudentDto dto = new StudentDto();

        dto.setStudentId(student.getStudentId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setPhoneNumber(student.getPhoneNumber());
        dto.setGender(student.getGender());

        // Set Department details
        if (student.getDepartment() != null) {
            dto.setDepartmentId(student.getDepartment().getDepartmentId());
            dto.setDepartmentName(student.getDepartment().getDepartmentName());
        }
        
        if (student.getUser() != null) {
        	dto.setUserId(student.getUser().getUserId());
        	dto.setUserMail(student.getUser().getEmail());
        }
        
        

        return dto;
		
		
	}
}
