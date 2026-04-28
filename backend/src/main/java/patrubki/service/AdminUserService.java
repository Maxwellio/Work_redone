package patrubki.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import patrubki.dto.AdminUserListItemDto;
import patrubki.entity.UserEntity;
import patrubki.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    private final UserRepository userRepository;

    public AdminUserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminUserListItemDto> listAllForAdmin() {
        return userRepository.findAllForAdminList().stream()
                .map(this::toListItem)
                .collect(Collectors.toList());
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
}
