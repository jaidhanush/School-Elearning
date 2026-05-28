package school.dto.enrollment;

import java.time.LocalDateTime;

import lombok.Data;
import school.Enum.ApprovalStatus;

@Data
public class EnrollmentResponse {
	
	private long enrollmentId;
	private long courseId;
	private String courseName;
	private long studentId;
	private String studentName;
	private LocalDateTime enrollmentDate;
	private String status;
	
	private ApprovalStatus instructorApprovalStatus;

}
