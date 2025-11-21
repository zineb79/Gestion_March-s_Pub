package ensaa.ministere.gestionmarchepublic.repositories;


import ensaa.ministere.gestionmarchepublic.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepo extends JpaRepository<Notification, Long> {
    List<Notification> findByDestinataireAndVueFalse(int destinataire);

    int countByDestinataireAndVueFalse(int destinataire);
    List<Notification> findByVueIsTrueAndDestinataire(int destinataire);
}
