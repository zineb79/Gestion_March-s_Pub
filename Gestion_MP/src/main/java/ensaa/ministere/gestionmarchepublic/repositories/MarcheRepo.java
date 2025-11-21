package ensaa.ministere.gestionmarchepublic.repositories;

import ensaa.ministere.gestionmarchepublic.models.Marche;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.Optional;


public interface MarcheRepo extends JpaRepository<Marche, Integer> {
        @Query("select m from Marche m where m.id_Marche=?1")
        Marche findById_Marche(int id);
        //Optional<Marche> findById(int id);
        Marche findByNumOrdre(String numOrdre);
        @NonNull
        @Query("select m from Marche m where m.isArchived=false")
        List<Marche> findAllNonArchives();

}
