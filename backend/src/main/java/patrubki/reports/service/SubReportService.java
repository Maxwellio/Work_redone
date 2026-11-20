package patrubki.reports.service;

import patrubki.reports.repository.SubReportRepository;
import patrubki.reports.utils.Orientation;
import patrubki.reports.utils.ReportExcelCreator;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.util.List;
import java.util.Map;

@Service
public class SubReportService {
    private final SubReportRepository repository;
    private final ReportExcelCreator reportExcelCreator;

    public SubReportService(SubReportRepository repository, ReportExcelCreator reportExcelCreator) {
        this.repository = repository;
        this.reportExcelCreator = reportExcelCreator;
    }

    public void createReport(Integer id, OutputStream out) throws Exception {
        List<Map<String, Object>> rowData1 = repository.getDataById1(id);
        List<String> columns1 = List.of("seq_num_oper", "nm_operations", "mas_cur", "l_cur", "d", "l", "value_meas", "irazm", "depth_cut", "i", "s", "n", "v_rez", "t_mach", "t_vp", "tk", "total", "total_small");
        String nameData = repository.getNameById(id);
        reportExcelCreator.createExcel2(out, rowData1, null, columns1, null, nameData, "template.xlsx", null, Orientation.horizontal, Orientation.horizontal);
    }
}
