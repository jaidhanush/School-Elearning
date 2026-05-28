package school.dto.user;

import lombok.Data;

@Data
public class UserResponse {

    private String AccessToken;
    private String RefreshToken;
}
