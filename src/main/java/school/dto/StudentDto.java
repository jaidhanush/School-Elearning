package school.dto;

import lombok.Data;

@Data
public class StudentDto {
	
	private Long studentId;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String gender;
    private long departmentId;
    private long UserId;
    private String UserMail;
    private String departmentName;
}
