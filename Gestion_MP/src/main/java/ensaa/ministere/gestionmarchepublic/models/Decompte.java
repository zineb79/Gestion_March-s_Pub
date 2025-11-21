package ensaa.ministere.gestionmarchepublic.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Optional;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Decompte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_D;
    private String numOrdre_D;
    private double aCompte;
    private double somme_D;
    private LocalDate dateFait_D;
    private LocalDate datePaiement;

    @ManyToOne
    private Societe societe_D;

    @ManyToOne
    private Marche marche_D;

}
