package patrubki.security;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import patrubki.entity.UserEntity;
import patrubki.repository.UserRepository;

import java.util.Collections;
import java.util.List;

/**
 * Загрузка пользователя из БД (схема substitute), учёт active, маппинг роли nm → ROLE_USER/ROLE_ADMIN.
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private static final String ROLE_USER = "ROLE_USER";
    private static final String ROLE_ADMIN = "ROLE_ADMIN";
    private static final String NM_USER = "Пользователь";
    private static final String NM_ADMIN = "Администратор";

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity entity = userRepository.findByUsernameIgnoreCaseAndActive(username, 1)
                .orElseThrow(() -> new UsernameNotFoundException("User not found or inactive: " + username));

        String roleAuthority = roleNmToAuthority(entity.getRole() != null ? entity.getRole().getNm() : null);
        List<SimpleGrantedAuthority> authorities = roleAuthority != null
                ? Collections.singletonList(new SimpleGrantedAuthority(roleAuthority))
                : Collections.emptyList();

        return User.builder()
                .username(entity.getUsername())
                .password(entity.getPassword())
                .authorities(authorities)
                .disabled(entity.getActive() == null || entity.getActive() != 1)
                .build();
    }

    private static String roleNmToAuthority(String nm) {
        if (nm == null) return null;
        if (NM_USER.equals(nm)) return ROLE_USER;
        if (NM_ADMIN.equals(nm)) return ROLE_ADMIN;
        return "ROLE_" + nm.toUpperCase().replace(" ", "_");
    }
}
