//package ensaa.ministere.gestionmarchepublic.servicesImplementation;
//
//import ensaa.ministere.gestionmarchepublic.DTO.DecompteDTO;
//import ensaa.ministere.gestionmarchepublic.models.Decompte;
//import ensaa.ministere.gestionmarchepublic.repositories.DecompteRepo;
//import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
//import ensaa.ministere.gestionmarchepublic.repositories.SocieteRepo;
//import ensaa.ministere.gestionmarchepublic.services.DecompteService;
//import jakarta.persistence.EntityNotFoundException;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.NoSuchElementException;
//
//@Service
//public class DecompteServiceImpl implements DecompteService {
//    @Autowired
//    private DecompteRepo repoD;
//    @Autowired
//    private MarcheRepo repoM;
//    @Autowired
//    private SocieteRepo repoS;
//
//    @Override
//    public DecompteDTO ajouterDecompte(DecompteDTO dto) {
//        if (dto == null) {
//            throw new IllegalStateException("Les informations fournies sont incomplètes");
//        }
//
//        Decompte decompte = mapToEntity(dto);
//        decompte = repoD.save(decompte);
//
//        return convertToDTO(decompte);
//    }
//
//    @Override
//    public DecompteDTO modifierDecompte(int id, DecompteDTO dto) {
//        Decompte decompte = repoD.findById(id);
//        if (decompte == null) {
//            throw new EntityNotFoundException("Décompte avec id : " + id + " est introuvable");
//        }
//
//        updateEntity(decompte, dto);
//        decompte = repoD.save(decompte);
//
//        return convertToDTO(decompte);
//    }
//
//    private Decompte mapToEntity(DecompteDTO dto) {
//        Decompte decompte = new Decompte();
//        updateEntity(decompte, dto);
//        return decompte;
//    }
//
//    private void updateEntity(Decompte decompte, DecompteDTO dto) {
//        decompte.setNumOrdre_D(dto.getNumOrdre_D());
//        decompte.setNom_D(dto.getNom_D());
//        decompte.setACompte(dto.getACompte());
//        decompte.setSomme_D(dto.getSomme_D());
//        decompte.setMarche_D(repoM.findById_Marche(dto.getIdMarche()));
//
//        repoS.findById(dto.getIdSociete()).ifPresentOrElse(
//                decompte::setSociete_D,
//                () -> { throw new EntityNotFoundException("Société avec id : " + dto.getIdSociete() + " est introuvable"); }
//        );
//    }
//
//
//    @Override
//    public void supprimerDecompte(int id) {
//        Decompte dec  = repoD.findById(id);
//        if (dec == null) {
//            throw new NoSuchElementException("");
//        }
//        repoD.delete(dec);
//        System.out.println("Decompte avec id :"+id+" est supprime avec succes");
//    }
//
//    @Override
//    public List<DecompteDTO> listerDecompte() {
//        return List.of();
//    }
//
//    @Override
//    public DecompteDTO getDecompteById(int id) {
//        Decompte decompte = repoD.findById(id);
//        if (decompte == null) {
//            throw new EntityNotFoundException("Décompte avec id : " + id + " est introuvable");
//        }
//        return convertToDTO(decompte);
//    }
//
//    @Override
//    public DecompteDTO getDecompteByName(String nom) {
//        Decompte decompte = repoD.findByName(nom);
//        if (decompte == null) {
//            throw new EntityNotFoundException("Décompte avec nom : " + nom + " est introuvable");
//        }
//        return convertToDTO(decompte);
//    }
//
//    public DecompteDTO convertToDTO(Decompte d) {
//        DecompteDTO dto = new DecompteDTO();
//        dto.setId_D(d.getId_D());
//        dto.setNom_D(d.getNom_D());
//        dto.setNumOrdre_D(d.getNumOrdre_D());
//        dto.setNom_D(d.getNom_D());
//        dto.setACompte(d.getACompte());
//        dto.setIdSociete(d.getSociete_D().getId_SO());
//        dto.setIdMarche(d.getMarche_D().getId_Marche());
//        return dto;
//    }
//}
package ensaa.ministere.gestionmarchepublic.servicesImplementation;

import ensaa.ministere.gestionmarchepublic.DTO.DecompteDTO;
import ensaa.ministere.gestionmarchepublic.models.Decompte;
import ensaa.ministere.gestionmarchepublic.repositories.DecompteRepo;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.repositories.SocieteRepo;
import ensaa.ministere.gestionmarchepublic.services.DecompteService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class DecompteServiceImpl implements DecompteService {

    private static final Logger logger = LoggerFactory.getLogger(DecompteServiceImpl.class);

    @Autowired
    private DecompteRepo repoD;
    @Autowired
    private MarcheRepo repoM;
    @Autowired
    private SocieteRepo repoS;

    @Override
    public DecompteDTO ajouterDecompte(DecompteDTO dto) {
        if (dto == null) {
            logger.error("Échec de l'ajout : les informations du décompte sont nulles");
            throw new IllegalStateException("Les informations fournies sont incomplètes");
        }

        Decompte decompte = mapToEntity(dto);
        decompte = repoD.save(decompte);
        logger.info("Décompte ajouté avec succès : {}", dto.getNumOrdre_D());

        return convertToDTO(decompte);
    }

    @Override
    public DecompteDTO modifierDecompte(int id, DecompteDTO dto) {
        Decompte decompte = repoD.findById(id);
        if (decompte == null) {
            logger.error("Décompte introuvable pour modification : ID {}", id);
            throw new EntityNotFoundException("Décompte avec id : " + id + " est introuvable");
        }

        updateEntity(decompte, dto);
        decompte = repoD.save(decompte);
        logger.info("Décompte modifié avec succès : ID {}", id);

        return convertToDTO(decompte);
    }

    private Decompte mapToEntity(DecompteDTO dto) {
        Decompte decompte = new Decompte();
        updateEntity(decompte, dto);
        return decompte;
    }

    private void updateEntity(Decompte decompte, DecompteDTO dto) {
        decompte.setNumOrdre_D(dto.getNumOrdre_D());
        //decompte.setNom_D(dto.getNom_D());
        decompte.setACompte(dto.getACompte());
        decompte.setSomme_D(dto.getSomme_D());
        decompte.setMarche_D(repoM.findById_Marche(dto.getIdMarche()));

        repoS.findById(dto.getIdSociete()).ifPresentOrElse(
                decompte::setSociete_D,
                () -> {
                    logger.error("Société introuvable : ID {}", dto.getIdSociete());
                    throw new EntityNotFoundException("Société avec id : " + dto.getIdSociete() + " est introuvable");
                }
        );
    }

    @Override
    public void supprimerDecompte(int id) {
        Decompte dec = repoD.findById(id);
        if (dec == null) {
            logger.warn("Suppression échouée, décompte introuvable : ID {}", id);
            throw new NoSuchElementException("Décompte avec ID " + id + " introuvable");
        }
        repoD.delete(dec);
        logger.info("Décompte supprimé avec succès : ID {}", id);
    }

    @Override
    public List<DecompteDTO> listerDecompte() {
        List<Decompte> liste = repoD.findAll();
        logger.info("Liste des décomptes récupérée : {} éléments", liste.size());
        return liste.stream().map(this::convertToDTO).toList();
    }

    @Override
    public DecompteDTO getDecompteById(int id) {
        Decompte decompte = repoD.findById(id);
        if (decompte == null) {
            logger.error("Décompte introuvable : ID {}", id);
            throw new EntityNotFoundException("Décompte avec id : " + id + " est introuvable");
        }
        logger.info("Décompte récupéré par ID : {}", id);
        return convertToDTO(decompte);
    }

    @Override
    public DecompteDTO getDecompteByName(String nom) {
        Decompte decompte = repoD.findByName(nom);
        if (decompte == null) {
            logger.error("Décompte introuvable : nom '{}'", nom);
            throw new EntityNotFoundException("Décompte avec nom : " + nom + " est introuvable");
        }
        logger.info("Décompte récupéré par nom : {}", nom);
        return convertToDTO(decompte);
    }

    public DecompteDTO convertToDTO(Decompte d) {
        DecompteDTO dto = new DecompteDTO();
        dto.setId_D(d.getId_D());
        dto.setNumOrdre_D(d.getNumOrdre_D());
        dto.setACompte(d.getACompte());
        dto.setSomme_D(d.getSomme_D());
        dto.setIdSociete(d.getSociete_D().getId_SO());
        dto.setIdMarche(d.getMarche_D().getId_Marche());
        return dto;
    }
}
