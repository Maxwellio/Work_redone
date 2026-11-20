package patrubki.reports.repository;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class HydroReportRepository {
    private final JdbcTemplate jdbcTemplate;

    public HydroReportRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getData1ById(Integer id) {
        String sql = "SELECT \n" +
                "h.nh,\n" +
                "concat ('Масса патрубка, Q - ', Round(h.mass,2), ', кг') as mass,\n" +
                "concat ('Длина патрубка - ', Round(h.l,2), ', мм') as l,\n" +
                "concat ('Диаметр патрубка, D - ', Round(h.d,2), ', мм') as d,\n" +
                "concat ('Расстояние перемещения, Lп - 12 м') as lp,\n" +
                "concat ('Длина резьбы 1, Lp1 - ', Round(h.l1,2), ', мм') as l1,\n" +
                "concat ('Длина резьбы 2, Lp2 - ', Round(h.l2,2), ', мм') as l2,\n" +
                "concat ('Норма времени, чел.ч - ', h.nv) as nv\n" +
                "from substitute.hydrotest h\n" +
                "where h.id_hydrotest = ?";
        return jdbcTemplate.queryForList(sql, id);
    }

    public List<Map<String, Object>> getData2ById(Integer id) {
        String sql = "select * from substitute.get_hydrotest_op(?)";
        return jdbcTemplate.queryForList(sql, id);
    }

    public String getSumById(Integer id) {
        try {
            return jdbcTemplate.queryForObject("Select nv from substitute.hydrotest where id_hydrotest = ?", String.class, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
}
