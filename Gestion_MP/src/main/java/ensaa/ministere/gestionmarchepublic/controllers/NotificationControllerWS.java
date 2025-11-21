package ensaa.ministere.gestionmarchepublic.controllers;

import ensaa.ministere.gestionmarchepublic.enums.StatutMarche;
import ensaa.ministere.gestionmarchepublic.models.Notification;
import ensaa.ministere.gestionmarchepublic.repositories.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Map;

@Controller
public class NotificationControllerWS {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    @Autowired
    private NotificationRepo notificationRepo;

    public void sendMarcheStatusUpdateNotification(int marcheId,String nomMarche, StatutMarche nouveauStatut, int destinataire) {

        //creer et enregistrer la notification dans la base de donnees
        Notification notif = Notification.builder()
                .marcheId(marcheId)
                .nomMarche(nomMarche)
                .statut(nouveauStatut.name())
                .destinataire(destinataire)
                .dateEnvoi(LocalDateTime.now())
                .build();
        notificationRepo.save(notif);

       //json
        String destination = "/topic/marche-status";
        Map<String, Object> payload = Map.of(
                "id", marcheId,
                "nom", nomMarche,
                "statut", nouveauStatut.name()
        );
        messagingTemplate.convertAndSend(destination, payload);

    }
}
