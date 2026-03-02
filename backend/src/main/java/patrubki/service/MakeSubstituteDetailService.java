package patrubki.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import patrubki.dto.MakeSubstituteDetailDto;
import patrubki.dto.MakeSubstituteDetailSaveDto;
import patrubki.entity.MakeSubstituteDetail;
import patrubki.entity.MakeSubstituteMain;
import patrubki.entity.OperationStructureSpr;
import patrubki.repository.MakeSubstituteDetailRepository;
import patrubki.repository.MakeSubstituteMainRepository;
import patrubki.repository.OperationStructureSprRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MakeSubstituteDetailService {

    private final MakeSubstituteDetailRepository repository;
    private final MakeSubstituteMainRepository makeSubstituteMainRepository;
    private final OperationStructureSprRepository operationStructureSprRepository;

    public MakeSubstituteDetailService(MakeSubstituteDetailRepository repository,
                                       MakeSubstituteMainRepository makeSubstituteMainRepository,
                                       OperationStructureSprRepository operationStructureSprRepository) {
        this.repository = repository;
        this.makeSubstituteMainRepository = makeSubstituteMainRepository;
        this.operationStructureSprRepository = operationStructureSprRepository;
    }

    @Transactional(readOnly = true)
    public List<MakeSubstituteDetailDto> findByIdSubstitutePreparedOrderBySeqNumOper(Integer idSubstitutePrepared) {
        return repository.findByIdSubstitutePrepared_IdSubstitutePreparedOrderBySeqNumOperAsc(idSubstitutePrepared).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Integer save(MakeSubstituteDetailSaveDto dto) {
        MakeSubstituteDetail entity;
        if (dto.getId() != null && repository.existsById(dto.getId())) {
            entity = repository.getReferenceById(dto.getId());
        } else {
            entity = new MakeSubstituteDetail();
        }
        mapSaveDtoToEntity(dto, entity);
        entity = repository.save(entity);
        return entity.getIdMakeSubstitute();
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        repository.deleteById(id);
    }

    private void mapSaveDtoToEntity(MakeSubstituteDetailSaveDto dto, MakeSubstituteDetail entity) {
        if (dto.getIdOperations() != null) {
            entity.setIdOperations(operationStructureSprRepository.getReferenceById(dto.getIdOperations()));
        } else {
            entity.setIdOperations(null);
        }
        if (dto.getIdSubstitutePrepared() != null) {
            entity.setIdSubstitutePrepared(makeSubstituteMainRepository.getReferenceById(dto.getIdSubstitutePrepared()));
        } else {
            entity.setIdSubstitutePrepared(null);
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
        entity.setTVpNbdt(dto.getTVpNbdt());
        entity.setIdUserCreator(dto.getIdUserCreator());
    }

    private MakeSubstituteDetailDto toDto(MakeSubstituteDetail e) {
        MakeSubstituteDetailDto dto = new MakeSubstituteDetailDto();
        dto.setIdMakeSubstitute(e.getIdMakeSubstitute());
        OperationStructureSpr op = e.getIdOperations();
        dto.setIdOperations(op != null ? op.getIdOperations() : null);
        dto.setNmOperations(op != null ? op.getNmOperations() : null);
        dto.setSeqNumOper(e.getSeqNumOper());
        dto.setD(e.getD());
        dto.setL(e.getL());
        dto.setValueMeas(e.getValueMeas());
        MakeSubstituteMain m = e.getIdSubstitutePrepared();
        dto.setIdSubstitutePrepared(m != null ? m.getIdSubstitutePrepared() : null);
        dto.setI(e.getI());
        dto.setDepthCut(e.getDepthCut());
        dto.setN(e.getN());
        dto.setS(e.getS());
        dto.setTMach(e.getTMach());
        dto.setTVp(e.getTVp());
        dto.setVRez(e.getVRez());
        dto.setMasCur(e.getMasCur());
        dto.setLCur(e.getLCur());
        dto.setTVpNbdt(e.getTVpNbdt());
        dto.setIdUserCreator(e.getIdUserCreator());
        return dto;
    }
}
