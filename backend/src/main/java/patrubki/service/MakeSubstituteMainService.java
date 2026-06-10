package patrubki.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import patrubki.dto.MakeSubstituteMainDto;
import patrubki.dto.SubstituteSaveDto;
import patrubki.entity.MakeSubstituteMain;
import patrubki.repository.MakeSubstituteDetailRepository;
import patrubki.repository.MakeSubstituteMainRepository;
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
public class MakeSubstituteMainService {

    private static final Logger log = LoggerFactory.getLogger(MakeSubstituteMainService.class);

    private final MakeSubstituteMainRepository repository;
    private final MakeSubstituteDetailRepository detailRepository;
    private final PreformTypRepository preformTypRepository;
    private final JdbcTemplate jdbcTemplate;

    public MakeSubstituteMainService(MakeSubstituteMainRepository repository,
                                     MakeSubstituteDetailRepository detailRepository,
                                     PreformTypRepository preformTypRepository,
                                     JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.detailRepository = detailRepository;
        this.preformTypRepository = preformTypRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public Integer saveSubstitute(SubstituteSaveDto dto) {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall(
                "call substitute.add_edit_substitute(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            cs.registerOutParameter(1, Types.INTEGER);
            cs.setObject(1, dto.getId(), Types.INTEGER);
            cs.setString(2, dto.getNmSub1());
            cs.setString(3, dto.getNmSub2());
            cs.setString(4, dto.getNmSub3());
            cs.setString(5, dto.getNmSub4());
            cs.setString(6, dto.getNmSub5());
            cs.setObject(7, dto.getDSubstituteOut(), Types.NUMERIC);
            cs.setObject(8, dto.getDSubstituteIn(), Types.NUMERIC);
            cs.setObject(9, dto.getLSubstitute(), Types.NUMERIC);
            cs.setObject(10, dto.getIdPreform(), Types.INTEGER);
            cs.setObject(11, dto.getDPreformOut(), Types.NUMERIC);
            cs.setObject(12, dto.getDPreformIn(), Types.NUMERIC);
            cs.setObject(13, dto.getLPreform(), Types.NUMERIC);
            cs.setObject(14, dto.getPh(), Types.NUMERIC);
            cs.setObject(15, dto.getMassPreform(), Types.NUMERIC);
            cs.setObject(16, dto.getIdUserCreator(), Types.INTEGER);
            cs.execute();
            return extractId(cs.getObject(1), dto.getId());
        });
    }

    public void calcSubTime(Integer id) {
        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall(
                "call substitute.calc_sub_time(?)");
            cs.setObject(1, id, Types.INTEGER);
            cs.execute();
            return null;
        });
    }

    public List<MakeSubstituteMainDto> findAllOrderByName(String search, String yearMonth) {
        String searchParam = (search != null && search.trim().isEmpty()) ? null : search;
        LocalDate[] range = YearMonthRangeUtil.parseRange(yearMonth);
        LocalDate createdFrom = range != null ? range[0] : null;
        LocalDate createdTo = range != null ? range[1] : null;
        List<MakeSubstituteMain> mains = repository.findAllOrderByName(searchParam, createdFrom, createdTo);
        Map<Integer, Long> transitionCounts = transitionCountsBySubstitutePreparedId(mains);
        return mains.stream()
                .map(e -> toDto(e, transitionCounts.getOrDefault(e.getIdSubstitutePrepared(), 0L)))
                .collect(Collectors.toList());
    }

    public List<MakeSubstituteMainDto> findAllOrderByName(String search, Integer userId, String yearMonth) {
        String searchParam = (search != null && search.trim().isEmpty()) ? null : search;
        LocalDate[] range = YearMonthRangeUtil.parseRange(yearMonth);
        LocalDate createdFrom = range != null ? range[0] : null;
        LocalDate createdTo = range != null ? range[1] : null;
        List<MakeSubstituteMain> mains = repository.findAllOrderByName(searchParam, userId, createdFrom, createdTo);
        Map<Integer, Long> transitionCounts = transitionCountsBySubstitutePreparedId(mains);
        return mains.stream()
                .map(e -> toDto(e, transitionCounts.getOrDefault(e.getIdSubstitutePrepared(), 0L)))
                .collect(Collectors.toList());
    }

    private Map<Integer, Long> transitionCountsBySubstitutePreparedId(List<MakeSubstituteMain> mains) {
        List<Integer> ids = mains.stream().map(MakeSubstituteMain::getIdSubstitutePrepared).collect(Collectors.toList());
        if (ids.isEmpty()) {
            return Collections.emptyMap();
        }
        Map<Integer, Long> map = new HashMap<>();
        for (Object[] row : detailRepository.countGroupedBySubstitutePreparedId(ids)) {
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

    /** Коэф. жесткости (ph) для переводника; null если запись не найдена. */
    public BigDecimal getPhByIdSubstitutePrepared(Integer idSubstitutePrepared) {
        if (idSubstitutePrepared == null) {
            return null;
        }
        return repository.findById(idSubstitutePrepared).map(MakeSubstituteMain::getPh).orElse(null);
    }

    private String buildName(MakeSubstituteMain e) {
        String s1 = e.getNmSub1() != null ? e.getNmSub1() : "";
        String s2 = e.getNmSub2() != null ? e.getNmSub2() : "";
        String s3 = e.getNmSub3() != null ? e.getNmSub3() : "";
        String s4 = e.getNmSub4() != null ? e.getNmSub4() : "";
        String s5 = e.getNmSub5() != null ? e.getNmSub5() : "";
        return s1 + " - " + s2 + " - " + s3 + " x " + s4 + " - " + s5;
    }

    private MakeSubstituteMainDto toDto(MakeSubstituteMain e, long transitionCount) {
        MakeSubstituteMainDto dto = new MakeSubstituteMainDto();
        dto.setIdSubstitutePrepared(e.getIdSubstitutePrepared());
        dto.setTransitionCount(transitionCount);
        dto.setIdPreform(e.getIdPreform());
        dto.setName(buildName(e));
        dto.setDPreformOut(e.getDPreformOut());
        dto.setDPreformIn(e.getDPreformIn());
        dto.setPh(e.getPh());
        dto.setLPreform(e.getLPreform());
        dto.setMassPreform(e.getMassPreform());
        dto.setTSum(e.getTSum());
        dto.setDSubstituteOut(e.getDSubstituteOut());
        dto.setDSubstituteIn(e.getDSubstituteIn());
        dto.setLSubstitute(e.getLSubstitute());
        dto.setNmSub1(e.getNmSub1());
        dto.setNmSub2(e.getNmSub2());
        dto.setNmSub3(e.getNmSub3());
        dto.setNmSub4(e.getNmSub4());
        dto.setNmSub5(e.getNmSub5());
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
