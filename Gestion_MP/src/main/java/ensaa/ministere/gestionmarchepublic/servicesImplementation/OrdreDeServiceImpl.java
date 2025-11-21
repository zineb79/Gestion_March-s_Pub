package ensaa.ministere.gestionmarchepublic.servicesImplementation;

import ensaa.ministere.gestionmarchepublic.DTO.OrdreDeServiceDTO;
import ensaa.ministere.gestionmarchepublic.controllers.NotificationControllerWS;
import ensaa.ministere.gestionmarchepublic.models.Marche;
import ensaa.ministere.gestionmarchepublic.models.OrdreDeService;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.repositories.OrdreDeServiceRepo;
import ensaa.ministere.gestionmarchepublic.services.OrdreDeServiceService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrdreDeServiceImpl implements OrdreDeServiceService {

    private static final Logger logger = LoggerFactory.getLogger(OrdreDeServiceImpl.class);

    private final NotificationControllerWS notificationControllerWS;

    private final OrdreDeServiceRepo ordreDeServiceRepo;
    private final MarcheRepo marcheRepo;

    public OrdreDeServiceImpl(NotificationControllerWS notificationControllerWS, OrdreDeServiceRepo ordreDeServiceRepo, MarcheRepo marcheRepo) {
        this.notificationControllerWS = notificationControllerWS;
        this.ordreDeServiceRepo = ordreDeServiceRepo;
        this.marcheRepo = marcheRepo;
    }

    @Override
    public OrdreDeServiceDTO ajouterOrdreDeService(OrdreDeServiceDTO dto) {
        if (dto == null) {
            logger.error("Échec de l'ajout : Ordre de service null");
            throw new IllegalArgumentException("Ordre de service est null");
        }
        System.out.println("dto : " + dto);
        // Utiliser Optional pour une gestion propre
        Optional<Marche> optionalMarche = marcheRepo.findById(dto.getIdMarche());
        Marche m = optionalMarche.orElseThrow(() -> {
            logger.error("Le marché avec ID {} est introuvable", dto.getIdMarche());
            return new ResponseStatusException(HttpStatus.NOT_FOUND, "Marché introuvable");
        });

        OrdreDeService os = OrdreDeService.builder()
                .type_OS(dto.getType_OS())
                .numOrdre_OS(dto.getNumOrdre_OS())
                .date_OS(dto.getDate_OS())
                .marche_OS(m)
                .build();

        ordreDeServiceRepo.save(os);
        m.getOrdreDeServices().add(os);  // Ajouter l'OS à la liste
        m.checkOrdreService();
        marcheRepo.save(m);
        logger.info("Ordre de service ajouté avec succès : ID = {}", os.getId_OS());
        notificationControllerWS.sendMarcheStatusUpdateNotification(m.getId_Marche(),m.getObjet_marche(),m.getStatut(),1);
        return convertOsToDTO(os);
    }

    @Override
    public void supprimerOrdreDeService(int id) {
        if (!ordreDeServiceRepo.existsById(id)) {
            logger.warn("Suppression échouée : ordre de service inexistant ID = {}", id);
            throw new NoSuchElementException("L'Ordre de service dont l'ID = " + id + " n'existe pas");
        }
        ordreDeServiceRepo.deleteById(id);
        logger.info("Ordre de service supprimé avec succès : ID = {}", id);
    }

    @Override
    public OrdreDeServiceDTO modifierOrdreDeService(int id, OrdreDeServiceDTO dto) {
        OrdreDeService os = ordreDeServiceRepo.findById(id)
                .orElseThrow(() -> {
                    logger.error("Modification échouée : ordre de service introuvable ID = {}", id);
                    return new NoSuchElementException("L'ordre de service avec l'ID = " + id + " n'existe pas");
                });

        os.setType_OS(dto.getType_OS());
        os.setNumOrdre_OS(dto.getNumOrdre_OS());
        os.setDate_OS(dto.getDate_OS());
        os.setMarche_OS(marcheRepo.findById_Marche(dto.getIdMarche()));

        ordreDeServiceRepo.save(os);
        dto.setId_OS(os.getId_OS());
        logger.info("Ordre de service modifié avec succès : ID = {}", id);
        return dto;
    }

    @Override
    public OrdreDeServiceDTO getOrdreDeServiceById(int id) {
        OrdreDeService os = ordreDeServiceRepo.findById(id)
                .orElseThrow(() -> {
                    logger.error("Ordre de service introuvable : ID = {}", id);
                    return new NoSuchElementException("L'ordre de service avec l'ID = " + id + " n'existe pas");
                });
        logger.info("Ordre de service récupéré : ID = {}", id);
        return convertOsToDTO(os);
    }

    @Override
    public List<OrdreDeServiceDTO> getAllOrdreDeServices() {
        List<OrdreDeService> liste = ordreDeServiceRepo.findAll();
        logger.info("Liste des ordres de service récupérée : {} éléments", liste.size());
        return liste.stream()
                .map(this::convertOsToDTO)
                .collect(Collectors.toList());
    }

    private OrdreDeServiceDTO convertOsToDTO(OrdreDeService os) {
        return new OrdreDeServiceDTO(
                os.getId_OS(),
                os.getNumOrdre_OS(),
                os.getType_OS(),
                os.getDate_OS(),
                os.getMarche_OS() != null ? os.getMarche_OS().getId_Marche(): 0
        );
    }
}
