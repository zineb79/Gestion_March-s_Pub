package ensaa.ministere.gestionmarchepublic.repositories;

import ensaa.ministere.gestionmarchepublic.models.Societe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface SocieteRepo extends JpaRepository<Societe, Integer> {
    @Query("select s from Societe s where s.raisonSociale=?1")
    Societe findByRaisonSociale(String name);
//    @Query("select s from Societe s where s.id_SO=?1")
//    Societe findById(int id);
}
