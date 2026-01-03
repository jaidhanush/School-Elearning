package school.models;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teacherId;
	
	@Column(nullable = false)
	private String name;  
	
	@Column(nullable = false)
	private String gender;  
	
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "user_id",nullable = false)
	private Users user;
	
	
	@ManyToOne
    @JoinColumn(name = "department_id")
	private Department department;
	
	@OneToMany(mappedBy = "teacher",cascade=CascadeType.ALL)
	private List<Course> course=new ArrayList<>();
	
	
	

}
