package ensaa.ministere.gestionmarchepublic.models;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationAppr {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private int id_NOTIF;
    private String numOrdre_NOTIF;
    private LocalDate dateVisa_NOTIF;
    private LocalDate dateApprobation_NOTIF;
    @OneToOne
    private Marche marche_NOTIF;


    @PrePersist
    public void onPersist() {
        if (this.marche_NOTIF != null) {
            this.marche_NOTIF.checkNotification();
        }
    }



}
