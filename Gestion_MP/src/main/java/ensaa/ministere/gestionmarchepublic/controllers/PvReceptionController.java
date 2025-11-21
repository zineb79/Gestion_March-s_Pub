package ensaa.ministere.gestionmarchepublic.controllers;
import ensaa.ministere.gestionmarchepublic.DTO.PvReceptionDTO;
import ensaa.ministere.gestionmarchepublic.services.PvReceptionService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/PvReception")
public class PvReceptionController {

    private final  PvReceptionService pvReceptionService;
    public PvReceptionController(PvReceptionService pvReceptionService) {
        this.pvReceptionService = pvReceptionService;
    }

    @GetMapping("/get")
    public List<PvReceptionDTO> getPvReceptions() {
        return pvReceptionService.getAllPvReception();
    }

    @GetMapping("/getById/{id}")
    public PvReceptionDTO getPvReceptionById(@PathVariable int id) {
        return pvReceptionService.getPvReceptionById(id);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePvReception(@PathVariable int id) {
        try{
        pvReceptionService.supprimerPvReception(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @PostMapping("/add")
    public ResponseEntity<?> addPvReception(@RequestBody PvReceptionDTO pvReception) {
        pvReceptionService.ajouterPvReception(pvReception);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updatePvReception(@RequestBody PvReceptionDTO pvReception, @PathVariable int id) {
        pvReceptionService.modifierPvReception(id,pvReception);
        return ResponseEntity.ok().build();
    }


}
