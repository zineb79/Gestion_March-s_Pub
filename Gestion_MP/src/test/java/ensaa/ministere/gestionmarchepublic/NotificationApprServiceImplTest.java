package ensaa.ministere.gestionmarchepublic;

import ensaa.ministere.gestionmarchepublic.DTO.NotificationApprDTO;
import ensaa.ministere.gestionmarchepublic.DTO.SocieteDTO;
import ensaa.ministere.gestionmarchepublic.models.Marche;
import ensaa.ministere.gestionmarchepublic.models.NotificationAppr;
import ensaa.ministere.gestionmarchepublic.models.Societe;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.repositories.NotificationApprRepo;
import ensaa.ministere.gestionmarchepublic.repositories.SocieteRepo;
import ensaa.ministere.gestionmarchepublic.servicesImplementation.NotificationApprServiceImpl;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class NotificationApprServiceImplTest {

    @Mock
    private NotificationApprRepo notificationApprRepo;

    @Mock
    private MarcheRepo marcheRepo;
    @Mock
    private SocieteRepo societeRepo;

    @InjectMocks
    private NotificationApprServiceImpl service;

    private NotificationAppr notif;
    private NotificationApprDTO notifDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        Marche marche = new Marche();
        marche.setId_Marche(1); // ajoute cette ligne
        notif = new NotificationAppr();
        notif.setId_NOTIF(1);
        notif.setNumOrdre_NOTIF("123");
        notif.setDateVisa_NOTIF(LocalDate.now());
        notif.setDateApprobation_NOTIF(LocalDate.now());
        notif.setMarche_NOTIF(marche);

        notifDTO = new NotificationApprDTO();
        notifDTO.setId_NOTIF(1);
        notifDTO.setNumOrdre_NOTIF("123");
        notifDTO.setDateVisa_NOTIF(notif.getDateVisa_NOTIF());
        notifDTO.setDateApprobation_NOTIF(notif.getDateApprobation_NOTIF());
        notifDTO.setMarche_NOTIF(marche.getId_Marche());
    }

    @Test
    void testCreerNotificationAppr() {
        // Configurez le mock pour retourner une instance valide de Marche quand l'id 1 est passé
        Marche marche = new Marche();
        marche.setId_Marche(1);
        when(marcheRepo.findById_Marche(1)).thenReturn(marche);

        when(notificationApprRepo.save(any(NotificationAppr.class))).thenReturn(notif);

        NotificationApprDTO result = service.creerNotificationAppr(notifDTO);

        assertEquals("123", result.getNumOrdre_NOTIF());
        verify(notificationApprRepo, times(1)).save(any(NotificationAppr.class));
    }


    @Test
    void testModifierNotificationAppr() {

        when(notificationApprRepo.findById(1)).thenReturn(Optional.of(notif));
        when(marcheRepo.findById_Marche(1)).thenReturn(new Marche()); // <- nécessaire pour setMarche_NOTIF
        when(notificationApprRepo.save(any(NotificationAppr.class))).thenReturn(notif);

        NotificationApprDTO result = service.modifierNotificationAppr(1, notifDTO);

        assertEquals("123", result.getNumOrdre_NOTIF());
        verify(notificationApprRepo, times(1)).findById(1);
        verify(notificationApprRepo, times(1)).save(notif);
    }


    @Test
    void testSupprimerNotificationAppr() {
        when(notificationApprRepo.findById(1)).thenReturn(Optional.of(notif));
        doNothing().when(notificationApprRepo).delete(notif);

        service.supprimerNotificationAppr(1);

        verify(notificationApprRepo, times(1)).delete(notif);
    }

    @Test
    void testGetAllNotificationAppr() {
        when(notificationApprRepo.findAll()).thenReturn(Collections.singletonList(notif));

        List<NotificationApprDTO> result = service.getAllNotificationAppr();

        assertEquals(1, result.size());
        assertEquals("123", result.getFirst().getNumOrdre_NOTIF());
    }

    @Test
    void testGetNotificationApprById() {
        when(notificationApprRepo.findById(1)).thenReturn(Optional.of(notif));

        NotificationApprDTO result = service.getNotificationApprById(1);

        assertEquals("123", result.getNumOrdre_NOTIF());
    }

    @Test
    void testGetNotificationApprByMarche() {
        Marche marche = new Marche();
        marche.setNotificationAppr(notif);

        when(marcheRepo.findById_Marche(1)).thenReturn(marche);

        NotificationApprDTO result = service.getNotificationApprByMarche(1);

        assertEquals("123", result.getNumOrdre_NOTIF());
    }

    @Test
    void testCreerNotificationAppr_Null() {
        assertThrows(NoSuchElementException.class, () -> service.creerNotificationAppr(null));
    }

    @Test
    void testSupprimerNotificationAppr_NotFound() {
        when(notificationApprRepo.findById(99)).thenReturn(Optional.empty());

        assertThrows(EntityNotFoundException.class, () -> service.supprimerNotificationAppr(99));
    }

    @Test
    void testGetNumOrdreMarche() {
        Marche marche = new Marche();
        marche.setId_Marche(1);
        marche.setNumOrdre("MO-456");

        when(marcheRepo.findById_Marche(1)).thenReturn(marche);

        String result = service.getNumOrdreMarche(1);

        assertEquals("MO-456", result);
        verify(marcheRepo).findById_Marche(1);
    }

    @Test
    void testGetSocieteByIdMarche() {
        // Création d'une société fictive
        Societe societe = new Societe(
                1,
                "Societe Test",
                "123 Rue Exemple",
                "Agadir",
                "0600000000",
                "contact@societe.com",
                "IF456"
        );

        // Création d’un marché associé à la société
        Marche marche = new Marche();
        marche.setId_Marche(1);
        marche.setSociete(societe);

        // Définir les comportements des mocks
        when(marcheRepo.findById_Marche(1)).thenReturn(marche);
        when(societeRepo.findById(1)).thenReturn(Optional.of(societe));

        // Appel du service
        SocieteDTO result = service.getSocieteByIdMarche(1);

        // Assertions
        assertEquals("Societe Test", result.getRaisonSociale());
        assertEquals("Agadir", result.getVille());
        assertEquals("0600000000", result.getTelephone());
        assertEquals("contact@societe.com", result.getEmail());
        assertEquals("IF456", result.getIdFiscale());

        // Vérifications
        verify(marcheRepo).findById_Marche(1);
        verify(societeRepo).findById(1);
    }

}

