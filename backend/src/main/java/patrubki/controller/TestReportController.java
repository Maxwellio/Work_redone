package patrubki.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import patrubki.service.JasperReportService;
import patrubki.service.JasperReportService.ReportFormat;

@RestController
@RequestMapping("/api")
public class TestReportController {

    private final JasperReportService jasperReportService;

    public TestReportController(JasperReportService jasperReportService) {
        this.jasperReportService = jasperReportService;
    }

    @GetMapping("/testreportpdf")
    public ResponseEntity<byte[]> testReportPdf(@RequestParam("id") Integer id) {
        return buildResponse(id, ReportFormat.PDF,
                MediaType.APPLICATION_PDF,
                "test_hydro_" + id + ".pdf");
    }

    @GetMapping("/testreportexcel")
    public ResponseEntity<byte[]> testReportExcel(@RequestParam("id") Integer id) {
        return buildResponse(id, ReportFormat.EXCEL,
                MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
                "test_hydro_" + id + ".xlsx");
    }

    @GetMapping("/testreportword")
    public ResponseEntity<byte[]> testReportWord(@RequestParam("id") Integer id) {
        return buildResponse(id, ReportFormat.WORD,
                MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
                "test_hydro_" + id + ".docx");
    }

    private ResponseEntity<byte[]> buildResponse(Integer id,
                                                 ReportFormat format,
                                                 MediaType mediaType,
                                                 String filename) {
        byte[] body = jasperReportService.exportTestHydroReport(id, format);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(mediaType)
                .body(body);
    }
}
