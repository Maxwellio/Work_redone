package patrubki.service;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import patrubki.dto.FitingDetailDto;
import patrubki.dto.FitingDetailLargeFormCalcRequestDto;
import patrubki.dto.FitingDetailSaveDto;
import patrubki.dto.SubstituteDetailLargeFormCalcResponseDto;
import patrubki.entity.Fiting;
import patrubki.entity.FitingDetail;
import patrubki.entity.FitingDetailNtk;
import patrubki.entity.OperationStructureSpr;
import patrubki.repository.FitingDetailNtkRepository;
import patrubki.repository.FitingDetailRepository;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class FitingDetailService {

    private final FitingDetailRepository repository;
    private final FitingDetailNtkRepository fitingDetailNtkRepository;
    private final FitingService fitingService;
    private final JdbcTemplate jdbcTemplate;

    public FitingDetailService(FitingDetailRepository repository,
                               FitingDetailNtkRepository fitingDetailNtkRepository,
                               FitingService fitingService,
                               JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.fitingDetailNtkRepository = fitingDetailNtkRepository;
        this.fitingService = fitingService;
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

    @Transactional(readOnly = true)
    public BigDecimal calcFitTvp(Integer idOperations, BigDecimal massPreform, BigDecimal lPreform) {
        return jdbcTemplate.queryForObject(
                "select substitute.calculate_fit_tvp(?,?,?,?,?,?,?,?,?,?,?)",
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
     * Расчет полей большой формы перехода труб/патрубков: tVp через calculate_fit_tvp (12 арг.),
     * vRez, tMach, затем tSum через calculate_tsum_ntk с массивом id НТК.
     */
    @Transactional(readOnly = true)
    public SubstituteDetailLargeFormCalcResponseDto calcLargeFormFitting(FitingDetailLargeFormCalcRequestDto body) {
        Integer idOps = body.getIdOperations();
        Integer idFiting = body.getIdFiting();
        BigDecimal ph = idFiting != null ? fitingService.getPhPreformByIdFiting(idFiting) : body.getPh();
        BigDecimal dStan = idFiting != null ? fitingService.getDStanByIdFiting(idFiting) : body.getDStan();
        BigDecimal tVp = jdbcTemplate.queryForObject(
                "select substitute.calculate_fit_tvp(?,?,?,?,?,?,?,?,?,?,?,?)",
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
                dStan,
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
        BigDecimal tSum = jdbcTemplate.execute((Connection conn) -> calcTsumNtk(conn, tMach, tVp, body.getIdNtk()));
        SubstituteDetailLargeFormCalcResponseDto out = new SubstituteDetailLargeFormCalcResponseDto();
        out.setTvp(tVp);
        out.setVRez(vRez);
        out.setTMach(tMach);
        out.setTSum(tSum);
        return out;
    }

    /**
     * Tобщ для списка переходов: как в calcLargeFormFitting (calculate_tsum_ntk по связям fiting_detail_ntk).
     */
    private BigDecimal computeTSum(Integer idFitingDetail, BigDecimal tVp, BigDecimal tMach) {
        if (idFitingDetail == null || tVp == null || tMach == null) {
            return null;
        }
        List<Integer> idNtkList = fitingDetailNtkRepository.findByIdFitingDetailOrderByIdNtkAsc(idFitingDetail).stream()
                .map(FitingDetailNtk::getIdNtk)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        return jdbcTemplate.execute((Connection conn) -> calcTsumNtk(conn, tMach, tVp, idNtkList));
    }

    private static BigDecimal calcTsumNtk(Connection conn, BigDecimal tMach, BigDecimal tVp, List<Integer> idNtk)
            throws SQLException {
        Integer[] idArray = toDistinctIntegerArray(idNtk);
        try (PreparedStatement ps = conn.prepareStatement("select substitute.calculate_tsum_ntk(?,?,?)")) {
            ps.setBigDecimal(1, tMach);
            ps.setBigDecimal(2, tVp);
            ps.setArray(3, conn.createArrayOf("integer", idArray));
            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return null;
                }
                return rs.getBigDecimal(1);
            }
        }
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
        dto.setTSum(computeTSum(e.getIdFitingDetail(), e.getTVp(), e.getTMach()));
        return dto;
    }
}
