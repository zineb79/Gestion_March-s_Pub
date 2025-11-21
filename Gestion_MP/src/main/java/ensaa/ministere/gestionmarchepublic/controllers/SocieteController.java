package ensaa.ministere.gestionmarchepublic.controllers;

import ensaa.ministere.gestionmarchepublic.DTO.SocieteDTO;
import ensaa.ministere.gestionmarchepublic.services.SocieteService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/societe")
public class SocieteController {

    @Autowired
    private SocieteService societeService;

    @GetMapping("/get")
    public List<SocieteDTO> getSocietes() {
        return societeService.getAllSocietes();
    }

    @GetMapping("/getById/{id}")
    public SocieteDTO getSocieteById(@PathVariable int id) {

        return  societeService.getSocieteByID(id);

    }
    @GetMapping("/getById/{raisonSociale}")
    public SocieteDTO getSocieteByNumOrdre(@PathVariable String raisonSociale) {

        return societeService.getSocieteByRaisonSociale(raisonSociale);

    }

    @PostMapping("/add")
    private ResponseEntity<?> addSociete(@RequestBody SocieteDTO societeDTO) {
        societeService.ajouterSociete(societeDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    private ResponseEntity<?> deleteSociete(@PathVariable int id) {
        try{
        societeService.supprimerSociete(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    private ResponseEntity<?> updateSociete(@PathVariable int id, @RequestBody SocieteDTO societeDTO) {
        societeService.modifierSociete(id, societeDTO);
        return ResponseEntity.ok().build();
    }
}
