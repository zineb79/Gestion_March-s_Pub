package ensaa.ministere.gestionmarchepublic.controllers;

import ensaa.ministere.gestionmarchepublic.DTO.DecompteDTO;
import ensaa.ministere.gestionmarchepublic.services.DecompteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decompte")
public class DecompteController {

    @Autowired
    private DecompteService decompteService;

    @GetMapping("/get")
    public List<DecompteDTO> getDecomptes() {
        return decompteService.listerDecompte();
    }

    @GetMapping("/getById/{id}")
    public DecompteDTO getDecompteById(@PathVariable int id) {
        return decompteService.getDecompteById(id);
        //return ResponseEntity.ok().body(decompteService.getDecompteById(id));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addDecompte(@RequestBody DecompteDTO decompteDTO) {
        decompteService.ajouterDecompte(decompteDTO);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDecompte(@PathVariable int id, @RequestBody DecompteDTO decompteDTO) {
        decompteService.modifierDecompte(id, decompteDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDecompte(@PathVariable int id) {
        decompteService.supprimerDecompte(id);
        return ResponseEntity.ok().build();
    }

}
