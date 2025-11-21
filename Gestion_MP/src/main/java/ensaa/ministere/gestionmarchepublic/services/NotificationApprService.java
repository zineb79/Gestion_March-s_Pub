package ensaa.ministere.gestionmarchepublic.services;

import ensaa.ministere.gestionmarchepublic.DTO.NotificationApprDTO;
import ensaa.ministere.gestionmarchepublic.DTO.SocieteDTO;
import ensaa.ministere.gestionmarchepublic.models.Marche;

import java.util.List;

public interface NotificationApprService {
    NotificationApprDTO creerNotificationAppr(NotificationApprDTO notificationAppr);
    NotificationApprDTO modifierNotificationAppr(int id,NotificationApprDTO notificationAppr);
    void supprimerNotificationAppr(int idNotificationAppr);
    List<NotificationApprDTO> getAllNotificationAppr();
    NotificationApprDTO getNotificationApprById(int idNotificationAppr);
    NotificationApprDTO getNotificationApprByMarche(int marche);
    SocieteDTO getSocieteByIdMarche(int idMarche);
    String getNumOrdreMarche(int idMarche);
}
