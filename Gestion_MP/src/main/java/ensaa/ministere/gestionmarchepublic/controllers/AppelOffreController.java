package ensaa.ministere.gestionmarchepublic.controllers;

import ensaa.ministere.gestionmarchepublic.DTO.AppelOffreDTO;

import ensaa.ministere.gestionmarchepublic.services.AppelOffreService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/AppelOffre")
public class AppelOffreController {
    @Autowired
    AppelOffreService appelOffreService;

    @GetMapping("/getAll")
    public List<AppelOffreDTO> list() {
        return appelOffreService.listerAppelOffre();
    }
    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getById(@PathVariable int id) {
        try {
            appelOffreService.getAppelOffreById(id);
            return ResponseEntity.ok().build();
        }catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }
    @GetMapping("/getByNumOrdre/{numOrdre}")
    public ResponseEntity<?> getById(@PathVariable String numOrdre) {
        try {
            appelOffreService.getAppelOffreByNumOrdre(numOrdre);
            return ResponseEntity.ok().build();
        }catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }



    }
    @GetMapping("/getByIdMarche/{id}")
    public ResponseEntity<?> getByIdMarche(@PathVariable int id) {
        try {
            appelOffreService.getAppelOffreByMarche(id);
            return ResponseEntity.ok().build();
        }catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }


    @DeleteMapping("/delete/{numOrdre}")
    public ResponseEntity<?> delete(@PathVariable String numOrdre) {
        try {
            appelOffreService.supprimerAO(numOrdre);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody AppelOffreDTO appelOffreDTO) {

        appelOffreService.ajouterAO(appelOffreDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable int id,@RequestBody AppelOffreDTO appelOffreDTO) {
        try {
            appelOffreService.modifierAO(id, appelOffreDTO);
            return ResponseEntity.ok().build();
        }catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }
}

