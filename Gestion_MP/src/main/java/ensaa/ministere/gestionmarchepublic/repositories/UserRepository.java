package ensaa.ministere.gestionmarchepublic.repositories;

import ensaa.ministere.gestionmarchepublic.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<Utilisateur, Long> {

    @Query("SELECT u FROM Utilisateur u WHERE u.email = ?1")
    Optional<Utilisateur> findByEmail(String email);

    // Si besoin de filtrer par nom :
    @Query("SELECT u FROM Utilisateur u WHERE u.nom = ?1")
    List<Utilisateur> findByNom(String nom);
}
