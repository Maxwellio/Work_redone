package patrubki.reports.service;

import patrubki.reports.repository.HydroReportRepository;
import patrubki.reports.utils.Orientation;
import patrubki.reports.utils.ReportExcelCreator;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.util.List;
import java.util.Map;

@Service
public class HydroReportService {
    private final HydroReportRepository repository;
    private final ReportExcelCreator reportExcelCreator;

    public HydroReportService(HydroReportRepository repository, ReportExcelCreator reportExcelCreator) {
        this.repository = repository;
        this.reportExcelCreator = reportExcelCreator;
    }

    public void createReport(Integer id, OutputStream out) throws Exception {
        List<Map<String, Object>> data1 = repository.getData1ById(id);
        List<Map<String, Object>> data2 = repository.getData2ById(id);
        List<String> columns1 = List.of("nh", "mass", "l", "d", "lp", "l1", "l2", "nv");
        List<String> columns2 = List.of("seq_num_oper", "nop", "izm", "formula", "obosnov");
        String sum = repository.getSumById(id);
        reportExcelCreator.createExcel2(out, data1, data2, columns1, columns2, null, "template_hydro.xlsx", sum, Orientation.vertical, Orientation.horizontal);
    }
}
