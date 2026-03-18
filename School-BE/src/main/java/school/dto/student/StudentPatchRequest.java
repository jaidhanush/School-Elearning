package school.dto.student;

import lombok.Data;

@Data
public class StudentPatchRequest {

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String gender;

}
