package school.models;

import java.math.BigDecimal;
import java.util.List;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SpecialCourse {

    
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long courseId;
	
	@Column(nullable = false)
	private String courseCode;
	
	@Column(nullable = false)
	private String courseName;
	
	@Column(nullable = false)
	private String courseDesc;

    @Column(nullable = false)
    private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    @OneToMany(mappedBy = "course")
    private List<SpecialCourseResource> resources;
}
