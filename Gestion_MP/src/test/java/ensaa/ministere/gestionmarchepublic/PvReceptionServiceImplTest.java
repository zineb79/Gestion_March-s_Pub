package ensaa.ministere.gestionmarchepublic;

import ensaa.ministere.gestionmarchepublic.DTO.PvReceptionDTO;
import ensaa.ministere.gestionmarchepublic.enums.TypePvReception;
import ensaa.ministere.gestionmarchepublic.models.Marche;
import ensaa.ministere.gestionmarchepublic.models.PvReception;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.repositories.PvReceptionRepo;
import ensaa.ministere.gestionmarchepublic.servicesImplementation.PvReceptionServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PvReceptionServiceImplTest {

    @Mock
    private PvReceptionRepo pvReceptionRepo;

    @Mock
    private MarcheRepo marcheRepo;

    @InjectMocks
    private PvReceptionServiceImpl service;

    private Marche marche;
    private PvReception pvReception;
    private PvReceptionDTO dto;

    @BeforeEach
    void init() {
        marche = new Marche();
        marche.setId_Marche(1);
        marche.setPvReceptions(new ArrayList<>()); // 👈 ajout obligatoire
        pvReception = new PvReception();
        pvReception.setId_PVR(100);
        pvReception.setType_PVR(TypePvReception.PROVISOIRE);
        pvReception.setDate(LocalDate.now());
        pvReception.setMarche_PVR(marche);

        dto = new PvReceptionDTO(0, TypePvReception.PROVISOIRE, LocalDate.now(), 1);
    }

    @Test
    void ajouterPvReception_success() {
        when(marcheRepo.findById(1)).thenReturn(Optional.of(marche));
        when(pvReceptionRepo.save(any(PvReception.class))).thenAnswer(inv -> {
            PvReception pv = inv.getArgument(0);
            pv.setId_PVR(100);
            return pv;
        });

        PvReceptionDTO result = service.ajouterPvReception(dto);

        assertEquals(100, result.getId_PVR());
        verify(pvReceptionRepo).save(any(PvReception.class));
        verify(marcheRepo).save(any(Marche.class));
    }

    @Test
    void ajouterPvReception_marcheIntrouvable() {
        when(marcheRepo.findById(1)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.ajouterPvReception(dto));
        verify(pvReceptionRepo, never()).save(any());
    }

    @Test
    void modifierPvReception_success() {
        when(pvReceptionRepo.findById(100)).thenReturn(Optional.of(pvReception));
        when(marcheRepo.findById(1)).thenReturn(Optional.of(marche));

        PvReceptionDTO modifDto = new PvReceptionDTO(100, TypePvReception.DEFINITIVE, LocalDate.now().plusDays(1), 1);
        PvReceptionDTO result = service.modifierPvReception(100, modifDto);

        assertEquals(TypePvReception.DEFINITIVE, result.getType_PVR());
        assertEquals(1, result.getIdMarche_PVR());
    }

    @Test
    void modifierPvReception_pvNotFound() {
        when(pvReceptionRepo.findById(100)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.modifierPvReception(100, dto));
    }

    @Test
    void modifierPvReception_marcheNotFound() {
        when(pvReceptionRepo.findById(100)).thenReturn(Optional.of(pvReception));
        when(marcheRepo.findById(1)).thenReturn(Optional.empty());

        dto.setIdMarche_PVR(1);
        assertThrows(EntityNotFoundException.class, () -> service.modifierPvReception(100, dto));
    }

    @Test
    void supprimerPvReception_success() {
        when(pvReceptionRepo.findById(100)).thenReturn(Optional.of(pvReception));

        PvReceptionDTO result = service.supprimerPvReception(100);

        assertEquals(100, result.getId_PVR());
        verify(pvReceptionRepo).delete(pvReception);
    }

    @Test
    void supprimerPvReception_notFound() {
        when(pvReceptionRepo.findById(100)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.supprimerPvReception(100));
    }

    @Test
    void getAllPvReception_returnsList() {
        when(pvReceptionRepo.findAll()).thenReturn(List.of(pvReception));

        List<PvReceptionDTO> result = service.getAllPvReception();

        assertEquals(1, result.size());
        assertEquals(100, result.get(0).getId_PVR());
    }

    @Test
    void getPvReceptionById_found() {
        when(pvReceptionRepo.findById(100)).thenReturn(Optional.of(pvReception));

        PvReceptionDTO result = service.getPvReceptionById(100);

        assertEquals(100, result.getId_PVR());
    }

    @Test
    void getPvReceptionById_notFound() {
        when(pvReceptionRepo.findById(100)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.getPvReceptionById(100));
    }
}
