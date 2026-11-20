package patrubki.reports.controller;

import patrubki.reports.service.FitReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
public class FitReportController {
    private final FitReportService fitReportService;

    public FitReportController(FitReportService fitReportService){
        this.fitReportService = fitReportService;
    }

    @GetMapping("/downloadReportFit")
    public void downloadReport(@RequestParam Integer id, HttpServletResponse response) throws  Exception {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheet.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=report_fiting.xlsx");
        fitReportService.createReport(id, response.getOutputStream());
    }



}
