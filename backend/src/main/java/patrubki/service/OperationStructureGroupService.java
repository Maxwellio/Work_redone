package patrubki.service;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import patrubki.dto.OperationStructureGroupDto;
import patrubki.entity.OperationStructureGroup;
import patrubki.repository.OperationStructureGroupRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OperationStructureGroupService {

    private final OperationStructureGroupRepository repository;

    public OperationStructureGroupService(OperationStructureGroupRepository repository) {
        this.repository = repository;
    }

    public List<OperationStructureGroupDto> findAllOrderByName() {
        return repository.findAll(Sort.by(Sort.Direction.ASC, "nmGroupOperations")).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private OperationStructureGroupDto toDto(OperationStructureGroup entity) {
        OperationStructureGroupDto dto = new OperationStructureGroupDto();
        dto.setIdGroupOperations(entity.getIdGroupOperations());
        dto.setNmGroupOperations(entity.getNmGroupOperations());
        return dto;
    }
}
