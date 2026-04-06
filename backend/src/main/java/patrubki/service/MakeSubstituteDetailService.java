package patrubki.service;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import patrubki.dto.MakeSubstituteDetailDto;
import patrubki.dto.MakeSubstituteDetailSaveDto;
import patrubki.entity.MakeSubstituteDetail;
import patrubki.entity.MakeSubstituteMain;
import patrubki.entity.OperationStructureSpr;
import patrubki.repository.MakeSubstituteDetailRepository;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MakeSubstituteDetailService {

    private final MakeSubstituteDetailRepository repository;
    private final JdbcTemplate jdbcTemplate;

    public MakeSubstituteDetailService(MakeSubstituteDetailRepository repository,
                                       JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional(readOnly = true)
    public List<MakeSubstituteDetailDto> findByIdSubstitutePreparedOrderBySeqNumOper(Integer idSubstitutePrepared) {
        return repository.findByIdSubstitutePrepared_IdSubstitutePreparedOrderBySeqNumOperAsc(idSubstitutePrepared).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Integer save(MakeSubstituteDetailSaveDto dto) {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall(
                "call substitute.add_edit_substitute_detail(?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            cs.registerOutParameter(1, Types.INTEGER);
            cs.setObject(1, dto.getId(), Types.INTEGER);
            cs.setObject(2, dto.getIdSubstitutePrepared(), Types.INTEGER);
            cs.setObject(3, dto.getIdOperations(), Types.INTEGER);
            cs.setObject(4, dto.getD(), Types.NUMERIC);
            cs.setObject(5, dto.getL(), Types.NUMERIC);
            cs.setObject(6, dto.getValueMeas(), Types.NUMERIC);
            cs.setObject(7, dto.getI(), Types.INTEGER);
            cs.setObject(8, dto.getDepthCut(), Types.NUMERIC);
            cs.setObject(9, dto.getN(), Types.NUMERIC);
            cs.setObject(10, dto.getS(), Types.NUMERIC);
            cs.setObject(11, dto.getMasCur(), Types.NUMERIC);
            cs.setObject(12, dto.getLCur(), Types.NUMERIC);
            cs.setObject(13, dto.getSeqNumOper(), Types.INTEGER);
            cs.setObject(14, dto.getIdUserCreator(), Types.INTEGER);
            cs.execute();
            return extractId(cs.getObject(1), dto.getId());
        });
    }

    @Transactional
    public void deleteById(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        repository.deleteById(id);
    }

    private static Integer extractId(Object rawId, Integer fallbackId) {
        if (rawId instanceof Number) {
            return ((Number) rawId).intValue();
        }
        return fallbackId != null ? fallbackId : 0;
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
