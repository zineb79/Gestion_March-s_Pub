package ensaa.ministere.gestionmarchepublic.controllers;

import ensaa.ministere.gestionmarchepublic.DTO.UtilisateurDTO;
import ensaa.ministere.gestionmarchepublic.models.Utilisateur;
import ensaa.ministere.gestionmarchepublic.repositories.UserRepository;
import ensaa.ministere.gestionmarchepublic.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    //@PreAuthorize("hasAuthority('SECRETAIRE') or hasAuthority('CHEF_DE_SERVICE')") // Assurez-vous que l'utilisateur a le bon rôle
    public ResponseEntity<?> getUserById(@PathVariable Long id) {

        Optional<UtilisateurDTO> user = Optional.ofNullable(userService.getUserById(id));

        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    //@PreAuthorize("hasAuthority('CHEF_DE_SERVICE')")
    public ResponseEntity<?> getAllUsers() {

        Optional<List<UtilisateurDTO>> users = Optional.ofNullable(userService.getAllUsers());
        return users.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }



    @PostMapping("/adduser")
    //@PreAuthorize("hasAuthority('CHEF_DE_SERVICE')")
    public ResponseEntity<?> addUser(@Valid @RequestBody UtilisateurDTO user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(user));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UtilisateurDTO updatedUser) {
        UtilisateurDTO user = userService.updateUserInfo(id, updatedUser);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

//    @PutMapping("/update/{id}")
//    @PreAuthorize("hasAuthority('CHEF_DE_SERVICE')")
//    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UtilisateurDTO user) {
//
//    }

    //@DeleteMapping
}
