package ensaa.ministere.gestionmarchepublic.security;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import java.util.List;



@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtFilter jwtFilter) throws Exception {
        http
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration config = new CorsConfiguration();
                    // ✅ Utilise addAllowedOriginPattern pour gérer les IPs dynamiques du réseau local
//                    config.addAllowedOriginPattern("http://localhost:3000");
//                    config.addAllowedOriginPattern("http://127.0.0.1:3000");
//                    config.addAllowedOriginPattern("http://10.16.45.*:3000"); // ou http://10.*.*.*:3000 pour tout le réseau 10.x.x.x

                    config.setAllowCredentials(true);
                    config.setAllowedOrigins(List.of("http://localhost:3000","http://127.0.0.1:3000","http://10.16.45.90:3000"));  // HTTPS si configuré
                    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    config.setAllowedHeaders(List.of("Authorization", "Content-Type"));
                    return config;
                }))
                .csrf(AbstractHttpConfigurer::disable)
                //.requiresChannel(channel -> channel.anyRequest().requiresSecure()) // enlever le commentaire de cette ligne pour utiliser HTTPS
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/**", "/app/**", "/ws/**", "/ws/info/**").authenticated()
                        .requestMatchers("/auth/login", "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**","/favicon.ico").permitAll()
                        .anyRequest().authenticated()

                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
