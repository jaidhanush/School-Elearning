package school.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long departmentId;
	
	@Column(nullable = false, unique = true)
	@NotBlank(message = "DepartmentName not null")
	private String departmentName;
	
	@Column(nullable = false)
	@NotBlank(message = "Description not null")
	private String description;
	
	@OneToOne
	@JoinColumn(name = "hod_teacher_id", unique = true)
	private Teacher headOfDepartment;
	
	@Column(nullable = false,unique = true)
	@Email(message = "Invalid email format")
	private String email;
	
	@OneToMany(mappedBy = "department",cascade=CascadeType.ALL)
	private List<Students> student=new ArrayList<>();
	
	@OneToMany(mappedBy = "department",cascade=CascadeType.ALL)
	private List<Course> course=new ArrayList<>();
	
	@OneToMany(mappedBy = "department",cascade=CascadeType.ALL)
	private List<Teacher> teacher=new ArrayList<>();
	

}
