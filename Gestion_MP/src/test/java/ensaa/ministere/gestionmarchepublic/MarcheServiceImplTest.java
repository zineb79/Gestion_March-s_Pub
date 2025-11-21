package ensaa.ministere.gestionmarchepublic;

import ensaa.ministere.gestionmarchepublic.DTO.MarcheDTO;
import ensaa.ministere.gestionmarchepublic.enums.ServiceConcerne;
import ensaa.ministere.gestionmarchepublic.enums.StatutMarche;
import ensaa.ministere.gestionmarchepublic.enums.TypeMarche;
import ensaa.ministere.gestionmarchepublic.models.Marche;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.repositories.NotificationApprRepo;
import ensaa.ministere.gestionmarchepublic.servicesImplementation.MarcheServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.Month;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@ExtendWith(MockitoExtension.class)
class MarcheServiceImplTest {

    @InjectMocks
    private MarcheServiceImpl marcheService;

    @Mock
    private MarcheRepo marcheRepo;

    @Mock
    private NotificationApprRepo notificationApprRepo;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void creerMarche_Valide() {
        MarcheDTO dto = new MarcheDTO(0, "A1234", TypeMarche.TRAVAUX, "Construction école", StatutMarche.EnCoursTraitement,4,LocalDate.now().plusYears(1),"alali rachid",ServiceConcerne.Service_AdministrationGeneral,4000.00, null, null);
        Marche saved = new Marche();
        saved.setId_Marche(1);
        when(marcheRepo.save(any(Marche.class))).thenReturn(saved);

        MarcheDTO result = marcheService.creerMarche(dto);

        assertNotNull(result);
        assertEquals(1, result.getId_Marche());
        verify(marcheRepo, times(1)).save(any(Marche.class));
    }

    @Test
    void creerMarche_Null_ThrowException() {
        assertThrows(IllegalArgumentException.class, () -> marcheService.creerMarche(null));
    }

    @Test
    void modifierMarche_MarcheExiste() {
        int id = 1;
        Marche marche = new Marche();
        marche.setId_Marche(id);

        MarcheDTO dto = new MarcheDTO(id, "ORD-001", TypeMarche.FOURNITURE, "Fourniture de tables", StatutMarche.Acheve,4, LocalDate.of(2026, Month.APRIL, 1),"Othmane lblihi", ServiceConcerne.Service_AdministrationGeneral, 40000.0, null, null);
        when(marcheRepo.findById(id)).thenReturn(Optional.of(marche));
        when(marcheRepo.save(any(Marche.class))).thenReturn(marche);

        MarcheDTO result = marcheService.modifierMarche(id, dto);

        assertNotNull(result);
        verify(marcheRepo, times(1)).save(any(Marche.class));
    }

    @Test
    void modifierMarche_Inexistant_ThrowException() {
        when(marcheRepo.findById(999)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> marcheService.modifierMarche(999, new MarcheDTO()));
    }

    @Test
    void getMarcheById_Exist() {
        Marche m = new Marche();
        m.setId_Marche(1);
        when(marcheRepo.findById(1)).thenReturn(Optional.of(m));
        MarcheDTO dto = marcheService.getMarcheById(1);
        assertNotNull(dto);
    }

    @Test
    void getMarcheById_NotExist() {
        when(marcheRepo.findById(404)).thenReturn(Optional.empty());
        assertThrows(EntityNotFoundException.class, () -> marcheService.getMarcheById(404));
    }

    @Test
    void getAllMarches_NotEmpty() {
        Marche m = new Marche();
        m.setId_Marche(1);
        m.setStatut(StatutMarche.EnCoursTraitement);
        m.setType_Marche(TypeMarche.TRAVAUX);
        m.setObjet_marche("Obj");
        m.setDelaisGarantie(4);
        m.setNumOrdre("ORD-123");

//        when(marcheRepo.findAll()).thenReturn(List.of(m));
        when(marcheRepo.findAll()).thenReturn(List.of(new Marche()));

        List<MarcheDTO> result = marcheService.getAllMarches();
        assertEquals(1, result.size());
    }

    @Test
    void getAllMarches_EmptyList_ThrowException() {
        when(marcheRepo.findAll()).thenReturn(Collections.emptyList());
        assertThrows(EntityNotFoundException.class, () -> marcheService.getAllMarches());
    }

    @Test
    void supprimerMarche_Existe() {
        Marche m = new Marche();
        when(marcheRepo.findByNumOrdre("ORD-001")).thenReturn(m);
        marcheService.supprimerMarche("ORD-001");
        verify(marcheRepo).delete(m);
    }

    @Test
    void supprimerMarche_Inexistant() {
        when(marcheRepo.findByNumOrdre("ORD-999")).thenReturn(null);
        assertThrows(EntityNotFoundException.class, () -> marcheService.supprimerMarche("ORD-999"));
    }
}
