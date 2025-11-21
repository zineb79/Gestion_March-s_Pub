package ensaa.ministere.gestionmarchepublic.DTO;
import ensaa.ministere.gestionmarchepublic.models.Utilisateur;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UtilisateurDTO {
    private Long id_user;
    private String nom;
    private String prenom;
    private String email;
    @Pattern(
            regexp = "^(?=.[A-Z])(?=.[a-z])(?=.\\d)(?=.[@#$%^&+=!]).{8,}$",
            message = "Password must be at least 8 characters long and contain " +
                    "at least one uppercase letter, one lowercase letter, " +
                    "one number, and one special character."
    )
    private String password;
    private String role;

}

