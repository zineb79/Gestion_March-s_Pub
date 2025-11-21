package ensaa.ministere.gestionmarchepublic.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DecompteDTO {
    private int id_D;
    private String numOrdre_D;
    private double aCompte;
    private double somme_D;
    private Integer idMarche;
    private Integer idSociete;
}
