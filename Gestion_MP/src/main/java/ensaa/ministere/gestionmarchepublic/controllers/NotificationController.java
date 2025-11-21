package ensaa.ministere.gestionmarchepublic.controllers;

import ensaa.ministere.gestionmarchepublic.DTO.NotificationApprDTO;
import ensaa.ministere.gestionmarchepublic.DTO.SocieteDTO;
import ensaa.ministere.gestionmarchepublic.services.NotificationApprService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Notification")
public class NotificationController {

    @Autowired
    private NotificationApprService notificationApprService;

    @GetMapping("/get")
    public List<NotificationApprDTO> getNotificationApprs() {
        return notificationApprService.getAllNotificationAppr();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getNotificationApprById(@PathVariable int id) {
        try {
            NotificationApprDTO n = notificationApprService.getNotificationApprById(id);
            return ResponseEntity.status(HttpStatus.OK).body(n);
        }catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getByMarche/{idMarche}")
    public ResponseEntity<?> getNotificationApprByMarche(@PathVariable int idMarche) {
        try {
            NotificationApprDTO notificationApprDTO = notificationApprService.getNotificationApprByMarche(idMarche);
            return ResponseEntity.ok(notificationApprDTO);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/getSocieteByIdMarche")
    public ResponseEntity<?> getSocieteByIdMarche(@RequestParam int idMarche) {
        try{
            SocieteDTO s = notificationApprService.getSocieteByIdMarche(idMarche);
            return ResponseEntity.ok(s);
        }catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @GetMapping("/getNOM/{idMarche}")
    public ResponseEntity<String> getNumOrdreMarche(@PathVariable int idMarche) {
        try {
            String numOrdre = notificationApprService.getNumOrdreMarche(idMarche);
            return ResponseEntity.ok(numOrdre);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @PostMapping("/add")
    public ResponseEntity<?> addNotificationAppr(@RequestBody NotificationApprDTO notificationApprDTO) {
        try {
            notificationApprService.creerNotificationAppr(notificationApprDTO);
            return ResponseEntity.ok().build();
        }catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateNotificationAppr(@PathVariable int id, @RequestBody NotificationApprDTO notificationApprDTO) {
        try {
            notificationApprService.modifierNotificationAppr(id, notificationApprDTO);
            return ResponseEntity.ok().build();
        }catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteNotificationAppr(@PathVariable int id) {
       try {
           notificationApprService.supprimerNotificationAppr(id);
           return ResponseEntity.ok().build();
       }catch (EntityNotFoundException e) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
       }

    }

}
