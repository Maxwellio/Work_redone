package patrubki.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import patrubki.dto.AdminUserListItemDto;
import patrubki.dto.AdminUserSaveDto;
import patrubki.entity.UserEntity;
import patrubki.repository.UserRepository;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final JdbcTemplate jdbcTemplate;
    private final PasswordEncoder passwordEncoder;

    public AdminUserService(UserRepository userRepository, JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<AdminUserListItemDto> listAllForAdmin() {
        return userRepository.findAllForAdminList().stream()
                .map(this::toListItem)
                .collect(Collectors.toList());
    }

    public Integer saveUser(AdminUserSaveDto dto) {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall(
                    "call substitute.add_edit_users(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            cs.registerOutParameter(1, Types.INTEGER);
            cs.setObject(1, dto.getUsersId(), Types.INTEGER);
            cs.setObject(2, dto.getRoleId(), Types.INTEGER);
            cs.setObject(3, dto.getOrgId(), Types.INTEGER);
            cs.setString(4, trimToNull(dto.getFio()));
            cs.setString(5, trimToNull(dto.getUserName()));
            cs.setString(6, resolvePasswordForSave(dto.getPassword()));
            cs.setString(7, trimToNull(dto.getTelefon()));
            cs.setObject(8, dto.getDtenter(), Types.DATE);
            cs.setObject(9, dto.getDtout(), Types.DATE);
            cs.setString(10, trimToNull(dto.getNote()));
            cs.setObject(11, Boolean.TRUE.equals(dto.getActive()) ? 1 : 0, Types.INTEGER);
            cs.setObject(12, dto.getIsFirstLogin(), Types.BOOLEAN);
            cs.execute();
            return extractId(cs.getObject(1), dto.getUsersId());
        });
    }

    private AdminUserListItemDto toListItem(UserEntity u) {
        return new AdminUserListItemDto(
                u.getUsersId(),
                u.getOrg() != null ? u.getOrg().getId() : null,
                u.getRole() != null ? u.getRole().getId() : null,
                u.getRole() != null ? u.getRole().getNm() : null,
                u.getNote(),
                u.getActive(),
                u.getDtenter(),
                u.getDtout(),
                u.getUserName(),
                u.getFio(),
                u.getTelefon(),
                u.getIsFirstLogin()
        );
    }

    private String resolvePasswordForSave(String rawPassword) {
        String prepared = trimToNull(rawPassword);
        if (prepared == null) {
            return null;
        }
        return passwordEncoder.encode(prepared);
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private Integer extractId(Object rawId, Integer fallbackId) {
        if (rawId instanceof Number) {
            return ((Number) rawId).intValue();
        }
        return fallbackId != null ? fallbackId : 0;
    }
}
