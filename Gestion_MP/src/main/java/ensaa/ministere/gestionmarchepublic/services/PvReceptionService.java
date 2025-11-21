package ensaa.ministere.gestionmarchepublic.services;

import ensaa.ministere.gestionmarchepublic.DTO.PvReceptionDTO;

import java.util.List;

public interface PvReceptionService {
    PvReceptionDTO ajouterPvReception(PvReceptionDTO pvReceptionDTO);
    PvReceptionDTO modifierPvReception(int id, PvReceptionDTO pvReceptionDTO);
    PvReceptionDTO supprimerPvReception(int id);
    List<PvReceptionDTO> getAllPvReception();
    PvReceptionDTO getPvReceptionById(int id);


}
