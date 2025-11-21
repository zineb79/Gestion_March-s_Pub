package ensaa.ministere.gestionmarchepublic.servicesImplementation;

import ensaa.ministere.gestionmarchepublic.DTO.UtilisateurDTO;
import ensaa.ministere.gestionmarchepublic.models.Utilisateur;
import ensaa.ministere.gestionmarchepublic.repositories.UserRepository;
import ensaa.ministere.gestionmarchepublic.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;



/**

*/


@Service
public class UserServiceImpl implements UserDetailsService, UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilisateur user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé avec l'email : " + email));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole())  // Assure-toi que getRole() renvoie bien le rôle attendu
                .build();
    }

    @Override
    public List<UtilisateurDTO> getAllUsers() {
        List<Utilisateur> users = userRepository.findAll();
        return users.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public UtilisateurDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur avec id : " + id + " n'existe pas dans la base de données !!"));
    }

    @Override
    public UtilisateurDTO getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(this::convertToDTO)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur avec email : " + email + " n'existe pas dans la base de données !!"));
    }

    @Override
    public UtilisateurDTO getUserByUsername(String username) {
        throw new UnsupportedOperationException("Cette méthode n'est pas encore implémentée.");
    }

    @Override
    public UtilisateurDTO createUser(UtilisateurDTO user) {
        Utilisateur utilisateur = Utilisateur.builder()
                .nom(user.getNom())
                .prenom(user.getPrenom())
                .email(user.getEmail())
                .role(user.getRole())
                .password(passwordEncoder.encode(user.getPassword()))
                .build();
        userRepository.save(utilisateur);
        return convertToDTO(utilisateur);
    }

    @Override
    public UtilisateurDTO updateUserPassword(Long id, String password) {
        Utilisateur utilisateur = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur avec id : " + id + " n'existe pas dans la base de données !!"));

        utilisateur.setPassword(passwordEncoder.encode(password));
        userRepository.save(utilisateur);
        return convertToDTO(utilisateur);
    }

    @Override
    public void deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Utilisateur avec id : " + id + " n'existe pas dans la base de données !!");
        }
    }

    @Override
    public UtilisateurDTO updateUserInfo(Long id, UtilisateurDTO user) {
        Utilisateur utilisateur = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur avec id : " + id + " n'existe pas dans la base de données !!"));

        if (!Objects.equals(user.getNom(), utilisateur.getNom())) {
            utilisateur.setNom(user.getNom());
        }
        if (!Objects.equals(user.getPrenom(), utilisateur.getPrenom())) {
            utilisateur.setPrenom(user.getPrenom());
        }
        if (!Objects.equals(user.getEmail(), utilisateur.getEmail())) {
            utilisateur.setEmail(user.getEmail());
        }
        if (!Objects.equals(user.getRole(), utilisateur.getRole())) {
            utilisateur.setRole(user.getRole());
        }
        userRepository.save(utilisateur);
        return convertToDTO(utilisateur);
    }


    private UtilisateurDTO convertToDTO(Utilisateur user) {
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setId_user(user.getId_user());
        dto.setNom(user.getNom());
        dto.setPrenom(user.getPrenom());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        return dto;
    }
}


