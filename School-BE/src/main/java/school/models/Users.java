package school.models;





import jakarta.persistence.*;
import lombok.*;
import school.Enum.Role;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Users {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Long userId;


    private String email;


    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;   // STUDENT, TEACHER, ADMIN
}
