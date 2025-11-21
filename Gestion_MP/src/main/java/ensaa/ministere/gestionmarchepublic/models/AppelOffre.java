package ensaa.ministere.gestionmarchepublic.models;

import ensaa.ministere.gestionmarchepublic.enums.StatutAO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppelOffre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_AO;
    private String num_Ordre_AO;
    private String type_AO;
    private LocalDate dateOuverturePli_AO;
    private LocalTime heureOuverturePli_AO;
    private double coutEstime_AO;
    private double cautionProvisoire_AO;
    private StatutAO statut_AO;
    @ManyToOne
    private Marche marche_AO;


    public AppelOffre(String numOrdreAo, String typeAo, LocalDate dateAo,LocalTime time, double coutEstimeAo, double cautionProvisoireAo, StatutAO statutAo, Marche marche) {

        this.num_Ordre_AO = numOrdreAo;
        this.type_AO = typeAo;
        this.dateOuverturePli_AO = dateAo;
        this.heureOuverturePli_AO = time;
        this.coutEstime_AO = coutEstimeAo;
        this.cautionProvisoire_AO = cautionProvisoireAo;
        this.statut_AO = statutAo;
        this.marche_AO = marche;
    }

    @Override
    public String toString() {
        return "AppelOffre{" +
                "id_AO=" + id_AO +
                ", num_Ordre_AO='" + num_Ordre_AO + '\'' +
                ", type_AO='" + type_AO + '\'' +
                ", dateOuverturePli_AO=" + dateOuverturePli_AO +
                ", heureOuverturePli_AO=" + heureOuverturePli_AO +
                ", coutEstime_AO=" + coutEstime_AO +
                ", cautionProvisoire_AO=" + cautionProvisoire_AO +
                ", statut_AO=" + statut_AO +
                ", marche_AO=" + marche_AO +
                '}';
    }
}
