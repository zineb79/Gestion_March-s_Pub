package ensaa.ministere.gestionmarchepublic.controllers;

import ensaa.ministere.gestionmarchepublic.DTO.OrdreDeServiceDTO;
import ensaa.ministere.gestionmarchepublic.services.OrdreDeServiceService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/OS")
public class OrdreServiceController {


    private final OrdreDeServiceService ordreDeServiceService;

    public OrdreServiceController(OrdreDeServiceService ordreDeServiceService) {
        this.ordreDeServiceService = ordreDeServiceService;
    }

    @GetMapping("/get")
    public List<OrdreDeServiceDTO> getOrdreDeServices() {
        return ordreDeServiceService.getAllOrdreDeServices();
    }

    @GetMapping("/getById/{id}")
    public OrdreDeServiceDTO getOrdreDeServiceById(@PathVariable int id) {
        return ordreDeServiceService.getOrdreDeServiceById(id);
        //return ResponseEntity.ok().body(ordreDeServiceService.getOrdreDeServiceById(id));
    }

    @PostMapping("/add")
    public ResponseEntity<Void> addOrdreDeService(@RequestBody OrdreDeServiceDTO ordreDeService) {
        ordreDeServiceService.ajouterOrdreDeService(ordreDeService);
        return ResponseEntity.ok().build();
    }



    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteOrdreDeServiceById(@PathVariable int id) {
        try{
            ordreDeServiceService.supprimerOrdreDeService(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateOrdreDeService(@PathVariable int id, @RequestBody OrdreDeServiceDTO ordreDeService) {
        ordreDeServiceService.modifierOrdreDeService(id, ordreDeService);
        return ResponseEntity.ok().build();
    }

}
