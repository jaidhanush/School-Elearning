package school.security;



import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${app.jwt.secret}")
    private String secretKeyString;

    // Access token: 15 minutes
    private final long ACCESS_TOKEN_EXP = 1000 * 60 * 15;

    // Refresh token: 7 days
    private final long REFRESH_TOKEN_EXP = 1000L * 60 * 60 * 24 * 7;


    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKeyString.getBytes());
    }


    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }


    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = parseToken(token);
        return claimsResolver.apply(claims);
    }


    private Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }


    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }


    public boolean isTokenValid(String token, UserDetails user) {
        final String username = extractUsername(token);
        return username.equals(user.getUsername()) && !isTokenExpired(token);
    }

    public boolean isRefreshToken(String token) {
        Object type = parseToken(token).get("type");
        return type != null && type.equals("refresh");
    }


    public String generateAccessToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, ACCESS_TOKEN_EXP);
    }


    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return buildToken(claims, userDetails, REFRESH_TOKEN_EXP);
    }


    private String buildToken(Map<String, Object> claims,
                              UserDetails userDetails,
                              long expirationMs) {

        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }


	public Authentication  getAuthentication(String token, UserDetails userDetails) {
		 return new UsernamePasswordAuthenticationToken(
		            userDetails,
		            null,
		            userDetails.getAuthorities()
		    );
	}
}
