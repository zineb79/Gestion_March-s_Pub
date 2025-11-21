package ensaa.ministere.gestionmarchepublic.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int marcheId;
    private String nomMarche;
    private String statut;
    private int destinataire; // email ou username
    private boolean vue = false;
    private LocalDateTime dateEnvoi;

}