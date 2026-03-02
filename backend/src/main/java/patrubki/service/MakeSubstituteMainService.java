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
import patrubki.repository.MakeSubstituteMainRepository;
import patrubki.repository.PreformTypRepository;

import java.math.BigDecimal;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MakeSubstituteMainService {

    private static final Logger log = LoggerFactory.getLogger(MakeSubstituteMainService.class);

    private final MakeSubstituteMainRepository repository;
    private final PreformTypRepository preformTypRepository;
    private final JdbcTemplate jdbcTemplate;

    public MakeSubstituteMainService(MakeSubstituteMainRepository repository,
                                     PreformTypRepository preformTypRepository,
                                     JdbcTemplate jdbcTemplate) {
        this.repository = repository;
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

    public List<MakeSubstituteMainDto> findAllOrderByName(String search) {
        String searchParam = (search != null && search.trim().isEmpty()) ? null : search;
        return repository.findAllOrderByName(searchParam).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<MakeSubstituteMainDto> findAllOrderByName(String search, Integer userId) {
        String searchParam = (search != null && search.trim().isEmpty()) ? null : search;
        return repository.findAllOrderByName(searchParam, userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void deleteById(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        repository.deleteById(id);
    }

    private String buildName(MakeSubstituteMain e) {
        String s1 = e.getNmSub1() != null ? e.getNmSub1() : "";
        String s2 = e.getNmSub2() != null ? e.getNmSub2() : "";
        String s3 = e.getNmSub3() != null ? e.getNmSub3() : "";
        String s4 = e.getNmSub4() != null ? e.getNmSub4() : "";
        String s5 = e.getNmSub5() != null ? e.getNmSub5() : "";
        return s1 + " - " + s2 + " - " + s3 + " x " + s4 + " - " + s5;
    }

    private MakeSubstituteMainDto toDto(MakeSubstituteMain e) {
        MakeSubstituteMainDto dto = new MakeSubstituteMainDto();
        dto.setIdSubstitutePrepared(e.getIdSubstitutePrepared());
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
