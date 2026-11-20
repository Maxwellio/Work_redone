package patrubki.reports.repository;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class SubReportRepository {
    private final JdbcTemplate jdbcTemplate;

    public SubReportRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getDataById2(Integer id) {
        String sql = "SELECT \n" +
                "MD.ID_MAKE_SUBSTITUTE,\n" +
                "MD.ID_SUBSTITUTE_PREPARED,\n" +
                "MD.SEQ_NUM_OPER,\n" +
                "(SELECT (COALESCE(MS.NM_SUB1, '') || '-' || COALESCE(MS.NM_SUB2, '') || '-' || COALESCE(MS.NM_SUB3, '') || '/' || COALESCE(MS.NM_SUB4, '') || '-' || COALESCE(MS.NM_SUB5, ''))::varchar(100) FROM substitute.make_substitute_main MS where ms.id_substitute_prepared = md.id_substitute_prepared) as NM_SUBSTITUTE,\n" +
                "COALESCE(MD.L_CUR, 0) as L_CUR,\n" +
                "COALESCE(MD.MAS_CUR, 0) as MAS_CUR,\n" +
                "MD.ID_OPERATIONS,\n" +
                "(SELECT NM_OPERATIONS FROM substitute.OPERATION_STRUCTURE_SPR WHERE ID_OPERATIONS=MD.ID_OPERATIONS )::varchar(100) AS NM_OPERATIONS,\n" +
                "MD.T_VP,\n" +
                "(SELECT TK FROM substitute.OPERATION_STRUCTURE_SPR WHERE ID_OPERATIONS=MD.ID_OPERATIONS ) AS TK,\n" +
                "MD.V_REZ,\n" +
                "MD.IRAZM,\n" +
                "COALESCE(md.t_mach,0)+COALESCE(md.t_vp,0)+COALESCE((SELECT TK FROM substitute.OPERATION_STRUCTURE_SPR WHERE ID_OPERATIONS=md.ID_OPERATIONS ),0) as total\n" +
                "FROM substitute.MAKE_SUBSTITUTE_DETAIL MD\n" +
                "WHERE  MD.ID_SUBSTITUTE_PREPARED = ?\n" +
                "and ((MD.ID_OPERATIONS between 1 and 12) or (MD.ID_OPERATIONS between 40 and 55))\n" +
                "order by MD.SEQ_NUM_OPER";
        return jdbcTemplate.queryForList(sql, id);
    }

    public List<Map<String, Object>> getDataById1(Integer id) {
        String sql = "SELECT \n" +
                "MD.ID_MAKE_SUBSTITUTE,\n" +
                "MD.ID_SUBSTITUTE_PREPARED,\n" +
                "MD.SEQ_NUM_OPER,\n" +
                "MD.D,\n" +
                "MD.L,\n" +
                "L_CUR,\n" +
                "MAS_CUR,\n" +
                "MD.VALUE_MEAS,\n" +
                "MD.ID_OPERATIONS,\n" +
                "(SELECT NM_OPERATIONS FROM substitute.OPERATION_STRUCTURE_SPR WHERE ID_OPERATIONS=MD.ID_OPERATIONS )::varchar(100) AS NM_OPERATIONS,\n" +
                "(SELECT T_SUM FROM substitute.MAKE_SUBSTITUTE_MAIN WHERE ID_SUBSTITUTE_PREPARED=MD.ID_SUBSTITUTE_PREPARED ) AS T_SUM,\n" +
                "(SELECT MASS_PREFORM FROM substitute.MAKE_SUBSTITUTE_MAIN WHERE ID_SUBSTITUTE_PREPARED=MD.ID_SUBSTITUTE_PREPARED ) AS MASS_PREFORM,\n" +
                "MD.I,\n" +
                "MD.DEPTH_CUT,\n" +
                "MD.N,\n" +
                "MD.S,\n" +
                "MD.T_MACH,\n" +
                "MD.T_VP,\n" +
                "(SELECT TK FROM substitute.OPERATION_STRUCTURE_SPR WHERE ID_OPERATIONS=MD.ID_OPERATIONS ) AS TK,\n" +
                "MD.V_REZ,\n" +
                "CASE WHEN (md.l_cur <> 0 or md.l_cur is not null) THEN " +
                "COALESCE(md.t_mach,0) + COALESCE(md.t_vp,0) + COALESCE((SELECT TK FROM substitute.OPERATION_STRUCTURE_SPR WHERE ID_OPERATIONS=md.ID_OPERATIONS), 0) " +
                "ELSE null END as total_small, " +

                // Вторая колонка: заполнена только если l_cur == 0
                "CASE WHEN (md.l_cur = 0 or md.l_cur is null) THEN " +
                "COALESCE(md.t_mach,0) + COALESCE(md.t_vp,0) + COALESCE((SELECT TK FROM substitute.OPERATION_STRUCTURE_SPR WHERE ID_OPERATIONS=md.ID_OPERATIONS), 0) " +
                "ELSE null END as total " +
                "FROM substitute.MAKE_SUBSTITUTE_DETAIL MD\n" +
                "WHERE  MD.ID_SUBSTITUTE_PREPARED = ?\n" +
                "order by MD.SEQ_NUM_OPER";
        return jdbcTemplate.queryForList(sql, id);
    }
    public String getNameById(Integer id) {
        try {
            return jdbcTemplate.queryForObject("SELECT \n" +
                    "concat('Переводник: ',(COALESCE(MS.NM_SUB1, '') || '-' || COALESCE(MS.NM_SUB2, '') || '-' || COALESCE(MS.NM_SUB3, '') || '/' || COALESCE(MS.NM_SUB4, '') || '-' || COALESCE(MS.NM_SUB5, ''))::varchar(100)) as NM_SUBSTITUTE\n" +
                    "FROM substitute.MAKE_SUBSTITUTE_MAIN MS\n" +
                    "WHERE  MS.ID_SUBSTITUTE_PREPARED = ?\n", String.class, id);
        } catch (EmptyResultDataAccessException e){
            return null;
        }
    }
}
