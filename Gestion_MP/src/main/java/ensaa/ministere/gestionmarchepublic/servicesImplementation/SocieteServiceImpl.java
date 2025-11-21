//package ensaa.ministere.gestionmarchepublic.servicesImplementation;
//
//import ensaa.ministere.gestionmarchepublic.DTO.SocieteDTO;
//import ensaa.ministere.gestionmarchepublic.models.Societe;
//import ensaa.ministere.gestionmarchepublic.repositories.DecompteRepo;
//import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
//import ensaa.ministere.gestionmarchepublic.repositories.SocieteRepo;
//import ensaa.ministere.gestionmarchepublic.services.SocieteService;
//import jakarta.persistence.EntityNotFoundException;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.NoSuchElementException;
//import java.util.Optional;
//@Service
//public class SocieteServiceImpl implements SocieteService {
//    @Autowired
//    private SocieteRepo societeRepo;
//
//    @Override
//    public SocieteDTO ajouterSociete(SocieteDTO societe) {
//        if (societe != null) {
//            Societe s = new Societe();
//            societeSetter(s, societe);
//            societeRepo.save(s);
//            societe.setId_SO(s.getId_SO());
//            return societe;
//        }else{
//            throw new NoSuchElementException("Societe a creer est introuvable !!");
//        }
//    }
//
//    @Override
//    public SocieteDTO modifierSociete(int id, SocieteDTO societe) {
//        Optional<Societe> s = societeRepo.findById(id);
//        if (s.isPresent()) {
//            Societe so = s.get();
//            societeSetter(so, societe);
//            societeRepo.save(so);
//            return convertToDTO(so);
//        }else{
//            throw new NoSuchElementException("Societe a modifier,dont id "+id+",est introuvable !!");
//        }
//    }
//
//    @Override
//    public void supprimerSociete(int id) {
//        Optional<Societe> s = societeRepo.findById(id);
//        if (s.isEmpty()) {
//            throw new EntityNotFoundException("Societe a supprimer, avec id : "+id+", est introuvable");
//        }else
//            societeRepo.delete(s.get());
//    }
//
//    @Override
//    public SocieteDTO getSocieteByID(int id) {
//        Optional<Societe> s = societeRepo.findById(id);
//        if (s.isEmpty()) {
//            throw new EntityNotFoundException("Societe avec id : "+id+", est introuvable");
//        }else{
//            return convertToDTO(s.get());
//        }
//    }
//
//    @Override
//    public SocieteDTO getSocieteByRaisonSociale(String raisonSociale) {
//        Societe s = societeRepo.findByRaisonSociale(raisonSociale);
//        if (s==null) {
//            throw new EntityNotFoundException("Societe avec le nom : "+raisonSociale+", est introuvable");
//        }
//        return convertToDTO(s);
//    }
//
//
//    @Override
//    public List<SocieteDTO> getAllSocietes() {
//       List<Societe> societes = societeRepo.findAll();
//       List<SocieteDTO> societeDTOs = new ArrayList<>();
//       for (Societe societe : societes) {
//           societeDTOs.add(convertToDTO(societe));
//       }
//       return societeDTOs;
//    }
//
//    public void societeSetter(Societe so,SocieteDTO societe) {
//        so.setAdresse(societe.getAdresse());
//        so.setEmail(societe.getEmail());
//        so.setRaisonSociale(societe.getRaisonSociale());
//        so.setNumCNSS(societe.getNumCNSS());
//        so.setTelephone(societe.getTelephone());
//        so.setNumCompteBancaire(societe.getNumCompteBancaire());
//    }
//    private SocieteDTO convertToDTO(Societe s) {
//        return new SocieteDTO(s.getId_SO(),
//                s.getRaisonSociale(),
//                s.getAdresse(),
//                s.getTelephone(),
//                s.getEmail(),
//                s.getNumCompteBancaire(),
//                s.getNumCNSS());
//
//    }
//}
package ensaa.ministere.gestionmarchepublic.servicesImplementation;

import ensaa.ministere.gestionmarchepublic.DTO.SocieteDTO;
import ensaa.ministere.gestionmarchepublic.models.Societe;
import ensaa.ministere.gestionmarchepublic.repositories.SocieteRepo;
import ensaa.ministere.gestionmarchepublic.services.SocieteService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class SocieteServiceImpl implements SocieteService {

    private static final Logger logger = LoggerFactory.getLogger(SocieteServiceImpl.class);

    @Autowired
    private SocieteRepo societeRepo;

    @Override
    public SocieteDTO ajouterSociete(SocieteDTO societe) {
        if (societe != null) {
            Societe s = new Societe();
            societeSetter(s, societe);
            societeRepo.save(s);
            societe.setId_SO(s.getId_SO());
            logger.info("Société ajoutée avec succès : ID = {}, Raison sociale = {}", s.getId_SO(), s.getRaisonSociale());
            return societe;
        } else {
            logger.error("Échec de l'ajout : objet société null");
            throw new NoSuchElementException("Société à créer est introuvable !!");
        }
    }

    @Override
    public SocieteDTO modifierSociete(int id, SocieteDTO societe) {
        Optional<Societe> s = societeRepo.findById(id);
        if (s.isPresent()) {
            Societe so = s.get();
            societeSetter(so, societe);
            societeRepo.save(so);
            logger.info("Société modifiée avec succès : ID = {}", id);
            return convertToDTO(so);
        } else {
            logger.error("Société à modifier introuvable : ID = {}", id);
            throw new NoSuchElementException("Société à modifier, dont ID = " + id + ", est introuvable !!");
        }
    }

    @Override
    public void supprimerSociete(int id) {
        Optional<Societe> s = societeRepo.findById(id);
        if (s.isEmpty()) {
            logger.warn("Tentative de suppression échouée : société introuvable ID = {}", id);
            throw new EntityNotFoundException("Société à supprimer, avec ID : " + id + ", est introuvable");
        } else {
            societeRepo.delete(s.get());
            logger.info("Société supprimée avec succès : ID = {}", id);
        }
    }

    @Override
    public SocieteDTO getSocieteByID(int id) {
        Optional<Societe> s = societeRepo.findById(id);
        if (s.isEmpty()) {
            logger.error("Société introuvable : ID = {}", id);
            throw new EntityNotFoundException("Société avec ID : " + id + ", est introuvable");
        } else {
            logger.info("Société récupérée par ID : {}", id);
            return convertToDTO(s.get());
        }
    }

    @Override
    public SocieteDTO getSocieteByRaisonSociale(String raisonSociale) {
        Societe s = societeRepo.findByRaisonSociale(raisonSociale);
        if (s == null) {
            logger.error("Société introuvable : Raison sociale = {}", raisonSociale);
            throw new EntityNotFoundException("Société avec le nom : " + raisonSociale + ", est introuvable");
        }
        logger.info("Société récupérée par raison sociale : {}", raisonSociale);
        return convertToDTO(s);
    }

    @Override
    public List<SocieteDTO> getAllSocietes() {
        List<Societe> societes = societeRepo.findAll();
        List<SocieteDTO> societeDTOs = new ArrayList<>();
        for (Societe societe : societes) {
            societeDTOs.add(convertToDTO(societe));
        }
        logger.info("Liste des sociétés récupérée : {} éléments", societeDTOs.size());
        return societeDTOs;
    }

    public void societeSetter(Societe so, SocieteDTO societe) {
        so.setAdresse(societe.getAdresse());
        so.setEmail(societe.getEmail());
        so.setRaisonSociale(societe.getRaisonSociale());
        so.setIdFiscale(societe.getIdFiscale());
        so.setTelephone(societe.getTelephone());
        so.setVille(societe.getVille());
    }

   /* @Param
    private int id_SO;
    private String raisonSociale;
    private String adresse;
    private String ville;
    private String telephone;
    private String email;
    private String idFiscale;
    */


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
