package patrubki.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import patrubki.dto.NtkDto;
import patrubki.dto.NtkTransitionRowDto;
import patrubki.entity.Ntk;
import patrubki.repository.NtkRepository;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NtkService {

    private static final String FOR_TRANSITION_SQL =
            "SELECT id_ntk, (nm || ': ' || ntk::varchar) AS nm, d, ntk, poz, ind "
                    + "FROM substitute.ntk WHERE d = ("
                    + "SELECT MIN(d) FROM substitute.ntk WHERE d >= ?"
                    + ")";

    private final NtkRepository repository;
    private final JdbcTemplate jdbcTemplate;

    public NtkService(NtkRepository repository, JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<NtkDto> findAllOrderByIdNtk() {
        return repository.findAllByOrderByIdNtkAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<NtkTransitionRowDto> findForTransitionPanel(BigDecimal pDStan) {
        if (pDStan == null) {
            return Collections.emptyList();
        }
        return jdbcTemplate.query(FOR_TRANSITION_SQL, (rs, rowNum) -> {
            NtkTransitionRowDto dto = new NtkTransitionRowDto();
            dto.setIdNtk((Integer) rs.getObject("id_ntk"));
            dto.setNm(rs.getString("nm"));
            dto.setD(rs.getBigDecimal("d"));
            dto.setNtk(rs.getBigDecimal("ntk"));
            dto.setPoz(rs.getBigDecimal("poz"));
            dto.setInd(rs.getString("ind"));
            return dto;
        }, pDStan);
    }

    private NtkDto toDto(Ntk entity) {
        NtkDto dto = new NtkDto();
        dto.setIdNtk(entity.getIdNtk());
        dto.setNm(entity.getNm());
        dto.setD(entity.getD());
        dto.setNtk(entity.getNtk());
        dto.setPoz(entity.getPoz());
        dto.setInd(entity.getInd());
        return dto;
    }
}
