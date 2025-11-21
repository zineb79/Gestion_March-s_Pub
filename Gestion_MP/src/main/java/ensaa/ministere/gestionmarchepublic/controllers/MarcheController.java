package ensaa.ministere.gestionmarchepublic.controllers;

import ensaa.ministere.gestionmarchepublic.DTO.MarcheDTO;
import ensaa.ministere.gestionmarchepublic.services.MarcheService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/marche")
public class MarcheController {
    @Autowired
    MarcheService marcheService;

    @GetMapping("/")
    public List<MarcheDTO> getAllMarche(){
        return marcheService.getAllMarches();
    }
    @GetMapping("/{numOrdre}")
    public ResponseEntity<?> getMarche(@PathVariable String numOrdre){
        try {
            marcheService.getMarcheByNumOrdre(numOrdre);
            return ResponseEntity.ok().build();
        }catch (EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getMarcheById(@PathVariable int id){
        try {
            marcheService.getMarcheById(id);
            return ResponseEntity.ok().build();
        }catch (EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    @GetMapping("/numOrdre/{id}")
    public ResponseEntity<String> getNumOrdre(@PathVariable int id) {
        try {
            String numOrdre = marcheService.getNumOrdreByIdMarche(id);
            return ResponseEntity.ok(numOrdre);
        }catch (EntityNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }

    }
    @PostMapping("/add")
    public MarcheDTO addMarche(@RequestBody MarcheDTO marche){
        return marcheService.creerMarche(marche);
    }
    @DeleteMapping("/delete/{numOrdre}")
    public void deleteMarche(@PathVariable String numOrdre){
        marcheService.supprimerMarche(numOrdre);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteMarche(@PathVariable int id){
        marcheService.supprimerMarche(id);
    }

    @PutMapping("/update/{id}")
    public MarcheDTO updateMarche(@PathVariable int id, @RequestBody MarcheDTO marche){
        return marcheService.modifierMarche(id, marche);
    }
}
