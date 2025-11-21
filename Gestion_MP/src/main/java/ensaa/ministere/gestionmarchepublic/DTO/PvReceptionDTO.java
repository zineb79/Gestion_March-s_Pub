package ensaa.ministere.gestionmarchepublic.DTO;

import ensaa.ministere.gestionmarchepublic.enums.TypePvReception;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PvReceptionDTO {
    private int id_PVR;
    @Enumerated(EnumType.STRING)
    private TypePvReception type_PVR;
    private LocalDate date;
    private Integer idMarche_PVR;
}
