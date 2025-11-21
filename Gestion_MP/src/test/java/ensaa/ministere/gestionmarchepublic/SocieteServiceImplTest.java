package ensaa.ministere.gestionmarchepublic;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import ensaa.ministere.gestionmarchepublic.DTO.SocieteDTO;
import ensaa.ministere.gestionmarchepublic.models.Societe;
import ensaa.ministere.gestionmarchepublic.repositories.SocieteRepo;
import ensaa.ministere.gestionmarchepublic.servicesImplementation.SocieteServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@ExtendWith(MockitoExtension.class)
class SocieteServiceImplTest {

    @Mock
    private SocieteRepo societeRepo;

    @InjectMocks
    private SocieteServiceImpl societeService;

    private Societe societe;
    private SocieteDTO societeDTO;
    private SocieteDTO societeDTO2;

    @BeforeEach
    void setUp() {
        societe = new Societe(1, "EntrepriseX", "AdresseX", "0600000000", "email@example.com", "123456", "CNSS123");
        societeDTO = new SocieteDTO(1, "EntrepriseX", "AdresseX", "0600000000", "email@example.com", "123456", "CNSS123");
        societeDTO2 = new SocieteDTO(1, "EntrepriseX", "AdresseY", "0600000060", "email@example.com", "223456", "CNSS123");
    }

    @Test
    void testAjouterSociete() {
        when(societeRepo.save(any(Societe.class))).thenAnswer(invocation -> {
            Societe s = invocation.getArgument(0);
            s.setId_SO(1);
            return s;
        });

        SocieteDTO result = societeService.ajouterSociete(societeDTO);

        assertNotNull(result);
        assertEquals(societeDTO.getRaisonSociale(), result.getRaisonSociale());
    }

    @Test
    void testAjouterSociete_Null() {
        assertThrows(NoSuchElementException.class, () -> societeService.ajouterSociete(null));
    }

    @Test
    void testModifierSociete() {
        when(societeRepo.findById(1)).thenReturn(Optional.of(societe));
        when(societeRepo.save(any(Societe.class))).thenReturn(societe);

        SocieteDTO result = societeService.modifierSociete(1, societeDTO2);

        assertNotNull(result);
        assertEquals(societeDTO2.getAdresse(), result.getAdresse());
    }

    @Test
    void testModifierSociete_NotFound() {
        when(societeRepo.findById(1)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> societeService.modifierSociete(1, societeDTO2));
    }

    @Test
    void testSupprimerSociete() {
        when(societeRepo.findById(1)).thenReturn(Optional.of(societe));
        doNothing().when(societeRepo).delete(any(Societe.class));

        assertDoesNotThrow(() -> societeService.supprimerSociete(1));
    }

    @Test
    void testSupprimerSociete_NotFound() {
        when(societeRepo.findById(1)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> societeService.supprimerSociete(1));
    }

    @Test
    void testGetSocieteByID() {
        when(societeRepo.findById(1)).thenReturn(Optional.of(societe));

        SocieteDTO result = societeService.getSocieteByID(1);

        assertNotNull(result);
        assertEquals(societeDTO.getRaisonSociale(), result.getRaisonSociale());
    }

    @Test
    void testGetSocieteByID_NotFound() {
        when(societeRepo.findById(1)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> societeService.getSocieteByID(1));
    }

    @Test
    void testGetAllSocietes() {
        List<Societe> societes = Arrays.asList(societe);
        when(societeRepo.findAll()).thenReturn(societes);

        List<SocieteDTO> result = societeService.getAllSocietes();

        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }
}
