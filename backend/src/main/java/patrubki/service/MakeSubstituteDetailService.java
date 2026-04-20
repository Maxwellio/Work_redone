package patrubki.service;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import patrubki.dto.MakeSubstituteDetailDto;
import patrubki.dto.MakeSubstituteDetailSaveDto;
import patrubki.dto.SubstituteDetailLargeFormCalcRequestDto;
import patrubki.dto.SubstituteDetailLargeFormCalcResponseDto;
import patrubki.entity.MakeSubstituteDetail;
import patrubki.entity.MakeSubstituteMain;
import patrubki.entity.OperationStructureSpr;
import patrubki.repository.MakeSubstituteDetailRepository;
import patrubki.repository.OperationStructureSprRepository;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MakeSubstituteDetailService {

    private final MakeSubstituteDetailRepository repository;
    private final OperationStructureSprRepository operationStructureSprRepository;
    private final MakeSubstituteMainService makeSubstituteMainService;
    private final JdbcTemplate jdbcTemplate;

    public MakeSubstituteDetailService(MakeSubstituteDetailRepository repository,
                                       OperationStructureSprRepository operationStructureSprRepository,
                                       MakeSubstituteMainService makeSubstituteMainService,
                                       JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.operationStructureSprRepository = operationStructureSprRepository;
        this.makeSubstituteMainService = makeSubstituteMainService;
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
                "call substitute.add_edit_substitute_detail(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
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
            cs.setObject(15, dto.getIrazm(), Types.NUMERIC);
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

    @Transactional(readOnly = true)
    public BigDecimal calcSubTvp(Integer idOperations, BigDecimal massPreform, BigDecimal lPreform) {
        return jdbcTemplate.queryForObject(
                "select substitute.calculate_sub_tvp(?,?,?,?,?,?,?,?,?,?,?)",
                BigDecimal.class,
                idOperations,
                null,
                null,
                null,
                null,
                null,
                null,
                massPreform,
                lPreform,
                null,
                null
        );
    }

    /**
     * Расчет полей большой формы перехода переводника: tVp, vRez, tMach, затем tSum (по tk из справочника операций).
     */
    @Transactional(readOnly = true)
    public SubstituteDetailLargeFormCalcResponseDto calcLargeFormSubstitute(SubstituteDetailLargeFormCalcRequestDto body) {
        Integer idOps = body.getIdOperations();
        Integer idSubstitutePrepared = body.getIdSubstitutePrepared();
        BigDecimal ph = idSubstitutePrepared != null
                ? makeSubstituteMainService.getPhByIdSubstitutePrepared(idSubstitutePrepared)
                : body.getPh();
        BigDecimal tVp = jdbcTemplate.queryForObject(
                "select substitute.calculate_sub_tvp(?,?,?,?,?,?,?,?,?,?,?)",
                BigDecimal.class,
                idOps,
                body.getI(),
                body.getS(),
                body.getD(),
                body.getN(),
                body.getL(),
                body.getValueMeas(),
                null,
                null,
                ph,
                body.getIrazm()
        );
        BigDecimal vRez = jdbcTemplate.queryForObject(
                "select substitute.calculate_vrez(?,?)",
                BigDecimal.class,
                body.getD(),
                body.getN()
        );
        BigDecimal tMach = jdbcTemplate.queryForObject(
                "select substitute.calculate_tmach(?,?,?,?,?)",
                BigDecimal.class,
                idOps,
                body.getL(),
                body.getS(),
                body.getI(),
                body.getN()
        );
        BigDecimal tk = operationStructureSprRepository.findById(idOps)
                .map(OperationStructureSpr::getTk)
                .orElse(null);
        BigDecimal tSum = jdbcTemplate.queryForObject(
                "select substitute.calculate_tsum(?,?,?)",
                BigDecimal.class,
                tMach,
                tVp,
                tk
        );
        SubstituteDetailLargeFormCalcResponseDto out = new SubstituteDetailLargeFormCalcResponseDto();
        out.setTvp(tVp);
        out.setVRez(vRez);
        out.setTMach(tMach);
        out.setTSum(tSum);
        return out;
    }

    /**
     * Tобщ для списка переходов: как в calcLargeFormSubstitute (calculate_tsum + tk из справочника операций).
     */
    private BigDecimal computeTSum(Integer idOperations, BigDecimal tVp, BigDecimal tMach) {
        if (idOperations == null || tVp == null || tMach == null) {
            return null;
        }
        BigDecimal tk = operationStructureSprRepository.findById(idOperations)
                .map(OperationStructureSpr::getTk)
                .orElse(null);
        return jdbcTemplate.queryForObject(
                "select substitute.calculate_tsum(?,?,?)",
                BigDecimal.class,
                tMach,
                tVp,
                tk
        );
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
        dto.setIrazm(e.getIrazm());
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
        Integer idOps = op != null ? op.getIdOperations() : null;
        dto.setTSum(computeTSum(idOps, e.getTVp(), e.getTMach()));
        return dto;
    }
}
