package patrubki.service;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import patrubki.dto.OperationStructureSprDto;
import patrubki.entity.OperationStructureGroup;
import patrubki.entity.OperationStructureSpr;
import patrubki.repository.OperationStructureSprRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OperationStructureSprService {

    private final OperationStructureSprRepository repository;

    public OperationStructureSprService(OperationStructureSprRepository repository) {
        this.repository = repository;
    }

    public List<OperationStructureSprDto> findAllOrderById() {
        return repository.findAll(Sort.by(Sort.Direction.ASC, "idOperations")).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<OperationStructureSprDto> findByIdGroupOperations(Integer idGroupOperations) {
        return repository.findByIdGroupOperations_IdGroupOperationsOrderByIdOperations(idGroupOperations).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private OperationStructureSprDto toDto(OperationStructureSpr entity) {
        OperationStructureSprDto dto = new OperationStructureSprDto();
        dto.setIdOperations(entity.getIdOperations());
        dto.setNmOperations(entity.getNmOperations());
        dto.setTk(entity.getTk());
        OperationStructureGroup group = entity.getIdGroupOperations();
        dto.setIdGroupOperations(group != null ? group.getIdGroupOperations() : null);
        return dto;
    }
}
