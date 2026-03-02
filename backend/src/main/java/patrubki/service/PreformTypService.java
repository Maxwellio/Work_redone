package patrubki.service;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import patrubki.dto.PreformTypDto;
import patrubki.entity.PreformTyp;
import patrubki.repository.PreformTypRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PreformTypService {

    private final PreformTypRepository repository;

    public PreformTypService(PreformTypRepository repository) {
        this.repository = repository;
    }

    public List<PreformTypDto> findAllOrderByName() {
        return repository.findAll(Sort.by(Sort.Direction.ASC, "nmPreform")).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private PreformTypDto toDto(PreformTyp entity) {
        PreformTypDto dto = new PreformTypDto();
        dto.setIdPreform(entity.getIdPreform());
        dto.setNmPreform(entity.getNmPreform());
        return dto;
    }
}
