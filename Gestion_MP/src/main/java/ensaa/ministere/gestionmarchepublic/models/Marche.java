package ensaa.ministere.gestionmarchepublic.models;

import ensaa.ministere.gestionmarchepublic.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Marche {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_Marche;
    private String numOrdre;
    private TypeMarche type_Marche;
    private String objet_marche;
    private StatutMarche statut;
    private int delaisGarantie; // a remplir apres l ouverture des plis en mois
    private LocalDate delaisMarche;
    private String chefServiceConcerne; // le service objet maitre ouvrage
    private ServiceConcerne serviceConcerne;
    private Double montantFinal;
    private boolean isArchived = false; // si true ne pas afficher dans l application

    @OneToMany(mappedBy = "marche_AO",fetch = FetchType.EAGER)
    private List<AppelOffre> appel_offres;

    @ManyToOne
    private Societe societe;

    @OneToOne(mappedBy = "marche_NOTIF")
    private NotificationAppr notificationAppr;

    @OneToMany(mappedBy = "marche_OS",fetch = FetchType.EAGER)
    private List<OrdreDeService> ordreDeServices;

    @OneToMany(mappedBy = "marche_PVR",fetch = FetchType.EAGER)
    private List<PvReception> pvReceptions;
    @OneToMany(mappedBy = "marche_D",fetch = FetchType.EAGER)
    private List<Decompte> decomptes;

    public Marche(Double montantFinal, ServiceConcerne serviceConcerne, String chefServiceConcerne, LocalDate delaisMarche, int delaisGarantie, StatutMarche statut, String objet_marche, TypeMarche type_Marche, String numOrdre) {
        this.montantFinal = montantFinal;
        this.serviceConcerne = serviceConcerne;
        this.chefServiceConcerne = chefServiceConcerne;
        this.delaisMarche = delaisMarche;
        this.delaisGarantie = delaisGarantie;
        this.statut = statut;
        this.objet_marche = objet_marche;
        this.type_Marche = type_Marche;
        this.numOrdre = numOrdre;
        //this.isArchived = false;
    }

    // Mise à jour automatique en fonction de AppelOffre
    public void updateStatutFromAO(StatutAO statutAO) {
        if (statutAO == StatutAO.VALIDE) {
            this.statut = StatutMarche.EnCoursApprobation;
        } else if(statutAO == StatutAO.INFRUTUEUSE) {
            this.statut = StatutMarche.EnCoursTraitement;
        }else if(statutAO == StatutAO.ENCOURS) {
            this.statut = StatutMarche.EnCoursTraitement;
        }
    }

    // Mise à jour après réception définitive
    public void checkPvReception() {
        boolean hasDefinitive = pvReceptions.stream()
                .anyMatch(pv -> pv.getType_PVR() == TypePvReception.DEFINITIVE);
        if (hasDefinitive) {
            this.statut = StatutMarche.Cloture;
            this.isArchived = true;
        }else{
            this.statut = StatutMarche.EncoursExecution;
            this.isArchived = false;
        }
    }

    public void checkOrdreService() {
        boolean hasOrdreServiceArret = ordreDeServices.stream()
                .anyMatch(os -> os.getType_OS()==Type_OS.ARRET);
        boolean hasOrdreServiceComm = ordreDeServices.stream()
                .anyMatch(os-> os.getType_OS()==Type_OS.COMMENCEMENT);
        boolean hasOrdreServiceReprise = ordreDeServices.stream()
                .anyMatch(os-> os.getType_OS()==Type_OS.REPRISE);

        if (hasOrdreServiceArret && hasOrdreServiceComm) {
            this.statut = StatutMarche.EnArret;
        }
        if(hasOrdreServiceComm && hasOrdreServiceReprise && hasOrdreServiceArret) {
            this.statut = StatutMarche.EncoursExecution;
        }
        else if(hasOrdreServiceComm && !hasOrdreServiceReprise && !hasOrdreServiceArret) {
            this.statut = StatutMarche.EncoursExecution;
        }
    }

    public void checkNotification(){
        if (this.notificationAppr != null) {
            this.statut = StatutMarche.Notifie;
        }
    }


    public void checkDelaisMarche(){
    try{
            if (this.delaisMarche.isBefore(LocalDate.now())){
                this.statut = StatutMarche.HorsDelaisMarche;
            }
            if (this.pvReceptions != null ) {
                for (PvReception pvReception : this.pvReceptions) {
                    if (pvReception.getType_PVR() == TypePvReception.PROVISOIRE) {
                        if ((pvReception.getDate().plusMonths(this.delaisGarantie).isBefore(LocalDate.now()))){
                            this.statut = StatutMarche.HorsDelaisGarantie;
                        }
                    }
                }
            }
        }
    catch (NullPointerException e){
        System.out.println("delais pas encore mentionnee dans le marche , "+e.getMessage());
        e.printStackTrace();
    }
    }
}
