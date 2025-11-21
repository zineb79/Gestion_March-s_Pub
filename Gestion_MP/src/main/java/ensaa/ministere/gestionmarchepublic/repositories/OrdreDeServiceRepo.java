package ensaa.ministere.gestionmarchepublic.repositories;

import ensaa.ministere.gestionmarchepublic.enums.Type_OS;
import ensaa.ministere.gestionmarchepublic.models.OrdreDeService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrdreDeServiceRepo extends JpaRepository<OrdreDeService, Integer> {

    @Query("select count(o) > 0 from OrdreDeService o where o.type_OS = ?1")
    boolean existsOrdreDeServiceByType_OS(Type_OS type);



}
