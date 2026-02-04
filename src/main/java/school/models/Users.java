package school.models;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users {
	
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long userId;

	@Column(nullable = false, unique = true)
	@Email(message = "Invalid email format")
    @NotBlank(message = "Email cannot be empty")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Password cannot be empty")
//    @JsonIgnore
    private String password;

    @Column(nullable = false)
    @NotBlank(message = "Role cannot be empty")
    private String role;   // STUDENT, TEACHER, ADM
}
