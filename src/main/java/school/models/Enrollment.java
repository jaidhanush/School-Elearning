package school.models;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
	   
	    private String instructorApprovalStatus; // PENDING / APPROVED / REJECTED
}
