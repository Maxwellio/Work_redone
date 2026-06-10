package patrubki.service;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import patrubki.dto.FitingDto;
import patrubki.dto.FitingSaveDto;
import patrubki.entity.Fiting;
import patrubki.repository.FitingDetailRepository;
import patrubki.repository.FitingRepository;
import patrubki.repository.PreformTypRepository;

import patrubki.util.YearMonthRangeUtil;

import java.math.BigDecimal;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FitingService {

    private final FitingRepository repository;
    private final FitingDetailRepository detailRepository;
    private final PreformTypRepository preformTypRepository;
    private final JdbcTemplate jdbcTemplate;

    public FitingService(FitingRepository repository,
                         FitingDetailRepository detailRepository,
                         PreformTypRepository preformTypRepository,
                         JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.detailRepository = detailRepository;
        this.preformTypRepository = preformTypRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public Integer saveFitting(FitingSaveDto dto) {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall(
                "call substitute.add_edit_fiting(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            cs.registerOutParameter(1, Types.INTEGER);
            cs.setObject(1, dto.getId(), Types.INTEGER);
            cs.setObject(2, dto.getTip(), Types.INTEGER);
            cs.setString(3, dto.getNm());
            cs.setObject(4, dto.getD(), Types.NUMERIC);
            cs.setObject(5, dto.getTh(), Types.NUMERIC);
            cs.setObject(6, dto.getL(), Types.NUMERIC);
            cs.setObject(7, dto.getMass(), Types.NUMERIC);
            cs.setObject(8, dto.getIdPreform(), Types.INTEGER);
            cs.setObject(9, dto.getLPreform(), Types.NUMERIC);
            cs.setObject(10, dto.getPhPreform(), Types.NUMERIC);
            cs.setObject(11, dto.getDStan(), Types.NUMERIC);
            cs.setString(12, dto.getCnt());
            cs.setObject(13, dto.getIdUserCreator(), Types.INTEGER);
            cs.execute();
            return extractId(cs.getObject(1), dto.getId());
        });
    }

    public void calcFitTime(Integer id) {
        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall(
                "call substitute.calc_fit_time(?)");
            cs.setObject(1, id, Types.INTEGER);
            cs.execute();
            return null;
        });
    }

    public List<FitingDto> findByTipOrderByNm(int tip, String search, String yearMonth) {
        String searchParam = (search != null && search.trim().isEmpty()) ? null : search;
        LocalDate[] range = YearMonthRangeUtil.parseRange(yearMonth);
        LocalDate createdFrom = range != null ? range[0] : null;
        LocalDate createdTo = range != null ? range[1] : null;
        List<Fiting> fits = repository.findByTipOrderByNmAsc(BigDecimal.valueOf(tip), searchParam, createdFrom, createdTo);
        Map<Integer, Long> transitionCounts = transitionCountsByFitingId(fits);
        return fits.stream()
                .map(e -> toDto(e, transitionCounts.getOrDefault(e.getIdFiting(), 0L)))
                .collect(Collectors.toList());
    }

    public List<FitingDto> findByTipOrderByNm(int tip, String search, Integer userId, String yearMonth) {
        String searchParam = (search != null && search.trim().isEmpty()) ? null : search;
        LocalDate[] range = YearMonthRangeUtil.parseRange(yearMonth);
        LocalDate createdFrom = range != null ? range[0] : null;
        LocalDate createdTo = range != null ? range[1] : null;
        List<Fiting> fits = repository.findByTipOrderByNmAsc(BigDecimal.valueOf(tip), searchParam, userId, createdFrom, createdTo);
        Map<Integer, Long> transitionCounts = transitionCountsByFitingId(fits);
        return fits.stream()
                .map(e -> toDto(e, transitionCounts.getOrDefault(e.getIdFiting(), 0L)))
                .collect(Collectors.toList());
    }

    private Map<Integer, Long> transitionCountsByFitingId(List<Fiting> fits) {
        List<Integer> ids = fits.stream().map(Fiting::getIdFiting).collect(Collectors.toList());
        if (ids.isEmpty()) {
            return Collections.emptyMap();
        }
        Map<Integer, Long> map = new HashMap<>();
        for (Object[] row : detailRepository.countGroupedByFitingId(ids)) {
            map.put((Integer) row[0], ((Number) row[1]).longValue());
        }
        return map;
    }

    public void deleteById(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        repository.deleteById(id);
    }

    /** Станочный диаметр для фитинга; null если запись не найдена. */
    public BigDecimal getDStanByIdFiting(Integer idFiting) {
        if (idFiting == null) {
            return null;
        }
        return repository.findById(idFiting).map(Fiting::getDStan).orElse(null);
    }

    /** Коэф. жесткости заготовки (ph_preform) для фитинга; null если запись не найдена. */
    public BigDecimal getPhPreformByIdFiting(Integer idFiting) {
        if (idFiting == null) {
            return null;
        }
        return repository.findById(idFiting).map(Fiting::getPhPreform).orElse(null);
    }

    private FitingDto toDto(Fiting e, long transitionCount) {
        FitingDto dto = new FitingDto();
        dto.setIdFiting(e.getIdFiting());
        dto.setTransitionCount(transitionCount);
        dto.setIdPreform(e.getIdPreform());
        dto.setNm(e.getNm());
        dto.setTip(e.getTip());
        dto.setD(e.getD());
        dto.setTh(e.getTh());
        dto.setMass(e.getMass());
        dto.setL(e.getL());
        dto.setDStan(e.getDStan());
        dto.setLPreform(e.getLPreform());
        dto.setPhPreform(e.getPhPreform());
        dto.setTSum(e.getTSum());
        dto.setCnt(e.getCnt());
        dto.setIdUserCreator(e.getIdUserCreator());
        dto.setCreatedAt(e.getCreatedAt());
        if (e.getIdPreform() != null) {
            preformTypRepository.findById(e.getIdPreform()).ifPresent(p -> dto.setNmPreform(p.getNmPreform()));
        }
        return dto;
    }

    private Integer extractId(Object rawId, Integer fallbackId) {
        if (rawId instanceof Number) {
            return ((Number) rawId).intValue();
        }
        return fallbackId != null ? fallbackId : 0;
    }
}
