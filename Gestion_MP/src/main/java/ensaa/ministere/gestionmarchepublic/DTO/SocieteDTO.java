package ensaa.ministere.gestionmarchepublic.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SocieteDTO {
    private int id_SO;
    private String raisonSociale;
    private String adresse;
    private String ville;
    private String telephone;
    private String email;
    private String idFiscale;
}
