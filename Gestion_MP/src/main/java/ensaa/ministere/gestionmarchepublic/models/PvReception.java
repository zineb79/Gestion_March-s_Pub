package ensaa.ministere.gestionmarchepublic.models;

import ensaa.ministere.gestionmarchepublic.enums.TypePvReception;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PvReception {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_PVR;
    @Enumerated(EnumType.STRING)
    private TypePvReception type_PVR;
    private LocalDate date;

    @ManyToOne
    private Marche marche_PVR;

    @PrePersist
    public void onPersist() {
        if (this.marche_PVR != null && this.type_PVR == TypePvReception.DEFINITIVE) {
            this.marche_PVR.checkPvReception();
        }
    }
}
