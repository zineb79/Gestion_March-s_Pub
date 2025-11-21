package ensaa.ministere.gestionmarchepublic.services;

import ensaa.ministere.gestionmarchepublic.DTO.AppelOffreDTO;
import ensaa.ministere.gestionmarchepublic.enums.StatutAO;
import ensaa.ministere.gestionmarchepublic.models.AppelOffre;

import java.util.List;

public interface AppelOffreService {
    public AppelOffreDTO ajouterAO(AppelOffreDTO appelOffre);
    public AppelOffreDTO modifierAO(int id,AppelOffreDTO appelOffre);
    public void supprimerAO(String appelOffre);
    public List<AppelOffreDTO> listerAppelOffre();
    public AppelOffreDTO getAppelOffreById(int id);
    public AppelOffreDTO getAppelOffreByNumOrdre(String numOrdre);
    List<AppelOffreDTO> getAppelOffreByMarche(int idMarche);

}
