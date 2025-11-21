package ensaa.ministere.gestionmarchepublic.DTO;

import ensaa.ministere.gestionmarchepublic.enums.ServiceConcerne;
import ensaa.ministere.gestionmarchepublic.enums.StatutMarche;
import ensaa.ministere.gestionmarchepublic.enums.TypeMarche;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MarcheDTO {
    private int id_Marche;
    private String numOrdre;
    private TypeMarche type_Marche;
    private String objet_marche;
    private StatutMarche statut;
    private int delaisGarantie; // a remplir apres l ouverture des plis exprime en mois
    private LocalDate delaisMarche;
    private String chefServiceConcerne; // le service objet maitre ouvrage
    private ServiceConcerne serviceConcerne;
    private Double montantFinal;
    //private boolean isArchived;
    private Integer idSociete;
    private Integer idNotification;

    public MarcheDTO(int id_Marche,String numOrdre, TypeMarche type_Marche, String objet_marche, StatutMarche statut) {
        this.numOrdre = numOrdre;
        this.id_Marche = id_Marche;
        this.type_Marche = type_Marche;
        this.objet_marche = objet_marche;
        this.statut = statut;
    }

}
