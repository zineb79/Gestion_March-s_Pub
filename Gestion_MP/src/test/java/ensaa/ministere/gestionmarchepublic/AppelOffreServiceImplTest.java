package ensaa.ministere.gestionmarchepublic;

import ensaa.ministere.gestionmarchepublic.DTO.AppelOffreDTO;
import ensaa.ministere.gestionmarchepublic.enums.StatutAO;
import ensaa.ministere.gestionmarchepublic.models.AppelOffre;
import ensaa.ministere.gestionmarchepublic.models.Marche;
import ensaa.ministere.gestionmarchepublic.repositories.AppelOffreRepo;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.servicesImplementation.AppelOffreServiceImpl;
import ensaa.ministere.gestionmarchepublic.servicesImplementation.ChangementEtatsService;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppelOffreServiceImplTest {

    @Mock
    private AppelOffreRepo appelOffreRepo;
    @Mock
    private MarcheRepo marcheRepo;
    @Mock
    private ChangementEtatsService changementEtatsService;


    @InjectMocks
    private AppelOffreServiceImpl appelOffreServiceImpl;
    //@InjectMocks

    private AppelOffre appelOffre;
    private AppelOffreDTO appelOffreDTO;

    @BeforeEach
    void setUp() {
        Marche marche = new Marche();
        marche.setId_Marche(1);  // Assurez-vous que l'ID est défini
        appelOffre = new AppelOffre(1,"A1254", "Public",  LocalDate.now(), LocalTime.now(), 10000.0, 500.0, StatutAO.ENCOURS, marche);
        appelOffreDTO = new AppelOffreDTO(1, "A1254", "Public", LocalDate.now(),LocalTime.now(), 10000.0, 500.0, StatutAO.ENCOURS, 1);
    }

    // ✅ Test de l'ajout d'un appel d'offre
    @Test
    void testAjouterAO() {
        Marche marche = new Marche(); // simulate the linked Marche
        marche.setId_Marche(1);

        // Mock du comportement du repo
        when(marcheRepo.findById_Marche(1)).thenReturn(marche);
        when(appelOffreRepo.save(any(AppelOffre.class))).thenReturn(appelOffre);

        AppelOffreDTO result = appelOffreServiceImpl.ajouterAO(appelOffreDTO);

        assertNotNull(result);
        assertEquals("A1254", result.getNum_Ordre_AO());
        verify(appelOffreRepo, times(1)).save(any(AppelOffre.class));
    }


    // ✅ Test de la modification d'un appel d'offre existant
    @Test
    void testModifierAO() {
        when(appelOffreRepo.findById(1)).thenReturn(Optional.of(appelOffre));
        when(appelOffreRepo.save(any(AppelOffre.class))).thenReturn(appelOffre);

        AppelOffreDTO result = appelOffreServiceImpl.modifierAO(1, appelOffreDTO);

        assertNotNull(result);
        assertEquals("A1254", result.getNum_Ordre_AO());
        verify(appelOffreRepo, times(1)).findById(1);
        verify(appelOffreRepo, times(1)).save(any(AppelOffre.class));
    }

    // ✅ Test de la suppression d'un appel d'offre existant
    @Test
    void testSupprimerAO() {
        when(appelOffreRepo.findByNum_Ordre_AO("A1254")).thenReturn(appelOffre);

        appelOffreServiceImpl.supprimerAO(appelOffreDTO.getNum_Ordre_AO());

        verify(appelOffreRepo, times(1)).delete(appelOffre);
    }

    // ❌ Test de la suppression d'un appel d'offre introuvable
    @Test
    void testSupprimerAO_NotFound() {
        when(appelOffreRepo.findByNum_Ordre_AO("A1254")).thenReturn(null);

        assertThrows(EntityNotFoundException.class, () -> appelOffreServiceImpl.supprimerAO(appelOffreDTO.getNum_Ordre_AO()));
        verify(appelOffreRepo, times(0)).delete(any(AppelOffre.class));
    }

    // ✅ Test de la récupération d'un appel d'offre par ID
    @Test
    void testGetAppelOffreById() {
        when(appelOffreRepo.findById(1)).thenReturn(Optional.of(appelOffre));

        AppelOffreDTO result = appelOffreServiceImpl.getAppelOffreById(1);

        assertNotNull(result);
        assertEquals(1, result.getId_AO());
        verify(appelOffreRepo, times(1)).findById(1);
    }

    // ❌ Test de la récupération d'un appel d'offre introuvable par ID
    @Test
    void testGetAppelOffreById_NotFound() {
        when(appelOffreRepo.findById(1)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> appelOffreServiceImpl.getAppelOffreById(1));
        verify(appelOffreRepo, times(1)).findById(1);
    }

    // ✅ Test de la récupération d'un appel d'offre par numéro d'ordre
    @Test
    void testGetAppelOffreByNumOrdre() {
        when(appelOffreRepo.findByNum_Ordre_AO("A1254")).thenReturn(appelOffre);

        AppelOffreDTO result = appelOffreServiceImpl.getAppelOffreByNumOrdre("A1254");

        assertNotNull(result);
        assertEquals("A1254", result.getNum_Ordre_AO());
        verify(appelOffreRepo, times(1)).findByNum_Ordre_AO("A1254");
    }

    // ❌ Test de la récupération d'un appel d'offre introuvable par numéro d'ordre
    @Test
    void testGetAppelOffreByNumOrdre_NotFound() {
        when(appelOffreRepo.findByNum_Ordre_AO("A1254")).thenReturn(null);

        assertThrows(EntityNotFoundException.class, () -> appelOffreServiceImpl.getAppelOffreByNumOrdre("A1254"));
        verify(appelOffreRepo, times(1)).findByNum_Ordre_AO("A1254");
    }

    // ✅ Test de la récupération de tous les appels d'offres
    @Test
    void testListerAppelOffre() {
        List<AppelOffre> appels = Arrays.asList(appelOffre, new AppelOffre(2, "A1254", "Privé", LocalDate.now(),LocalTime.now(), 15000.0, 600.0, null, null));
        when(appelOffreRepo.findAll()).thenReturn(appels);

        List<AppelOffreDTO> result = appelOffreServiceImpl.listerAppelOffre();

        assertNotNull(result);
        assertEquals(2, result.size());
        verify(appelOffreRepo, times(1)).findAll();
    }
}
