package ensaa.ministere.gestionmarchepublic.services;

import ensaa.ministere.gestionmarchepublic.DTO.DecompteDTO;

import java.util.List;

public interface DecompteService {
    public DecompteDTO ajouterDecompte(DecompteDTO decompteDTO);
    public DecompteDTO modifierDecompte(int id, DecompteDTO decompteDTO);
    public void supprimerDecompte(int id);
    public List<DecompteDTO> listerDecompte();
    public DecompteDTO getDecompteById(int id);
    public DecompteDTO getDecompteByName(String nom);

}
