package ensaa.ministere.gestionmarchepublic;

import ensaa.ministere.gestionmarchepublic.DTO.OrdreDeServiceDTO;
import ensaa.ministere.gestionmarchepublic.enums.Type_OS;
import ensaa.ministere.gestionmarchepublic.models.Marche;
import ensaa.ministere.gestionmarchepublic.models.OrdreDeService;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.repositories.OrdreDeServiceRepo;
import ensaa.ministere.gestionmarchepublic.servicesImplementation.OrdreDeServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrdreDeServiceImplTest {

    @InjectMocks
    private OrdreDeServiceImpl ordreDeService;

    @Mock
    private OrdreDeServiceRepo ordreDeServiceRepo;

    @Mock
    private MarcheRepo marcheRepo;

    @Test
    void testAjouterOrdreDeService() {
        OrdreDeServiceDTO dto = new OrdreDeServiceDTO(1, "C2222", Type_OS.COMMENCEMENT, LocalDate.now(), 1);
        Marche marche = new Marche();
        marche.setId_Marche(1);

        when(marcheRepo.findById_Marche(1)).thenReturn(marche);
        when(ordreDeServiceRepo.save(any())).thenAnswer(invocation -> {
            OrdreDeService os = invocation.getArgument(0);
            os.setId_OS(10);
            return os;
        });

        OrdreDeServiceDTO result = ordreDeService.ajouterOrdreDeService(dto);

        assertNotNull(result);
        assertEquals(10, result.getId_OS());
    }

    @Test
    void testAjouterOrdreDeService_NullDTO() {
        assertThrows(IllegalArgumentException.class, () -> ordreDeService.ajouterOrdreDeService(null));
    }

    @Test
    void testSupprimerOrdreDeService_Exists() {
        when(ordreDeServiceRepo.existsById(1)).thenReturn(true);

        assertDoesNotThrow(() -> ordreDeService.supprimerOrdreDeService(1));
        verify(ordreDeServiceRepo).deleteById(1);
    }

    @Test
    void testSupprimerOrdreDeService_NotFound() {
        when(ordreDeServiceRepo.existsById(99)).thenReturn(false);

        assertThrows(NoSuchElementException.class, () -> ordreDeService.supprimerOrdreDeService(99));
    }

    @Test
    void testModifierOrdreDeService() {
        int id = 1;
        OrdreDeServiceDTO dto = new OrdreDeServiceDTO(1, "D2222", Type_OS.COMMENCEMENT, LocalDate.now(), 2);
        OrdreDeService os = new OrdreDeService();
        os.setId_OS(id);

        when(ordreDeServiceRepo.findById(id)).thenReturn(Optional.of(os));
        when(marcheRepo.findById_Marche(2)).thenReturn(new Marche());
        when(ordreDeServiceRepo.save(any())).thenReturn(os);

        OrdreDeServiceDTO result = ordreDeService.modifierOrdreDeService(id, dto);

        assertEquals(id, result.getId_OS());
    }

    @Test
    void testModifierOrdreDeService_NotFound() {
        when(ordreDeServiceRepo.findById(100)).thenReturn(Optional.empty());

        OrdreDeServiceDTO dto = new OrdreDeServiceDTO(100, "OS", Type_OS.ARRET, LocalDate.now(), 1);
        assertThrows(NoSuchElementException.class, () -> ordreDeService.modifierOrdreDeService(100, dto));
    }

    @Test
    void testGetOrdreDeServiceById() {
        OrdreDeService os = new OrdreDeService();
        os.setId_OS(5);
        os.setType_OS(Type_OS.COMMENCEMENT);
        os.setNumOrdre_OS("B2222");
        os.setDate_OS(LocalDate.now());
        Marche marche = new Marche();
        marche.setId_Marche(3);
        os.setMarche_OS(marche);

        when(ordreDeServiceRepo.findById(5)).thenReturn(Optional.of(os));

        OrdreDeServiceDTO dto = ordreDeService.getOrdreDeServiceById(5);

        assertEquals(Type_OS.COMMENCEMENT, dto.getType_OS());
        assertEquals(3, dto.getIdMarche());
    }

    @Test
    void testGetOrdreDeServiceById_NotFound() {
        when(ordreDeServiceRepo.findById(100)).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> ordreDeService.getOrdreDeServiceById(100));
    }

    @Test
    void testGetAllOrdreDeServices() {
        OrdreDeService os1 = new OrdreDeService();
        os1.setId_OS(1);
        os1.setType_OS(Type_OS.ARRET);
        os1.setNumOrdre_OS("N2222");
        os1.setDate_OS(LocalDate.now());
        Marche m1 = new Marche();
        m1.setId_Marche(1);
        os1.setMarche_OS(m1);

        when(ordreDeServiceRepo.findAll()).thenReturn(List.of(os1));

        List<OrdreDeServiceDTO> list = ordreDeService.getAllOrdreDeServices();

        assertEquals(1, list.size());
        assertEquals(Type_OS.ARRET, list.getFirst().getType_OS());
    }
}
