package ensaa.ministere.gestionmarchepublic.repositories;

import ensaa.ministere.gestionmarchepublic.models.Decompte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DecompteRepo extends JpaRepository<Decompte, Integer> {
    @Query("select d from Decompte d where d.numOrdre_D=?1")
    Decompte findByName(String name);
    @Query("select d from Decompte d where d.id_D=?1")
    Decompte findById(int id);
    @Query("select d from Decompte d where d.numOrdre_D=?1")
    Decompte findByNom_D(String nom_D);
}
