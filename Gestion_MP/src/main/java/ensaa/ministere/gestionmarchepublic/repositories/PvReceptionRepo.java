package ensaa.ministere.gestionmarchepublic.repositories;

import ensaa.ministere.gestionmarchepublic.models.PvReception;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PvReceptionRepo extends JpaRepository<PvReception, Integer> {
    @Query("select p from PvReception p where p.id_PVR=?1")
    PvReception findPvReceptionById(int id);
    @Query("select p from PvReception p where p.marche_PVR=?1")
    List<PvReception> findPvReceptionByMarche_PVR(int idMarche);

}
