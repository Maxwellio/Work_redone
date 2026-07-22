package patrubki.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import patrubki.service.HydrotestReportService;

@RestController
@RequestMapping("/api")
public class HydrotestReportController {

    private final HydrotestReportService reportService;

    public HydrotestReportController(HydrotestReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/testreportpdf")
    public ResponseEntity<byte[]> testReportPdf(@RequestParam("id") Integer idHydrotest) {
        byte[] body = reportService.exportPdf(idHydrotest);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"hydrotest-" + idHydrotest + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(body);
    }

    @GetMapping("/testreportexcel")
    public ResponseEntity<byte[]> testReportExcel(@RequestParam("id") Integer idHydrotest) {
        byte[] body = reportService.exportExcel(idHydrotest);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"hydrotest-" + idHydrotest + ".xlsx\"")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(body);
    }

    @GetMapping("/testreportword")
    public ResponseEntity<byte[]> testReportWord(@RequestParam("id") Integer idHydrotest) {
        byte[] body = reportService.exportWord(idHydrotest);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"hydrotest-" + idHydrotest + ".docx\"")
                .contentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .body(body);
    }
}
