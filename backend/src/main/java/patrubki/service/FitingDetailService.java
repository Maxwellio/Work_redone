package patrubki.service;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import patrubki.dto.FitingDetailDto;
import patrubki.dto.FitingDetailSaveDto;
import patrubki.entity.Fiting;
import patrubki.entity.FitingDetail;
import patrubki.entity.OperationStructureSpr;
import patrubki.repository.FitingDetailRepository;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class FitingDetailService {

    private final FitingDetailRepository repository;
    private final JdbcTemplate jdbcTemplate;

    public FitingDetailService(FitingDetailRepository repository,
                               JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Transactional(readOnly = true)
    public List<FitingDetailDto> findByIdFitingOrderBySeqNumOper(Integer idFiting) {
        return repository.findByIdFiting_IdFitingOrderBySeqNumOperAsc(idFiting).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public Integer save(FitingDetailSaveDto dto) {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall(
                "call substitute.add_edit_fiting_detail(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
            cs.registerOutParameter(1, Types.INTEGER);
            cs.setObject(1, dto.getId(), Types.INTEGER);
            cs.setObject(2, dto.getIdFiting(), Types.INTEGER);
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
            Integer[] ntkIds = toDistinctIntegerArray(dto.getIdNtk());
            java.sql.Array ntkArray = conn.createArrayOf("integer", ntkIds);
            cs.setArray(14, ntkArray);
            cs.setObject(15, dto.getIdUserCreator(), Types.INTEGER);
            cs.setObject(16, dto.getIrazm(), Types.NUMERIC);
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

    private static Integer[] toDistinctIntegerArray(List<Integer> idNtk) {
        if (idNtk == null || idNtk.isEmpty()) {
            return new Integer[0];
        }
        return idNtk.stream()
                .filter(Objects::nonNull)
                .distinct()
                .toArray(Integer[]::new);
    }

    private static Integer extractId(Object rawId, Integer fallbackId) {
        if (rawId instanceof Number) {
            return ((Number) rawId).intValue();
        }
        return fallbackId != null ? fallbackId : 0;
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
        dto.setIrazm(e.getIrazm());
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
