package ensaa.ministere.gestionmarchepublic.servicesImplementation;

import ensaa.ministere.gestionmarchepublic.DTO.PvReceptionDTO;
import ensaa.ministere.gestionmarchepublic.controllers.NotificationControllerWS;
import ensaa.ministere.gestionmarchepublic.models.Marche;
import ensaa.ministere.gestionmarchepublic.models.PvReception;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.repositories.PvReceptionRepo;
import ensaa.ministere.gestionmarchepublic.services.PvReceptionService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PvReceptionServiceImpl implements PvReceptionService {

    private static final Logger logger = LoggerFactory.getLogger(PvReceptionServiceImpl.class);


    private final NotificationControllerWS notificationControllerWS;
    private final PvReceptionRepo pvReceptionRepo;

    private final MarcheRepo marcheRepo;

    public PvReceptionServiceImpl(NotificationControllerWS notificationControllerWS, PvReceptionRepo pvReceptionRepo, MarcheRepo marcheRepo) {
        this.notificationControllerWS = notificationControllerWS;
        this.pvReceptionRepo = pvReceptionRepo;
        this.marcheRepo = marcheRepo;
    }

    private PvReceptionDTO convertToDTO(PvReception pv) {
        return new PvReceptionDTO(
                pv.getId_PVR(),
                pv.getType_PVR(),
                pv.getDate(),
                pv.getMarche_PVR() != null ? pv.getMarche_PVR().getId_Marche() : null
        );
    }

    @Override
    public PvReceptionDTO ajouterPvReception(PvReceptionDTO pvDto) {
        Marche marche = marcheRepo.findById(pvDto.getIdMarche_PVR())
                .orElseThrow(() -> {
                    logger.error("Ajout PV échoué : Marché introuvable ID = {}", pvDto.getIdMarche_PVR());
                    return new EntityNotFoundException("Marché introuvable");
                });

        PvReception pv = new PvReception();
        pv.setType_PVR(pvDto.getType_PVR());
        pv.setDate(pvDto.getDate());
        pv.setMarche_PVR(marche);

        pvReceptionRepo.save(pv);
        marche.getPvReceptions().add(pv);
        marche.checkPvReception(); // Mise à jour automatique du marché
        marcheRepo.save(marche);


        logger.info("PV de réception ajouté avec succès : ID = {}", pv.getId_PVR());
        notificationControllerWS.sendMarcheStatusUpdateNotification(marche.getId_Marche(),marche.getObjet_marche(),marche.getStatut(),1);

        return convertToDTO(pv);
    }

    @Override
    public PvReceptionDTO modifierPvReception(int id, PvReceptionDTO pvReceptionDTO) {
        PvReception pv = pvReceptionRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("PV non trouvé"));

        pv.setType_PVR(pvReceptionDTO.getType_PVR());
        pv.setDate(pvReceptionDTO.getDate());

        if (pvReceptionDTO.getIdMarche_PVR() != null) {
            Marche marche = marcheRepo.findById(pvReceptionDTO.getIdMarche_PVR())
                    .orElseThrow(() -> new EntityNotFoundException("Marché introuvable"));
            pv.setMarche_PVR(marche);
        }

        pvReceptionRepo.save(pv);
        logger.info("PV modifié avec succès : ID = {}", id);
        return convertToDTO(pv);
    }

    @Override
    public PvReceptionDTO supprimerPvReception(int id) {

        PvReception pv = pvReceptionRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("PV non trouvé"));
        Marche marche = pv.getMarche_PVR();
                pvReceptionRepo.delete(pv);
        marche.checkPvReception();
        logger.info("PV supprimé : ID = {}", id);
        return convertToDTO(pv);
    }

    @Override
    public List<PvReceptionDTO> getAllPvReception() {
        return pvReceptionRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PvReceptionDTO getPvReceptionById(int id) {
        PvReception pv = pvReceptionRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("PV non trouvé"));
        return convertToDTO(pv);
    }
}
