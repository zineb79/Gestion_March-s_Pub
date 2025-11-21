package ensaa.ministere.gestionmarchepublic.DTO;

import ensaa.ministere.gestionmarchepublic.enums.StatutAO;

import jakarta.validation.constraints.FutureOrPresent;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppelOffreDTO {

    private int id_AO;
    private String num_Ordre_AO;
    private String type_AO;
    @FutureOrPresent(message = "La date de l'appel d'offre ne peut pas être antérieure à aujourd'hui.")
    private LocalDate dateOuverturePli_AO;
    private LocalTime heureOuverturePli_AO;
    private double coutEstime_AO;
    private double cautionProvisoire_AO;
    private StatutAO statut_AO;
    private Integer idMarche;

}
