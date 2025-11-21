package ensaa.ministere.gestionmarchepublic.models;

import ensaa.ministere.gestionmarchepublic.enums.Type_OS;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrdreDeService {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_OS;
    private String numOrdre_OS;
    private Type_OS type_OS;
    private LocalDate date_OS;

    @ManyToOne
    @NotNull
    private Marche marche_OS;

    @PrePersist
    public void prePersist() {
        if (this.marche_OS != null && this.type_OS == Type_OS.ARRET) {
            this.marche_OS.checkOrdreService();
        }
    }
}
