package patrubki.controller;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import patrubki.service.ReportTemplateNotFoundException;
import patrubki.service.TestReportService;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class TestReportController {

    private static final MediaType XLSX = MediaType.parseMediaType(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    private static final MediaType DOCX = MediaType.parseMediaType(
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

    private final TestReportService testReportService;

    public TestReportController(TestReportService testReportService) {
        this.testReportService = testReportService;
    }

    @GetMapping("/testreportpdf")
    public ResponseEntity<byte[]> testReportPdf(@RequestParam("id") Integer id) {
        return file(testReportService.exportPdf(id), MediaType.APPLICATION_PDF, "hydrotest-" + id + ".pdf");
    }

    @GetMapping("/testreportexcel")
    public ResponseEntity<byte[]> testReportExcel(@RequestParam("id") Integer id) {
        return file(testReportService.exportExcel(id), XLSX, "hydrotest-" + id + ".xlsx");
    }

    @GetMapping("/testreportword")
    public ResponseEntity<byte[]> testReportWord(@RequestParam("id") Integer id) {
        return file(testReportService.exportWord(id), DOCX, "hydrotest-" + id + ".docx");
    }

    private ResponseEntity<byte[]> file(byte[] body, MediaType type, String filename) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(type)
                .body(body);
    }

    @ExceptionHandler(ReportTemplateNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleMissingTemplate(ReportTemplateNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, String>> handleExportFailure(IllegalStateException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", ex.getMessage() != null ? ex.getMessage() : "Report export failed"));
    }
}
