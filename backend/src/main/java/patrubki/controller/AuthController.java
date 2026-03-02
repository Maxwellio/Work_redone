package patrubki.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import patrubki.dto.CurrentUserDto;
import patrubki.repository.UserRepository;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Возвращает текущего пользователя по сессии или 401.
     */
    @GetMapping("/current-user")
    public ResponseEntity<CurrentUserDto> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).build();
        }
        String username = auth.getName();
        var roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        
        Integer userId = userRepository.findByUsername(username)
                .map(user -> user.getUsersId())
                .orElse(null);
        
        return ResponseEntity.ok(new CurrentUserDto(username, roles, userId));
    }
}
