package ensaa.ministere.gestionmarchepublic.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AuthResponse {
    private String token;
    public AuthResponse(String token) {
        this.token = token;
    }

}
