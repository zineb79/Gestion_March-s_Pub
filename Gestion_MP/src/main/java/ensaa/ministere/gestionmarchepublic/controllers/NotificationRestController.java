package ensaa.ministere.gestionmarchepublic.controllers;


import ensaa.ministere.gestionmarchepublic.models.Notification;
import ensaa.ministere.gestionmarchepublic.repositories.NotificationRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/MarcheNotification")
public class NotificationRestController {

    @Autowired
    private NotificationRepo notificationRepository;
    @GetMapping("/getUnread")
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @GetMapping("/getUnreadCount")
    public int getNotificationsNonVues(@RequestParam int destinataire) {
        //return notificationRepository.findByDestinataireAndVueFalse(destinataire);
        return notificationRepository.countByDestinataireAndVueFalse(destinataire);
    }
    //unused
    @PostMapping("/marquer-vue")
    public void marquerCommeVues(@RequestBody List<Long> ids) {
        List<Notification> notifs = notificationRepository.findAllById(ids);
        notifs.forEach(n -> n.setVue(true));
        notificationRepository.saveAll(notifs);
    }
    @PutMapping("/markAsRead/{id}")
    public void markAsRead(@PathVariable Long id) {
        Notification notif = notificationRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Notification dont id ="+id+" n'existe pas"));
        notif.setVue(true);
        notificationRepository.save(notif);
    }
}