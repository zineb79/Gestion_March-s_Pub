package ensaa.ministere.gestionmarchepublic;

import ensaa.ministere.gestionmarchepublic.DTO.DecompteDTO;
import ensaa.ministere.gestionmarchepublic.models.Decompte;
import ensaa.ministere.gestionmarchepublic.models.Marche;
import ensaa.ministere.gestionmarchepublic.models.Societe;
import ensaa.ministere.gestionmarchepublic.repositories.DecompteRepo;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.repositories.SocieteRepo;
import ensaa.ministere.gestionmarchepublic.servicesImplementation.DecompteServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DecompteServiceImplTest {

    @InjectMocks
    private DecompteServiceImpl decompteService;

    @Mock
    private DecompteRepo repoD;
    @Mock
    private MarcheRepo repoM;
    @Mock
    private SocieteRepo repoS;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAjouterDecompte_Success() {
        // Arrange
        DecompteDTO dto = new DecompteDTO();
        //dto.setNom_D("Decompte1");
        dto.setNumOrdre_D("A2222");
        dto.setACompte(2000);
        dto.setSomme_D(5000.0);
        dto.setIdMarche(10);
        dto.setIdSociete(20);

        Societe societe = new Societe();
        societe.setId_SO(20);
        Marche marche = new Marche();
        marche.setId_Marche(10);

        when(repoM.findById_Marche(10)).thenReturn(marche);
        when(repoS.findById(20)).thenReturn(Optional.of(societe));
        when(repoD.save(any(Decompte.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        DecompteDTO result = decompteService.ajouterDecompte(dto);

        // Assert
        assertNotNull(result);
        assertEquals(dto.getNumOrdre_D(), result.getNumOrdre_D());
        verify(repoD, times(1)).save(any(Decompte.class));
    }

    @Test
    void testAjouterDecompte_SocieteNotFound() {
        DecompteDTO dto = new DecompteDTO();
        //dto.setNom_D("Decompte1");
        dto.setNumOrdre_D("A2222");
        dto.setACompte(2000);
        dto.setSomme_D(5000.0);
        dto.setIdMarche(10);
        dto.setIdSociete(99);

        when(repoM.findById_Marche(10)).thenReturn(new Marche());
        when(repoS.findById(99)).thenReturn(Optional.empty());

        Exception exception = assertThrows(EntityNotFoundException.class, () -> {
            decompteService.ajouterDecompte(dto);
        });

        assertTrue(exception.getMessage().contains("Société avec id : 99 est introuvable"));
    }

    @Test
    void testModifierDecompte_Success() {
        int id = 1;

        Decompte existing = new Decompte();
        existing.setId_D(id);

        DecompteDTO dto = new DecompteDTO();
        //dto.setNom_D("Updated");
        dto.setNumOrdre_D("A2222");
        dto.setACompte(2000);
        dto.setSomme_D(7000.0);
        dto.setIdMarche(100);
        dto.setIdSociete(200);

        when(repoD.findById(id)).thenReturn(existing);
        when(repoM.findById_Marche(100)).thenReturn(new Marche());
        when(repoS.findById(200)).thenReturn(Optional.of(new Societe()));
        when(repoD.save(any(Decompte.class))).thenAnswer(invocation -> invocation.getArgument(0));

        DecompteDTO result = decompteService.modifierDecompte(id, dto);

        assertNotNull(result);
        assertEquals(dto.getNumOrdre_D(), result.getNumOrdre_D());
    }

    @Test
    void testModifierDecompte_NotFound() {
        when(repoD.findById(123)).thenReturn(null);

        assertThrows(EntityNotFoundException.class, () ->
                decompteService.modifierDecompte(123, new DecompteDTO()));
    }

    @Test
    void testSupprimerDecompte_Success() {
        Decompte decompte = new Decompte();
        when(repoD.findById(5)).thenReturn(decompte);

        decompteService.supprimerDecompte(5);

        verify(repoD, times(1)).delete(decompte);
    }

    @Test
    void testSupprimerDecompte_NotFound() {
        when(repoD.findById(7)).thenReturn(null);

        assertThrows(NoSuchElementException.class, () -> decompteService.supprimerDecompte(7));
    }
}

