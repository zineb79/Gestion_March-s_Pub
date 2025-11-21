package ensaa.ministere.gestionmarchepublic.configuration;

import ensaa.ministere.gestionmarchepublic.enums.*;
import ensaa.ministere.gestionmarchepublic.models.AppelOffre;
import ensaa.ministere.gestionmarchepublic.models.Marche;
import ensaa.ministere.gestionmarchepublic.models.Societe;
import ensaa.ministere.gestionmarchepublic.models.Utilisateur;
import ensaa.ministere.gestionmarchepublic.repositories.AppelOffreRepo;
import ensaa.ministere.gestionmarchepublic.repositories.MarcheRepo;
import ensaa.ministere.gestionmarchepublic.repositories.SocieteRepo;
import ensaa.ministere.gestionmarchepublic.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AppInit implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
//    @Autowired
//    private MarcheRepo marcheRepo;
//    @Autowired
//    private AppelOffreRepo appelOffreRepo;
//   @Autowired
//    private SocieteRepo societeRepo;

    @Override
    public void run(String... args) {

        Marche m1 = null;
        if (userRepository.count() == 0) {
            Utilisateur user1 = new Utilisateur("Alami","younesse","younesseAlami@gmail.com",
                    passwordEncoder.encode("1234"), String.valueOf(Role.CHEF_DE_SERVICE));
            Utilisateur user2 = new Utilisateur("lansari","khadija","khadijaLansari@gmail.com",
                    passwordEncoder.encode("5678"), String.valueOf(Role.SECRETAIRE) );

            userRepository.save(user1);
            userRepository.save(user2);

        }
//        if (marcheRepo.count() == 0) {
//             m1 = new Marche(15000.00,ServiceConcerne.Service_AdministrationGeneral,"Othmane belhlali",
//                     LocalDate.now().plusYears(1),3,
//                     StatutMarche.EnCoursTraitement,"Achat de fournitures",TypeMarche.FOURNITURE,"A22222");
//             marcheRepo.save(m1);
//        }
//        if (appelOffreRepo.count() == 0) {
//            AppelOffre Ao1= new AppelOffre("A1254","Nationale",LocalDate.of(2024, Month.FEBRUARY, 6), LocalTime.of(8,30,0),2000.22,3333.22, StatutAO.ENCOURS,m1);
//           // AppelOffre Ao2= new AppelOffre("B1254","Nationale",LocalDate.of(2025,Month.APRIL,12), LocalTime.of(8,30,0),202200.22,3003.22, StatutAO.ENCOURS,m1);
//            appelOffreRepo.save(Ao1);
//           // appelOffreRepo.save(Ao2);
//        }
//        if(societeRepo.count() == 0) {
//            Societe s = new Societe("TAHA EQUIPEMENT","TILILA","AGADIR","0255568544","TAHAEQ@gmail.com","A2144");
//            societeRepo.save(s);   }
 }
}
