package school.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class EnrollmentDto {
	
	private long enrollmentId;
	private long courseId;
	private String courseName;
	private long studentId;
	private String studentName;
	private LocalDateTime enrollmentDate;
	private String status;
	private String instructorApprovalStatus;

}
