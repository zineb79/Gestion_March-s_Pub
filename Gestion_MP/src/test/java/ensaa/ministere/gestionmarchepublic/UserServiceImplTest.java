package ensaa.ministere.gestionmarchepublic;

import ensaa.ministere.gestionmarchepublic.DTO.UtilisateurDTO;
import ensaa.ministere.gestionmarchepublic.models.Utilisateur;
import ensaa.ministere.gestionmarchepublic.repositories.UserRepository;
import ensaa.ministere.gestionmarchepublic.servicesImplementation.UserServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetUserById_Success() {
        Utilisateur user = Utilisateur.builder()
                .id_user(1L)
                .nom("Doe")
                .prenom("John")
                .email("john.doe@example.com")
                .role("ADMIN")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        UtilisateurDTO dto = userService.getUserById(1L);

        assertEquals("Doe", dto.getNom());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> userService.getUserById(2L));
    }

    @Test
    void testCreateUser() {
        UtilisateurDTO dto = new UtilisateurDTO();
        dto.setNom("Smith");
        dto.setPrenom("Anna");
        dto.setEmail("anna.smith@example.com");
        dto.setRole("USER");
        dto.setPassword("plainPassword");

        when(passwordEncoder.encode("plainPassword")).thenReturn("encodedPassword");

        Utilisateur savedUser = Utilisateur.builder()
                .nom("Smith")
                .prenom("Anna")
                .email("anna.smith@example.com")
                .role("USER")
                .password("encodedPassword")
                .build();

        when(userRepository.save(any(Utilisateur.class))).thenReturn(savedUser);

        UtilisateurDTO result = userService.createUser(dto);

        assertEquals("Smith", result.getNom());
        verify(userRepository, times(1)).save(any(Utilisateur.class));
    }

    @Test
    void testUpdateUserPassword_Success() {
        Utilisateur user = Utilisateur.builder()
                .id_user(1L)
                .password("oldPassword")
                .build();

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newPassword")).thenReturn("encodedNewPassword");

        UtilisateurDTO dto = userService.updateUserPassword(1L, "newPassword");

        assertEquals(1, dto.getId_user());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testDeleteUser_Success() {
        when(userRepository.existsById(1L)).thenReturn(true);
        doNothing().when(userRepository).deleteById(1L);

        userService.deleteUser(1L);

        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteUser_NotFound() {
        when(userRepository.existsById(99L)).thenReturn(false);

        assertThrows(EntityNotFoundException.class, () -> userService.deleteUser(99L));
    }
}
