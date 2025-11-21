
package ensaa.ministere.gestionmarchepublic.controllers;

import ensaa.ministere.gestionmarchepublic.DTO.UtilisateurDTO;
import ensaa.ministere.gestionmarchepublic.models.Utilisateur;
import ensaa.ministere.gestionmarchepublic.repositories.UserRepository;
import ensaa.ministere.gestionmarchepublic.security.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@Tag(name = "Authentification", description = "permettre une Authentification avec JWT")
public class AuthController {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    @Operation(summary = "AUTHENTIFICATION D'UN UTILISATEUR", description = "L'UTILISATEUR S'AUTHENTIFIE ET UN JETON SE CREE AVEC JWT")
    public ResponseEntity<?> login(@RequestBody UtilisateurDTO utilisateurDTO) {
        System.out.println("Login attempt: " + utilisateurDTO.getEmail());

        Optional<Utilisateur> userFestch = userRepository.findByEmail(utilisateurDTO.getEmail());
        if (userFestch.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        Utilisateur user = userFestch.get();

        if (!passwordEncoder.matches(utilisateurDTO.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(utilisateurDTO.getEmail());
        Map<String, String> tokens = jwtUtil.generateTokens(userDetails.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", tokens.get("accessToken"));
        response.put("refreshToken", tokens.get("refreshToken"));
        response.put("role", user.getRole());
        response.put("nom", user.getNom());
        response.put("prenom", user.getPrenom());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/refresh")
    @Operation(summary = "RENOUVELLEMENT D'UN ACCESS TOKEN", description = "GÉNÉRER UN NOUVEAU ACCESS TOKEN À PARTIR D'UN REFRESH TOKEN VALIDE")
    public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");

        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Refresh token manquant");
        }

        try {
            String email = jwtUtil.extractEmail(refreshToken);

            if (!jwtUtil.isTokenExpired(refreshToken)) {
                String newAccessToken = jwtUtil.generateAccessToken(email);

                Map<String, String> response = new HashMap<>();
                response.put("accessToken", newAccessToken);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token expiré");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token invalide");
        }
    }

}





//package ensaa.ministere.gestionmarchepublic.controllers;
//
//import ensaa.ministere.gestionmarchepublic.DTO.UtilisateurDTO;
//import ensaa.ministere.gestionmarchepublic.models.Utilisateur;
//import ensaa.ministere.gestionmarchepublic.repositories.UserRepository;
//import ensaa.ministere.gestionmarchepublic.security.JwtUtil;
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/auth")
//@Tag(name = "Authentification",description = "permettre une Authentification avec JWT")
//public class AuthController {
//
//
//    @Autowired
//    private UserDetailsService userDetailsService;
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Autowired
//    private UserRepository userRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//
//    @PostMapping("/login")
//    @Operation(summary = "AUTHENTIFICATION D'UN UTILISATEUR",description = "L'UTILISATEUR S'AUTHENTIFIE ET UN JETON SE CREE AVEC JWT")
//    public ResponseEntity<?> login(@RequestBody UtilisateurDTO utilisateurDTO) {
//        System.out.println("Login attempt: " + utilisateurDTO.getEmail());
//
//        Optional<Utilisateur> userFestch = userRepository.findByEmail(utilisateurDTO.getEmail());
//        Utilisateur user=null;
//        if (userFestch.isPresent()) {
//            user = userFestch.get();
//
//            // Compare hashed password
//            if (!passwordEncoder.matches(utilisateurDTO.getPassword(), user.getPassword())) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
//            }
//
//            UserDetails userDetails = userDetailsService.loadUserByUsername(utilisateurDTO.getEmail());
//            System.out.println("User found: " + userDetails.getUsername());
//
//            String token = jwtUtil.generateToken(userDetails.getUsername());
//            System.out.println("Generated token: " + token);
//
//            Map<String, Object> response = new HashMap<>();
//            response.put("token", token);
//            response.put("role", user.getRole());
//            response.put("nom", user.getNom());
//            response.put("prenom", user.getPrenom());
//            return ResponseEntity.ok(response);
//        }
//        else{
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
//        }
//
//    }
//}
//
//
//
//
//
//
//
//
//
//
//
//
//
//
////    @PostMapping("/auth/login")
////    @Operation(summary = "AUTHENTIFICATION D'UN UTILISATEUR",description = "L'UTILISATEUR S'AUTHENTIFIE ET UN JETON SE CREE AVEC JWT")
////    public ResponseEntity<?> login(@RequestBody UtilisateurDTO utilisateurDTO) {
////        System.out.println("Login attempt: " + utilisateurDTO.getEmail());
////
////        Optional<Utilisateur> userFestch = userRepository.findByEmail(utilisateurDTO.getEmail());
////        Utilisateur user=null;
////        if (userFestch.isPresent()) {
////            user = userFestch.get();
////
////            // Compare hashed password
////            if (!passwordEncoder.matches(utilisateurDTO.getPassword(), user.getPassword())) {
////                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
////            }
////
////            UserDetails userDetails = userDetailsService.loadUserByUsername(utilisateurDTO.getEmail());
////            System.out.println("User found: " + userDetails.getUsername());
////
////            String token = jwtUtil.generateToken(userDetails.getUsername());
////            System.out.println("Generated token: " + token);
////
////            Map<String, Object> response = new HashMap<>();
////            response.put("token", token);
////            response.put("role", user.getRole());
////            response.put("nom", user.getNom());
////            response.put("prenom", user.getPrenom());
////            return ResponseEntity.ok(response);
////        }
////        else{
////            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
////        }
////
////    }
