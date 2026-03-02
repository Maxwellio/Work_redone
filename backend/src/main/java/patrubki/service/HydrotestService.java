package patrubki.service;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import patrubki.dto.HydrotestDto;
import patrubki.dto.HydrotestSaveDto;
import patrubki.entity.Hydrotest;
import patrubki.repository.HydrotestRepository;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.Types;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class HydrotestService {

    private final HydrotestRepository repository;
    private final JdbcTemplate jdbcTemplate;

    public HydrotestService(HydrotestRepository repository, JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public Integer saveHydrotest(HydrotestSaveDto dto) {
        Integer id = jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall(
                "call substitute.add_edit_hydro(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            cs.registerOutParameter(1, Types.INTEGER);
            cs.setObject(1, dto.getId(), Types.INTEGER);
            cs.setString(2, dto.getNh());
            cs.setObject(3, dto.getD(), Types.NUMERIC);
            cs.setObject(4, dto.getTh(), Types.NUMERIC);
            cs.setObject(5, dto.getL(), Types.NUMERIC);
            cs.setObject(6, dto.getTesttime(), Types.NUMERIC);
            cs.setObject(7, dto.getMass(), Types.NUMERIC);
            cs.setObject(8, dto.getL1(), Types.NUMERIC);
            cs.setObject(9, dto.getL2(), Types.NUMERIC);
            cs.setObject(10, dto.getIdUserCreator(), Types.INTEGER);
            cs.execute();
            return extractId(cs.getObject(1), dto.getId());
        });
        if (id != null && id > 0) {
            calcHydroTime(id);
        }
        return id;
    }

    public void calcHydroTime(Integer idHydrotest) {
        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall(
                "call substitute.calc_hydro_time(?)");
            cs.setObject(1, idHydrotest, Types.INTEGER);
            cs.execute();
            return null;
        });
    }

    public List<HydrotestDto> findAllOrderByNh(String search) {
        String searchParam = (search != null && search.trim().isEmpty()) ? null : search;
        return repository.findAllOrderByNhAsc(searchParam).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<HydrotestDto> findAllOrderByNh(String search, Integer userId) {
        String searchParam = (search != null && search.trim().isEmpty()) ? null : search;
        return repository.findAllOrderByNhAsc(searchParam, userId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void deleteById(Integer id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        repository.deleteById(id);
    }

    private HydrotestDto toDto(Hydrotest e) {
        HydrotestDto dto = new HydrotestDto();
        dto.setIdHydrotest(e.getIdHydrotest());
        dto.setNh(e.getNh());
        dto.setD(e.getD());
        dto.setL(e.getL());
        dto.setTh(e.getTh());
        dto.setTesttime(e.getTesttime());
        dto.setMass(e.getMass());
        dto.setL1(e.getL1());
        dto.setL2(e.getL2());
        dto.setNv(e.getNv());
        dto.setIdUserCreator(e.getIdUserCreator());
        return dto;
    }

    private Integer extractId(Object rawId, Integer fallbackId) {
        if (rawId instanceof Number) {
            return ((Number) rawId).intValue();
        }
        return fallbackId != null ? fallbackId : 0;
    }
}
