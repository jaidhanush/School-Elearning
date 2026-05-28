package school.models;

import java.time.LocalDateTime;


import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import school.Enum.ApprovalStatus;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

	
		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long enrollmentId;

	    @ManyToOne
	    @JoinColumn(name = "student_id", nullable = false)
	    private Students student;

	    @ManyToOne
	    @JoinColumn(name = "course_id", nullable = false)
	    private Course course;

	    private LocalDateTime enrollmentDate = LocalDateTime.now();

	    private String status; //ENROLLED-PENDING// ENROLLED / WAITLISTED / DROPPED / COMPLETED
	   
		@Enumerated(EnumType.STRING)
	    private ApprovalStatus instructorApprovalStatus; // PENDING / APPROVED / REJECTED
}
