package ensaa.ministere.gestionmarchepublic.services;

import ensaa.ministere.gestionmarchepublic.DTO.OrdreDeServiceDTO;

import java.util.List;

public interface OrdreDeServiceService {

    public OrdreDeServiceDTO ajouterOrdreDeService(OrdreDeServiceDTO ordreDeServiceDTO);
    public void supprimerOrdreDeService(int id);
    public OrdreDeServiceDTO modifierOrdreDeService(int id, OrdreDeServiceDTO ordreDeServiceDTO);
    public OrdreDeServiceDTO getOrdreDeServiceById(int id);
    public List<OrdreDeServiceDTO> getAllOrdreDeServices();
}
