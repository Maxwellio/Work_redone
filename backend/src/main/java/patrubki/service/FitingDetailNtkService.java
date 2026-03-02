package patrubki.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import patrubki.dto.FitingDetailNtkDto;
import patrubki.entity.FitingDetailNtk;
import patrubki.entity.FitingDetailNtkId;
import patrubki.repository.FitingDetailNtkRepository;
import patrubki.repository.FitingDetailRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FitingDetailNtkService {

    private final FitingDetailNtkRepository repository;
    private final FitingDetailRepository fitingDetailRepository;

    public FitingDetailNtkService(FitingDetailNtkRepository repository,
                                 FitingDetailRepository fitingDetailRepository) {
        this.repository = repository;
        this.fitingDetailRepository = fitingDetailRepository;
    }

    @Transactional(readOnly = true)
    public List<FitingDetailNtkDto> findByIdFitingDetail(Integer idFitingDetail) {
        return repository.findByIdFitingDetailOrderByIdNtkAsc(idFitingDetail).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addNtk(Integer idFitingDetail, Integer idNtk) {
        if (!fitingDetailRepository.existsById(idFitingDetail)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "FitingDetail not found");
        }
        if (repository.existsByIdFitingDetailAndIdNtk(idFitingDetail, idNtk)) {
            return;
        }
        FitingDetailNtk link = new FitingDetailNtk();
        link.setIdFitingDetail(idFitingDetail);
        link.setIdNtk(idNtk);
        repository.save(link);
    }

    @Transactional
    public void removeNtk(Integer idFitingDetail, Integer idNtk) {
        repository.deleteByIdFitingDetailAndIdNtk(idFitingDetail, idNtk);
    }

    private FitingDetailNtkDto toDto(FitingDetailNtk e) {
        return new FitingDetailNtkDto(e.getIdFitingDetail(), e.getIdNtk());
    }
}
