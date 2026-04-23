package patrubki.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import patrubki.dto.AdminOrgChoiceDto;
import patrubki.dto.AdminRoleOptionDto;
import patrubki.dto.AdminUserListItemDto;
import patrubki.service.AdminReferenceService;
import patrubki.service.AdminUserService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminUserController {

    private final AdminUserService adminUserService;
    private final AdminReferenceService adminReferenceService;

    public AdminUserController(AdminUserService adminUserService, AdminReferenceService adminReferenceService) {
        this.adminUserService = adminUserService;
        this.adminReferenceService = adminReferenceService;
    }

    @GetMapping("/users")
    public List<AdminUserListItemDto> listUsers() {
        return adminUserService.listAllForAdmin();
    }

    @GetMapping("/roles")
    public List<AdminRoleOptionDto> listRoles() {
        return adminReferenceService.listRoles();
    }

    @GetMapping("/organizations/choices")
    public List<AdminOrgChoiceDto> listOrganizationChoices() {
        return adminReferenceService.listOrganizationChoices();
    }
}
