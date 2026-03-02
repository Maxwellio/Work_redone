package patrubki.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import patrubki.dto.FitingDetailDto;
import patrubki.dto.FitingDetailSaveDto;
import patrubki.entity.Fiting;
import patrubki.entity.FitingDetail;
import patrubki.entity.OperationStructureSpr;
import patrubki.repository.FitingDetailRepository;
import patrubki.repository.FitingRepository;
import patrubki.repository.OperationStructureSprRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FitingDetailService {

    private final FitingDetailRepository repository;
    private final FitingRepository fitingRepository;
    private final OperationStructureSprRepository operationStructureSprRepository;

    public FitingDetailService(FitingDetailRepository repository,
                               FitingRepository fitingRepository,
                               OperationStructureSprRepository operationStructureSprRepository) {
        this.repository = repository;
        this.fitingRepository = fitingRepository;
        this.operationStructureSprRepository = operationStructureSprRepository;
    }

    @Transactional(readOnly = true)
    public List<FitingDetailDto> findByIdFitingOrderBySeqNumOper(Integer idFiting) {
        return repository.findByIdFiting_IdFitingOrderBySeqNumOperAsc(idFiting).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Integer save(FitingDetailSaveDto dto) {
        FitingDetail entity;
        if (dto.getId() != null && repository.existsById(dto.getId())) {
            entity = repository.getReferenceById(dto.getId());
        } else {
            entity = new FitingDetail();
        }
        mapSaveDtoToEntity(dto, entity);
        entity = repository.save(entity);
        return entity.getIdFitingDetail();
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        repository.deleteById(id);
    }

    private void mapSaveDtoToEntity(FitingDetailSaveDto dto, FitingDetail entity) {
        if (dto.getIdOperations() != null) {
            entity.setIdOperations(operationStructureSprRepository.getReferenceById(dto.getIdOperations()));
        } else {
            entity.setIdOperations(null);
        }
        if (dto.getIdFiting() != null) {
            entity.setIdFiting(fitingRepository.getReferenceById(dto.getIdFiting()));
        } else {
            entity.setIdFiting(null);
        }
        entity.setSeqNumOper(dto.getSeqNumOper());
        entity.setD(dto.getD());
        entity.setL(dto.getL());
        entity.setValueMeas(dto.getValueMeas());
        entity.setI(dto.getI());
        entity.setDepthCut(dto.getDepthCut());
        entity.setN(dto.getN());
        entity.setS(dto.getS());
        entity.setTMach(dto.getTMach());
        entity.setTVp(dto.getTVp());
        entity.setVRez(dto.getVRez());
        entity.setMasCur(dto.getMasCur());
        entity.setLCur(dto.getLCur());
        entity.setIdUserCreator(dto.getIdUserCreator());
    }

    private FitingDetailDto toDto(FitingDetail e) {
        FitingDetailDto dto = new FitingDetailDto();
        dto.setIdFitingDetail(e.getIdFitingDetail());
        OperationStructureSpr op = e.getIdOperations();
        dto.setIdOperations(op != null ? op.getIdOperations() : null);
        dto.setNmOperations(op != null ? op.getNmOperations() : null);
        dto.setSeqNumOper(e.getSeqNumOper());
        dto.setD(e.getD());
        dto.setL(e.getL());
        dto.setValueMeas(e.getValueMeas());
        Fiting f = e.getIdFiting();
        dto.setIdFiting(f != null ? f.getIdFiting() : null);
        dto.setNmFiting(f != null ? f.getNm() : null);
        dto.setI(e.getI());
        dto.setDepthCut(e.getDepthCut());
        dto.setN(e.getN());
        dto.setS(e.getS());
        dto.setTMach(e.getTMach());
        dto.setTVp(e.getTVp());
        dto.setVRez(e.getVRez());
        dto.setMasCur(e.getMasCur());
        dto.setLCur(e.getLCur());
        dto.setIdUserCreator(e.getIdUserCreator());
        return dto;
    }
}
