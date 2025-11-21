package ensaa.ministere.gestionmarchepublic.services;

import ensaa.ministere.gestionmarchepublic.DTO.MarcheDTO;
import ensaa.ministere.gestionmarchepublic.models.Marche;

import java.util.List;

public interface MarcheService {
    MarcheDTO creerMarche(MarcheDTO marche);
    MarcheDTO modifierMarche(int id,MarcheDTO marche);
    void supprimerMarche(String numOrdre);
    void supprimerMarche(int id);
    MarcheDTO getMarcheById(int id);
    MarcheDTO getMarcheByNumOrdre(String name);
    List<MarcheDTO> getAllMarches();
    String getNumOrdreByIdMarche(int id);
}
