
package ensaa.ministere.gestionmarchepublic.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "c2VjdXJlS2V5MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NQ==";

    private Key getSignInKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public boolean validateToken(String token, String userEmail) {
        String tokenEmail = extractEmail(token);
        boolean isExpired = isTokenExpired(token);
        return (tokenEmail.equals(userEmail) && !isExpired);
    }

    // ✅ Access Token - 15 minutes
    public String generateAccessToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 heure
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Refresh Token - 7 jours
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + (1000L * 60 * 60 * 24 )/2)) // 12 heures
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // ✅ Méthode combinée
    public Map<String, String> generateTokens(String email) {
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", generateAccessToken(email));
        tokens.put("refreshToken", generateRefreshToken(email));
        return tokens;
    }
}




//package ensaa.ministere.gestionmarchepublic.security;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Component;
//
//import java.nio.charset.StandardCharsets;
//import java.security.Key; // ✅ CHANGEMENT : utiliser java.security.Key
//import java.util.Date;
//import java.util.function.Function;
//
//@Component
//public class JwtUtil {
//
//    // ⚠️ La clé doit être au moins 32 caractères pour HS256
//    private final String SECRET_KEY = "c2VjdXJlS2V5MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NQ==";
//
//    // ✅ CHANGEMENT : clé sécurisée à partir du secret string
//    private Key getSignInKey() {
//        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
//    }
//
//    public String extractEmail(String token) {
//        return extractClaim(token, Claims::getSubject);
//    }
//
//    public Date extractExpiration(String token) {
//        return extractClaim(token, Claims::getExpiration);
//    }
//
//    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
//        final Claims claims = extractAllClaims(token);
//        return claimsResolver.apply(claims);
//    }
//
//    private Claims extractAllClaims(String token) {
//        System.out.println("Parsing Token: " + token);
//        // ✅ CHANGEMENT : utiliser parserBuilder()
//        return Jwts.parserBuilder()
//                .setSigningKey(getSignInKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
//
//    public boolean isTokenExpired(String token) {
//        return extractExpiration(token).before(new Date());
//    }
//
//    public String generateToken(String email) {
//        String token = Jwts.builder()
//                .setSubject(email)
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1h
//                // ✅ CHANGEMENT : utiliser signWith(Key, SignatureAlgorithm)
//                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
//                .compact();
//        System.out.println("Generated Token: " + token);
//        return token;
//    }
//
//    public boolean validateToken(String token, String userEmail) {
//        String tokenEmail = extractEmail(token);
//        boolean isExpired = isTokenExpired(token);
//        System.out.println("Validating token for: " + userEmail + " extracted email: " + tokenEmail);
//        return (tokenEmail.equals(userEmail) && !isExpired);
//    }
//}
