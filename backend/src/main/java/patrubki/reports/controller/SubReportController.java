package patrubki.reports.controller;

import patrubki.reports.service.SubReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
public class SubReportController {
    private final SubReportService subReportService;

    public SubReportController(SubReportService subReportService){
        this.subReportService = subReportService;
    }

    @GetMapping("/downloadReportSub")
    public void downloadReport(@RequestParam Integer id, HttpServletResponse response) throws  Exception {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheet.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=report_substitute.xlsx");
        subReportService.createReport(id, response.getOutputStream());
    }



}
