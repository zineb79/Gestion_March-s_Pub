package ensaa.ministere.gestionmarchepublic.DTO;

import ensaa.ministere.gestionmarchepublic.enums.Type_OS;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrdreDeServiceDTO {
    private int id_OS;
    private String numOrdre_OS;
    private Type_OS type_OS;
    private LocalDate date_OS;
    private int idMarche;
}
