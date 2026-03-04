package school.dto.student;

import lombok.Data;

@Data
public class StudentResponse {
	
	private Long studentId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String gender;

    private Long departmentId;
    private String departmentName;

    private Long userId;
    private String userEmail;
}
