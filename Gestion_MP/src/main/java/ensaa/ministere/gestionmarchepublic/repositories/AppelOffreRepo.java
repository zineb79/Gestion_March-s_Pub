package ensaa.ministere.gestionmarchepublic.repositories;

import ensaa.ministere.gestionmarchepublic.models.AppelOffre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface AppelOffreRepo extends JpaRepository<AppelOffre, Integer> {
   @Query("SELECT a from AppelOffre a where a.num_Ordre_AO = ?1")
    AppelOffre findByNum_Ordre_AO(String numOrdreAo);
   @Query("select a from AppelOffre a where a.marche_AO = ?1 ")
   List<AppelOffre> findAppelOffresByMarche_AO(int idMarche);

}
