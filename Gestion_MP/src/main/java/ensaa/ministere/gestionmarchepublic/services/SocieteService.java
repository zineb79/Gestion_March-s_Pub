package ensaa.ministere.gestionmarchepublic.services;

import ensaa.ministere.gestionmarchepublic.DTO.SocieteDTO;

import java.util.List;

public interface SocieteService {
    SocieteDTO ajouterSociete(SocieteDTO societe);
    SocieteDTO modifierSociete(int id,SocieteDTO societe);
    void supprimerSociete(int id);
    SocieteDTO getSocieteByID(int id);
    SocieteDTO getSocieteByRaisonSociale(String raisonSociale);
    List<SocieteDTO> getAllSocietes();

}
