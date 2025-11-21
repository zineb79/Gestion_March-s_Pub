package ensaa.ministere.gestionmarchepublic.servicesImplementation;

import ensaa.ministere.gestionmarchepublic.DTO.MarcheDTO;
import ensaa.ministere.gestionmarchepublic.enums.StatutMarche;
import ensaa.ministere.gestionmarchepublic.models.Marche;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.repositories.NotificationApprRepo;
import ensaa.ministere.gestionmarchepublic.services.MarcheService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MarcheServiceImpl implements MarcheService {

    private static final Logger logger = LoggerFactory.getLogger(MarcheServiceImpl.class);

    @Autowired
    private MarcheRepo marcheRepo;
    @Autowired
    private NotificationApprRepo notificationApprRepo;

    @Override
    public MarcheDTO creerMarche(MarcheDTO marche) {


            if (marche == null) {
                logger.error("Tentative de création d'un marché null");
                throw new IllegalArgumentException("Le marché donné est null.");
            }
            logger.info("Création d’un nouveau marché : {}", marche.getObjet_marche());

            Marche m = new Marche();
            setAllParamMarche(m, marche);

            // Sauvegarde et récupération de l'objet avec l'ID généré
            m = marcheRepo.save(m);

            logger.debug("Marché sauvegardé avec ID : {}", m.getId_Marche());

            // Retourne un nouveau DTO avec les données mises à jour
           return converteToDTO(m);
    }


    @Override
    public MarcheDTO modifierMarche(int id, MarcheDTO marche) {
        logger.info("Modification du marché avec ID : {}", id);

        Marche m1 = marcheRepo.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Marché dont ID : {} est introuvable ", id);
                    return new EntityNotFoundException("Le marché avec l'id : " + id + " n'existe pas.");
                });


        setAllParamMarche(m1, marche);

        if (marche.getIdNotification() != null && marche.getIdNotification() != 0) {
            logger.debug("Association de la notification ID : {} au marché ID : {}", marche.getIdNotification(), id);
            m1.setNotificationAppr(notificationApprRepo.findById(marche.getIdNotification()).orElse(null));
        }

        marcheRepo.save(m1);
        logger.info("Marché ID : {} modifié avec succès", id);

        return converteToDTO(m1);
    }
    public void setAllParamMarche(Marche m,MarcheDTO marche){
        m.setObjet_marche(marche.getObjet_marche());
        m.setType_Marche(marche.getType_Marche());
        m.setStatut(marche.getStatut());
        m.setNumOrdre(marche.getNumOrdre());
        m.setDelaisGarantie(marche.getDelaisGarantie());
        m.setChefServiceConcerne(marche.getChefServiceConcerne());
        m.setServiceConcerne(marche.getServiceConcerne());
        m.setDelaisMarche(marche.getDelaisMarche());
        m.setMontantFinal(marche.getMontantFinal());
    }

    @Override
    public void supprimerMarche(String numOrdre) {
        logger.info("Suppression du marché avec numéro d'ordre suivant : {}", numOrdre);

        Marche m = marcheRepo.findByNumOrdre(numOrdre);
        if (m == null) {
            logger.warn("Aucun marché trouvé avec le numéro d'ordre : {}", numOrdre);
            throw new EntityNotFoundException("Le marché avec le numéro d'ordre : " + numOrdre + " n'existe pas.");
        }

        marcheRepo.delete(m);
        logger.info("Marché avec numéro d'ordre : {} supprimé avec succès", numOrdre);
    }

    @Override
    public void supprimerMarche(int id) {
        logger.info("Suppression du marché avec numéro d'ordre : {}", id);

        Marche m = marcheRepo.findById_Marche(id);
        if (m == null) {
            logger.warn("Aucun marché trouvé avec l id : {}", id);
            throw new EntityNotFoundException("Le marché avec l'id : " + id + " n'existe pas.");
        }

        marcheRepo.delete(m);
        logger.info("Marché avec id : {} supprimé avec succès", id);
    }

    @Override
    public MarcheDTO getMarcheById(int id) {
        logger.debug("Récupération du marché par ID : {}", id);

        Marche m = marcheRepo.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Marché introuvable avec ID : {}", id);
                    return new EntityNotFoundException("Le marché avec l'id : " + id + " n'existe pas.");
                });
        //m.checkDelaisMarche();
        return converteToDTO(m);
    }

    @Override
    public MarcheDTO getMarcheByNumOrdre(String numOrdre) {
        logger.debug("Récupération du marché par numéro d'ordre : {}", numOrdre);

        Marche m = marcheRepo.findByNumOrdre(numOrdre);
        if (m == null) {
            logger.warn("Marché introuvable avec le numéro d'ordre : {}", numOrdre);
            throw new EntityNotFoundException("Le marché avec le numéro d'ordre : " + numOrdre + " n'existe pas.");
        }
        //m.checkDelaisMarche();
        return converteToDTO(m);
    }

    @Override
    public List<MarcheDTO> getAllMarches() {
        logger.debug("Récupération de tous les marchés...");

        List<Marche> allMarches = marcheRepo.findAllNonArchives();
        if (allMarches.isEmpty()) {
            logger.warn("Aucun marché trouvé dans la base de données.");
            throw new EntityNotFoundException("Aucun marché trouvé dans la base de données.");
        }

        List<MarcheDTO> allMarchesDTO = new ArrayList<>();
        for (Marche m : allMarches) {
            allMarchesDTO.add(converteToDTO(m));
            m.checkDelaisMarche();
        }

        logger.info("Total marchés récupérés : {}", allMarchesDTO.size());
        return allMarchesDTO;
    }


    @Override
    public String getNumOrdreByIdMarche(int id) {
        Optional<Marche> m = marcheRepo.findById(id);
        if (m.isPresent()) {
            return m.get().getNumOrdre();
        }else{
            throw new EntityNotFoundException("marche avec id : " + id + " n'existe pas.");
        }

    }

    private MarcheDTO converteToDTO(Marche m) {
        Integer idSociete = m.getSociete() != null ? m.getSociete().getId_SO() : null;
        Integer idNotification = m.getNotificationAppr() != null ? m.getNotificationAppr().getId_NOTIF() : null;

        return new MarcheDTO(
                m.getId_Marche(),
                m.getNumOrdre(),
                m.getType_Marche(),
                m.getObjet_marche(),
                m.getStatut(),
                m.getDelaisGarantie(),
                m.getDelaisMarche(),
                m.getChefServiceConcerne(),
                m.getServiceConcerne(),
                m.getMontantFinal(),
                idSociete,
                idNotification
        );
    }
}
