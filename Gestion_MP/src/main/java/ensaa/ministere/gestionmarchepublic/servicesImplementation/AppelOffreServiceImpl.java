
package ensaa.ministere.gestionmarchepublic.servicesImplementation;

import ensaa.ministere.gestionmarchepublic.DTO.AppelOffreDTO;
import ensaa.ministere.gestionmarchepublic.models.AppelOffre;
import ensaa.ministere.gestionmarchepublic.models.Marche;
import ensaa.ministere.gestionmarchepublic.repositories.AppelOffreRepo;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.services.AppelOffreService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppelOffreServiceImpl implements AppelOffreService {

    private static final Logger logger = LoggerFactory.getLogger(AppelOffreServiceImpl.class);

    @Autowired
    private AppelOffreRepo appelOffreRepo;
    @Autowired
    private MarcheRepo marcheRepo;
    @Autowired
    private  ChangementEtatsService changementEtatsService;

    @Override
    public AppelOffreDTO ajouterAO(AppelOffreDTO ao) {
        Optional<Marche> marche1 = marcheRepo.findById(ao.getIdMarche());

        if (marche1.isEmpty()) {
            logger.error("Aucun marché trouvé avec l'ID : {}", ao.getIdMarche());
            throw new EntityNotFoundException("Aucun marché trouvé avec l'ID : " + ao.getIdMarche());
        }
        Marche marche = marche1.get();

        AppelOffre appelOffre1 = new AppelOffre(ao.getNum_Ordre_AO(), ao.getType_AO(), ao.getDateOuverturePli_AO(),ao.getHeureOuverturePli_AO(), ao.getCoutEstime_AO(), ao.getCautionProvisoire_AO(), ao.getStatut_AO(), marche);
        appelOffreRepo.save(appelOffre1);
        marche.setAppel_offres(List.of(appelOffre1));
        logger.info("Appel d'offre ajouté avec succès : {}", ao.getNum_Ordre_AO());
        return ao;
    }

    @Override
    public AppelOffreDTO modifierAO(int id, AppelOffreDTO ao) {
        Optional<AppelOffre> aoToUpdate = appelOffreRepo.findById(id);
        AppelOffre appelOffre;
        if (aoToUpdate.isPresent()) {

            appelOffre = aoToUpdate.get();
            appelOffre.setStatut_AO(ao.getStatut_AO());
            appelOffre.setDateOuverturePli_AO(ao.getDateOuverturePli_AO());
            appelOffre.setHeureOuverturePli_AO(ao.getHeureOuverturePli_AO());
            appelOffre.setCoutEstime_AO(ao.getCoutEstime_AO());
            appelOffre.setCautionProvisoire_AO(ao.getCautionProvisoire_AO());
            appelOffre.setType_AO(ao.getType_AO());
            appelOffre.setMarche_AO(marcheRepo.findById(ao.getIdMarche()).orElseThrow(EntityNotFoundException::new));
            appelOffre.setNum_Ordre_AO(ao.getNum_Ordre_AO());

            appelOffreRepo.save(appelOffre);
            logger.info("Appel d'offre modifié avec succès : ID {}", id);
        } else {
            logger.error("Appel d'offre avec ID {} introuvable pour modification", id);
            throw new NoSuchElementException("Appel d'Offre avec l'ID " + id + " introuvable.");
        }
        changementEtatsService.modifierEtatMarcheParAO(appelOffre.getMarche_AO().getId_Marche(),appelOffre.getStatut_AO());
        return convertToDTO(appelOffre);
    }

    @Override
    public void supprimerAO(String numOrdre) {
        AppelOffre appelOffre1 = appelOffreRepo.findByNum_Ordre_AO(numOrdre);
        if (appelOffre1 != null) {
            appelOffreRepo.delete(appelOffre1);
            logger.info("Appel d'offre supprimé : {}", numOrdre);
        } else {
            logger.warn("Suppression échouée, appel d'offre introuvable : {}", numOrdre);
            throw new EntityNotFoundException("appel d'offre introuvable");
        }
    }

    @Override
    public List<AppelOffreDTO> listerAppelOffre() {
        List<AppelOffre> listeAppels = appelOffreRepo.findAll();
        logger.info("Liste des appels d'offre récupérée : {} éléments", listeAppels.size());
        return listeAppels.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public AppelOffreDTO getAppelOffreById(int id) {
        Optional<AppelOffre> appelOffre = appelOffreRepo.findById(id);
        if (appelOffre.isPresent()) {
            logger.info("Appel d'offre récupéré par ID : {}", id);
            return convertToDTO(appelOffre.get());
        } else {
            logger.error("Appel d'offre avec ID {} introuvable", id);
            throw new EntityNotFoundException("appel d'offre avec id : " + id + " est introuvable");
        }
    }

    @Override
    public AppelOffreDTO getAppelOffreByNumOrdre(String numOrdre) {
        AppelOffre appelOffre = Optional.ofNullable(appelOffreRepo.findByNum_Ordre_AO(numOrdre))
                .orElseThrow(() -> {
                    logger.error("Appel d'offre avec le numéro {} introuvable", numOrdre);
                    return new EntityNotFoundException("Appel d'offre avec le numéro " + numOrdre + " introuvable");
                });
        logger.info("Appel d'offre récupéré par numéro : {}", numOrdre);
        return convertToDTO(appelOffre);
    }



    @Override
    public List<AppelOffreDTO> getAppelOffreByMarche(int idMarche) {
        List<AppelOffreDTO> lists2 = new ArrayList<>();
        try {
            List<AppelOffre> lists = appelOffreRepo.findAppelOffresByMarche_AO(idMarche);
            if (lists != null) {
                for (AppelOffre appelOffre : lists) {
                    lists2.add(convertToDTO(appelOffre));
                }
            }
            logger.info("Appels d'offre récupérés pour le marché ID {} : {} éléments", idMarche, lists2.size());
        } catch (NullPointerException e) {
            logger.error("Erreur lors de la récupération des AO pour le marché {} : {}", idMarche, e.getMessage());
        }
        return lists2;
    }

    private AppelOffreDTO convertToDTO(AppelOffre ao) {
        return new AppelOffreDTO(
                ao.getId_AO(),
                ao.getNum_Ordre_AO(),
                ao.getType_AO(),
                ao.getDateOuverturePli_AO(),
                ao.getHeureOuverturePli_AO(),
                ao.getCoutEstime_AO(),
                ao.getCautionProvisoire_AO(),
                ao.getStatut_AO(),
                ao.getMarche_AO() != null ? ao.getMarche_AO().getId_Marche() : 0
        );
    }
}
