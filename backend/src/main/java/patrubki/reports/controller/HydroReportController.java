package patrubki.reports.controller;

import patrubki.reports.service.HydroReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api")
public class HydroReportController {
    private final HydroReportService hydroReportService;

    public HydroReportController(HydroReportService hydroReportService){
        this.hydroReportService = hydroReportService;
    }

    @GetMapping("/downloadReportHydro")
    public void downloadReport(@RequestParam Integer id, HttpServletResponse response) throws  Exception {
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheet.sheet");
        response.setHeader("Content-Disposition", "attachment; filename=report_hydro.xlsx");
        hydroReportService.createReport(id, response.getOutputStream());
    }



}
