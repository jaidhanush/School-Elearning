package school.mapper;

import org.springframework.stereotype.Component;

import school.dto.student.StudentCreateRequest;
import school.dto.student.StudentResponse;
import school.models.Students;
import school.models.Users;

@Component
public class StudentMapper {
	
	
	 public Students toEntity(StudentCreateRequest request) {

	        Users user = new Users();
	        user.setEmail(request.getUser().getEmail());
	        user.setPassword(request.getUser().getPassword());

	        Students student = new Students();
	        student.setFirstName(request.getFirstName());
	        student.setLastName(request.getLastName());
	        student.setPhoneNumber(request.getPhoneNumber());
	        student.setGender(request.getGender());
	        student.setUser(user);

	        return student;
	    }
	
	public  StudentResponse toStudentResponse(Students student)
	{
		StudentResponse dto = new StudentResponse();

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
        	dto.setUserEmail(student.getUser().getEmail());
        }
        
        

        return dto;
		
		
	}
}
