package ensaa.ministere.gestionmarchepublic.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Societe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_SO;
    private String raisonSociale;
    private String adresse;
    private String ville;
    private String telephone;
    private String email;
    private String idFiscale;

    @OneToMany(mappedBy = "societe")
    private List<Marche> Marches;

    @OneToMany(mappedBy = "societe_D")
    private List<Decompte> decomptes;


    // Constructeur sans Marches et decomptes
    public Societe(int id_SO, String raisonSociale, String adresse, String ville, String telephone, String email, String idFiscale) {
        this.id_SO = id_SO;
        this.raisonSociale = raisonSociale;
        this.adresse = adresse;
        this.ville = ville;
        this.telephone = telephone;
        this.email = email;
        this.idFiscale = idFiscale;
    }

    public Societe(String tahaEquipement, String tilila, String agadir, String number, String mail, String a2144) {
        this.raisonSociale = tahaEquipement;
        this.adresse = tilila;
        this.ville = agadir;
        this.telephone = number;
        this.email = mail;
        this.idFiscale = a2144;
    }
}
