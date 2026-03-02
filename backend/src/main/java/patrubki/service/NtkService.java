package patrubki.service;

import org.springframework.stereotype.Service;
import patrubki.dto.NtkDto;
import patrubki.entity.Ntk;
import patrubki.repository.NtkRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NtkService {

    private final NtkRepository repository;

    public NtkService(NtkRepository repository) {
        this.repository = repository;
    }

    public List<NtkDto> findAllOrderByIdNtk() {
        return repository.findAllByOrderByIdNtkAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private NtkDto toDto(Ntk entity) {
        NtkDto dto = new NtkDto();
        dto.setIdNtk(entity.getIdNtk());
        dto.setNm(entity.getNm());
        dto.setD(entity.getD());
        dto.setNtk(entity.getNtk());
        dto.setPoz(entity.getPoz());
        dto.setInd(entity.getInd());
        return dto;
    }
}
