package ensaa.ministere.gestionmarchepublic.servicesImplementation;


import ensaa.ministere.gestionmarchepublic.controllers.NotificationControllerWS;
import ensaa.ministere.gestionmarchepublic.enums.StatutAO;

import ensaa.ministere.gestionmarchepublic.models.Marche;

import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChangementEtatsService {
    @Autowired
    NotificationControllerWS notificationControllerWS;
    @Autowired
    private MarcheRepo marcheRepository;

    @Transactional
    public void modifierEtatMarcheParAO(int idMarche, StatutAO nouveauStatut) {

        Marche marche = marcheRepository.findById(idMarche)
                .orElseThrow(() -> new RuntimeException("Marche introuvable"));
            marche.updateStatutFromAO(nouveauStatut);

            notificationControllerWS.sendMarcheStatusUpdateNotification(marche.getId_Marche(),marche.getObjet_marche(),marche.getStatut(),1);

    }

}
