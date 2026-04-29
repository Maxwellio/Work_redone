package patrubki.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import patrubki.entity.UserEntity;
import patrubki.repository.UserRepository;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.util.regex.Pattern;

@Service
public class UserPasswordService {

    private static final Pattern UPPERCASE = Pattern.compile("[A-Z]");
    private static final Pattern LOWERCASE = Pattern.compile("[a-z]");
    private static final Pattern DIGIT = Pattern.compile("[0-9]");
    private static final Pattern SPECIAL = Pattern.compile("[^A-Za-z0-9]");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    public UserPasswordService(UserRepository userRepository, PasswordEncoder passwordEncoder, JdbcTemplate jdbcTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jdbcTemplate = jdbcTemplate;
    }

    public void changePassword(String username, String oldPasswordRaw, String newPasswordRaw) {
        String oldPassword = trimToNull(oldPasswordRaw);
        String newPassword = trimToNull(newPasswordRaw);
        if (oldPassword == null || newPassword == null) {
            throw new IllegalArgumentException("Текущий и новый пароль обязательны");
        }

        validateNewPassword(newPassword);

        UserEntity user = userRepository.findByUserName(username)
                .orElseThrow(() -> new IllegalStateException("Текущий пользователь не найден"));
        Integer userId = user.getUsersId();
        if (userId == null) {
            throw new IllegalStateException("Не удалось определить идентификатор пользователя");
        }

        String oldPasswordHash = passwordEncoder.encode(oldPassword);
        String newPasswordHash = passwordEncoder.encode(newPassword);

        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("call substitute.change_password(?, ?, ?)");
            cs.setInt(1, userId);
            cs.setString(2, oldPasswordHash);
            cs.setString(3, newPasswordHash);
            cs.execute();
            return null;
        });
    }

    private void validateNewPassword(String password) {
        if (password.length() < 14
                || !UPPERCASE.matcher(password).find()
                || !LOWERCASE.matcher(password).find()
                || !DIGIT.matcher(password).find()
                || !SPECIAL.matcher(password).find()) {
            throw new IllegalArgumentException(
                    "Пароль должен содержать минимум 14 символов, заглавную и строчную латинские буквы, цифру и спецсимвол"
            );
        }
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
