package ensaa.ministere.gestionmarchepublic.servicesImplementation;

import ensaa.ministere.gestionmarchepublic.DTO.NotificationApprDTO;
import ensaa.ministere.gestionmarchepublic.DTO.SocieteDTO;
import ensaa.ministere.gestionmarchepublic.controllers.NotificationControllerWS;
import ensaa.ministere.gestionmarchepublic.models.Marche;
import ensaa.ministere.gestionmarchepublic.models.NotificationAppr;
import ensaa.ministere.gestionmarchepublic.models.Societe;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.repositories.NotificationApprRepo;
import ensaa.ministere.gestionmarchepublic.repositories.SocieteRepo;
import ensaa.ministere.gestionmarchepublic.services.NotificationApprService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class NotificationApprServiceImpl implements NotificationApprService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationApprServiceImpl.class);

    private final NotificationControllerWS notificationControllerWS;

    private final NotificationApprRepo notificationApprRepo;


    private final MarcheRepo marcheRepo;


    private final SocieteRepo societeRepo;

    public NotificationApprServiceImpl(NotificationControllerWS notificationControllerWS, NotificationApprRepo notificationApprRepo, MarcheRepo marcheRepo, SocieteRepo societeRepo) {
        this.notificationControllerWS = notificationControllerWS;
        this.notificationApprRepo = notificationApprRepo;
        this.marcheRepo = marcheRepo;
        this.societeRepo = societeRepo;
    }

    @Override
    public NotificationApprDTO creerNotificationAppr(NotificationApprDTO notificationAppr) {
        if (notificationAppr == null) {
            logger.error("Échec de la création : données de notification nulles.");
            throw new NoSuchElementException("Problème survenu lors du chargement de la notification.");
        }
        Marche marche = (marcheRepo.findById_Marche(notificationAppr.getMarche_NOTIF()));
        // Vérifier que le marche a bien été trouvé
        if (marche == null) {
            logger.error("Aucun marché trouvé avec l'id : {}", notificationAppr.getMarche_NOTIF());
            throw new EntityNotFoundException("Marché non trouvé.");
        }
        Societe s = societeRepo.findById(notificationAppr.getSociete_NOTIF()).orElseThrow(
                ()->new EntityNotFoundException("aucune societe trouvée avec id :"+notificationAppr.getSociete_NOTIF()));

        NotificationAppr nA = NotificationAppr.builder()
                .id_NOTIF(notificationAppr.getId_NOTIF())
                .numOrdre_NOTIF(notificationAppr.getNumOrdre_NOTIF())
                .dateVisa_NOTIF(notificationAppr.getDateVisa_NOTIF())
                .dateApprobation_NOTIF(notificationAppr.getDateApprobation_NOTIF())
                .marche_NOTIF(marche)
                .build();

        marche.setNotificationAppr(nA);


        notificationApprRepo.save(nA);
        marche.setSociete(s);
        s.getMarches().add(marche);
        marche.checkNotification();
        marcheRepo.save(marche);
        logger.info("Notification ajoutée avec succès : numéro d'ordre = {}", nA.getNumOrdre_NOTIF());
        notificationControllerWS.sendMarcheStatusUpdateNotification(marche.getId_Marche(),marche.getObjet_marche(),marche.getStatut(),1);

        return convertNotifToDTO(nA);
    }

    @Override
    public NotificationApprDTO modifierNotificationAppr(int id, NotificationApprDTO notificationAppr) {
        NotificationAppr nA = notificationApprRepo.findById(id)
                .orElseThrow(() -> {
                    logger.error("Échec modification : notification introuvable ID = {}", id);
                    return new EntityNotFoundException("Aucune Notification trouvée pour l'id : " + id);
                });

        nA.setNumOrdre_NOTIF(notificationAppr.getNumOrdre_NOTIF());
        nA.setDateVisa_NOTIF(notificationAppr.getDateVisa_NOTIF());
        nA.setDateApprobation_NOTIF(notificationAppr.getDateApprobation_NOTIF());
        nA.setMarche_NOTIF(marcheRepo.findById_Marche(notificationAppr.getMarche_NOTIF()));
        notificationApprRepo.save(nA);
        logger.info("Notification modifiée avec succès : ID = {}", id);

        return convertNotifToDTO(nA);
    }
//ne pas utiliser la fonction delete pour notification
@Transactional
@Override
public void supprimerNotificationAppr(int idNotificationAppr) {
    NotificationAppr notif = notificationApprRepo.findById(idNotificationAppr)
            .orElseThrow(() -> {
                logger.error("Suppression échouée : notification introuvable ID = {}", idNotificationAppr);
                return new EntityNotFoundException("Notification à supprimer avec id : " + idNotificationAppr + " est introuvable");
            });

    // Détacher l'objet marche pour éviter les problèmes de transient
    notif.setMarche_NOTIF(null);

    notificationApprRepo.delete(notif);
    logger.info("Notification supprimée avec succès : ID = {}", idNotificationAppr);
}


    @Override
    public List<NotificationApprDTO> getAllNotificationAppr() {
        List<NotificationAppr> notificationApprs = notificationApprRepo.findAll();
        logger.info("Liste des notifications récupérée : {} éléments", notificationApprs.size());

        return notificationApprs.stream()
                .map(this::convertNotifToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationApprDTO getNotificationApprById(int idNotificationAppr) {
        NotificationAppr nA = notificationApprRepo.findById(idNotificationAppr)
                .orElseThrow(() -> {
                    logger.error("Notification introuvable : ID = {}", idNotificationAppr);
                    return new EntityNotFoundException("Notification introuvable avec l'id : " + idNotificationAppr);
                });

        logger.info("Notification récupérée : ID = {}", idNotificationAppr);
        return convertNotifToDTO(nA);
    }

    @Override
    public NotificationApprDTO getNotificationApprByMarche(int marche) {
        Marche m = marcheRepo.findById_Marche(marche);
        if (m == null) {
            logger.error("Marché introuvable pour notification : ID = {}", marche);
            throw new EntityNotFoundException("Marché dont l'id : " + marche + " est introuvable");
        }

        logger.info("Notification liée au marché récupérée : marché ID = {}", marche);
        return convertNotifToDTO(m.getNotificationAppr());
    }

    @Override
    public SocieteDTO getSocieteByIdMarche(int idMarche) {
        Marche m = marcheRepo.findById_Marche(idMarche);
        if (m == null) {
            throw new EntityNotFoundException("Marche avec id : "+idMarche+" n'existe pas");
        }
        Societe s = societeRepo.findById(m.getSociete().getId_SO()).orElseThrow(()-> new EntityNotFoundException("Societe avec id : "+m.getSociete().getId_SO()+" n'existe pas"));
        return convertToDTO(s);
    }

    @Override
    public String getNumOrdreMarche(int idMarche) {
        Marche m = marcheRepo.findById_Marche(idMarche);
            if (m != null) {
                return m.getNumOrdre();
            }else{
                throw new EntityNotFoundException("Marche avec id : "+idMarche+" n'existe pas");
            }
    }

    private NotificationApprDTO convertNotifToDTO(NotificationAppr nA) {
        NotificationApprDTO nDTO = new NotificationApprDTO();
        nDTO.setId_NOTIF(nA.getId_NOTIF());
        nDTO.setNumOrdre_NOTIF(nA.getNumOrdre_NOTIF());
        nDTO.setDateVisa_NOTIF(nA.getDateVisa_NOTIF());
        nDTO.setDateApprobation_NOTIF(nA.getDateApprobation_NOTIF());
        nDTO.setMarche_NOTIF(nA.getMarche_NOTIF().getId_Marche());
        return nDTO;
    }
    private SocieteDTO convertToDTO(Societe s) {
        return new SocieteDTO(
                s.getId_SO(),
                s.getRaisonSociale(),
                s.getAdresse(),
                s.getVille(),
                s.getTelephone(),
                s.getEmail(),
                s.getIdFiscale()

        );
    }
}
