package patrubki.service;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import patrubki.dto.AdminOrgChoiceDto;
import patrubki.dto.AdminRoleOptionDto;
import patrubki.repository.OrgStruRepository;
import patrubki.repository.RoleSprRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminReferenceService {

    private static final List<Integer> ORG_CHOICE_IDS = List.of(30, 99);

    private final RoleSprRepository roleSprRepository;
    private final OrgStruRepository orgStruRepository;

    public AdminReferenceService(RoleSprRepository roleSprRepository, OrgStruRepository orgStruRepository) {
        this.roleSprRepository = roleSprRepository;
        this.orgStruRepository = orgStruRepository;
    }

    @Transactional(readOnly = true)
    public List<AdminRoleOptionDto> listRoles() {
        return roleSprRepository.findAll(Sort.by("id")).stream()
                .map(r -> new AdminRoleOptionDto(r.getId(), r.getNm()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AdminOrgChoiceDto> listOrganizationChoices() {
        return orgStruRepository.findByIdInOrderByIdAsc(ORG_CHOICE_IDS).stream()
                .map(o -> new AdminOrgChoiceDto(o.getId(), o.getNm(), o.getFullnm()))
                .collect(Collectors.toList());
    }
}
