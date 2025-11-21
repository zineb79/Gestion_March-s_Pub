package ensaa.ministere.gestionmarchepublic.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationApprDTO {
    private int id_NOTIF;
    private String numOrdre_NOTIF;
    private LocalDate dateVisa_NOTIF;
    private LocalDate dateApprobation_NOTIF;
    private Integer marche_NOTIF;
    private Integer societe_NOTIF;
}
