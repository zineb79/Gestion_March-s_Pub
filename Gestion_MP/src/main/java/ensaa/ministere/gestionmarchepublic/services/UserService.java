package ensaa.ministere.gestionmarchepublic.services;

import ensaa.ministere.gestionmarchepublic.DTO.UtilisateurDTO;

import java.util.List;

public interface UserService {
    public List<UtilisateurDTO> getAllUsers();
    public UtilisateurDTO getUserById(Long id);
    public UtilisateurDTO getUserByEmail(String email);
    public UtilisateurDTO getUserByUsername(String username);
    public UtilisateurDTO createUser(UtilisateurDTO user);
    public UtilisateurDTO updateUserPassword(Long id, String password);
    public void deleteUser(Long id);
    public UtilisateurDTO updateUserInfo(Long id , UtilisateurDTO user);
}
