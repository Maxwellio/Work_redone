package patrubki.reports.repository;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class FitReportRepository {
    private final JdbcTemplate jdbcTemplate;

    public FitReportRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getDataById2(Integer id) {
        String sql = "SELECT \n" +
                "f.ID_FITING_DETAIL, \n" +
                "f.ID_OPERATIONS, \n" +
                "f.SEQ_NUM_OPER, \n" +
                "f.ID_FITING, \n" +
                "f.T_VP, \n" +
                "(SELECT sum(N.NTK) FROM substitute.FITING_DETAIL_NTK FD, substitute.NTK N WHERE FD.ID_NTK=N.ID_NTK AND FD.ID_FITING_DETAIL =f.ID_FITING_DETAIL ) as Tk,\n" +
                "f.V_REZ, \n" +
                "COALESCE(f.L_CUR, 0) as L_CUR,\n" +
                "COALESCE(f.MAS_CUR, 0) as MAS_CUR,\n" +
                "(select nm_operations from substitute.operation_structure_spr where id_operations=f.id_operations) as nm_operations,\n" +
                "COALESCE(f.t_mach,0)+COALESCE(f.t_vp,0)+COALESCE((SELECT TK FROM substitute.OPERATION_STRUCTURE_SPR WHERE ID_OPERATIONS=f.ID_OPERATIONS ),0) as total\n" +
                "FROM substitute.FITING_DETAIL f\n" +
                "WHERE f.ID_FITING= ?\n" +
                "and ((f.ID_OPERATIONS between 1 and 12) or (f.ID_OPERATIONS between 40 and 55))\n" +
                "ORDER BY f.SEQ_NUM_OPER\n";
        return jdbcTemplate.queryForList(sql, id);
    }

    public List<Map<String, Object>> getDataById1(Integer id) {
        String sql = "SELECT \n" +
                "f.ID_FITING_DETAIL, \n" +
                "f.ID_OPERATIONS, \n" +
                "f.SEQ_NUM_OPER, \n" +
                "f.D, \n" +
                "f.L, \n" +
                "f.VALUE_MEAS, \n" +
                "f.ID_FITING, \n" +
                "f.I, \n" +
                "L_CUR,\n" +
                "MAS_CUR,\n" +
                "f.DEPTH_CUT, \n" +
                "f.N, f.S, \n" +
                "f.T_MACH, \n" +
                "f.T_VP, \n" +
                "(SELECT TK FROM substitute.OPERATION_STRUCTURE_SPR WHERE ID_OPERATIONS=f.ID_OPERATIONS ) AS TK,\n" +
                "f.V_REZ, \n" +
                "f.IRAZM,\n" +
                "(select nm_operations from substitute.operation_structure_spr where id_operations=f.id_operations) as nm_operations,\n" +
                // Первая колонка: заполнена только если l_cur != 0
                "CASE WHEN (f.l_cur <> 0 or f.l_cur is not null) THEN " +
                "COALESCE(f.t_mach,0) + COALESCE(f.t_vp,0) + COALESCE((SELECT TK FROM substitute.OPERATION_STRUCTURE_SPR WHERE ID_OPERATIONS=f.ID_OPERATIONS), 0) " +
                "ELSE null END as total_small, " +

                // Вторая колонка: заполнена только если l_cur == 0
                "CASE WHEN (f.l_cur = 0 or f.l_cur is null) THEN " +
                "COALESCE(f.t_mach,0) + COALESCE(f.t_vp,0) + COALESCE((SELECT sum(N.NTK) FROM substitute.FITING_DETAIL_NTK FD, substitute.NTK N WHERE FD.ID_NTK=N.ID_NTK AND FD.ID_FITING_DETAIL = f.ID_FITING_DETAIL), 0) " +
                "ELSE null END as total, " +
                "(select String_agg(ntk.poz || ntk.ind, ', '::varchar) as ntk_list\n" +
                "from substitute.fiting_detail_ntk fdn\n" +
                "join substitute.ntk ntk on fdn.id_ntk=ntk.id_ntk\n" +
                "where fdn.id_fiting_detail = f.id_fiting_detail\n) as nm_ntk\n"+
                "FROM substitute.FITING_DETAIL f\n" +
                "WHERE f.ID_FITING= ?\n" +
                "ORDER BY f.SEQ_NUM_OPER\n";
        return jdbcTemplate.queryForList(sql, id);
    }
    public String getNameById(Integer id) {
        try {
            return jdbcTemplate.queryForObject("SELECT\n" +
                    "      case\n" +
                    "          when f.tip = 1 then concat('Патрубок: ',f.nm,'-',f.d,'x',f.th)\n" +
                    "          else concat('Труба: ',f.nm)\n" +
                    "      end case\n" +
                    "FROM substitute.fiting f\n" +
                    "WHERE  f.id_fiting = ?", String.class, id);
        } catch (EmptyResultDataAccessException e){
            return null;
        }
    }
    public String getSumById(Integer id) {
        try {
            return jdbcTemplate.queryForObject("Select substitute.calculate_tsum_fit_time(?)", String.class, id);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
}
