# Jasper hydrotest test reports Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add authenticated GET endpoints `/api/testreportpdf`, `/api/testreportexcel`, `/api/testreportword` that fill `classpath:reports/test.jasper` with `p_id_hydrotest` and return PDF/XLSX/DOCX.

**Architecture:** Thin `TestReportController` + `TestReportService` that opens a JDBC connection from Spring `DataSource`, fills the compiled Jasper template, and exports with JRPdf/JRXlsx/JRDocx exporters. Template binary is not committed; code assumes it will exist on the production machine.

**Tech Stack:** Spring Boot 2.7.8, Java 17, JasperReports 6.20.6, jasperreports-fonts 6.20.6, Apache POI 5.2.2, com.lowagie itext (Artifactory).

## Global Constraints

- JasperReports / fonts: **6.20.6** only (match Studio 6.20)
- Apache POI / poi-ooxml: **5.2.2** only
- Template path: `classpath:reports/test.jasper`
- Parameter name: `p_id_hydrotest`
- Query param: `id` (Integer)
- Endpoints under `/api`, authenticated via existing SecurityConfig
- Do not commit a fake `.jasper` binary; optionally add `reports/.gitkeep`
- Offline Artifactory — do not add remote repos to pom

---

### Task 1: Maven dependencies

**Files:**
- Modify: `backend/pom.xml`

**Interfaces:**
- Produces: compile-time availability of JasperReports + POI + itext on the classpath

- [ ] **Step 1: Add dependencies to `backend/pom.xml` inside `<dependencies>`**

```xml
        <dependency>
            <groupId>net.sf.jasperreports</groupId>
            <artifactId>jasperreports</artifactId>
            <version>6.20.6</version>
        </dependency>
        <dependency>
            <groupId>net.sf.jasperreports</groupId>
            <artifactId>jasperreports-fonts</artifactId>
            <version>6.20.6</version>
        </dependency>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi</artifactId>
            <version>5.2.2</version>
        </dependency>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>5.2.2</version>
        </dependency>
        <dependency>
            <groupId>com.lowagie</groupId>
            <artifactId>itext</artifactId>
            <version>2.1.7.js10</version>
        </dependency>
```

If Artifactory stores itext under a different version string, keep the artifact and adjust only the `<version>` to the local one; do not change group/artifact ids.

- [ ] **Step 2: Commit**

```bash
git add backend/pom.xml
git commit -m "deps: add JasperReports 6.20.6, fonts, POI 5.2.2, itext"
```

---

### Task 2: TestReportService

**Files:**
- Create: `backend/src/main/java/patrubki/service/TestReportService.java`
- Create: `backend/src/main/java/patrubki/service/ReportTemplateNotFoundException.java`
- Create: `backend/src/main/resources/reports/.gitkeep`

**Interfaces:**
- Consumes: Spring `DataSource`, classpath resource `reports/test.jasper`
- Produces:
  - `byte[] exportPdf(Integer idHydrotest)`
  - `byte[] exportExcel(Integer idHydrotest)`
  - `byte[] exportWord(Integer idHydrotest)`
  - `ReportTemplateNotFoundException` when template missing

- [ ] **Step 1: Add `reports/.gitkeep` so the directory exists for the production template drop-in**

- [ ] **Step 2: Create `ReportTemplateNotFoundException`**

```java
package patrubki.service;

public class ReportTemplateNotFoundException extends RuntimeException {
    public ReportTemplateNotFoundException(String message) {
        super(message);
    }
}
```

- [ ] **Step 3: Create `TestReportService`**

```java
package patrubki.service;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.engine.util.JRLoader;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@Service
public class TestReportService {

    private static final String TEMPLATE_PATH = "reports/test.jasper";
    private static final String PARAM_ID = "p_id_hydrotest";

    private final DataSource dataSource;

    public TestReportService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public byte[] exportPdf(Integer idHydrotest) {
        return export(idHydrotest, ExportFormat.PDF);
    }

    public byte[] exportExcel(Integer idHydrotest) {
        return export(idHydrotest, ExportFormat.EXCEL);
    }

    public byte[] exportWord(Integer idHydrotest) {
        return export(idHydrotest, ExportFormat.WORD);
    }

    private byte[] export(Integer idHydrotest, ExportFormat format) {
        JasperPrint print = fill(idHydrotest);
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            switch (format) {
                case PDF -> {
                    JRPdfExporter exporter = new JRPdfExporter();
                    exporter.setExporterInput(new SimpleExporterInput(print));
                    exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
                    exporter.exportReport();
                }
                case EXCEL -> {
                    JRXlsxExporter exporter = new JRXlsxExporter();
                    exporter.setExporterInput(new SimpleExporterInput(print));
                    exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
                    exporter.exportReport();
                }
                case WORD -> {
                    JRDocxExporter exporter = new JRDocxExporter();
                    exporter.setExporterInput(new SimpleExporterInput(print));
                    exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
                    exporter.exportReport();
                }
            }
            return out.toByteArray();
        } catch (JRException e) {
            throw new IllegalStateException("Failed to export report as " + format, e);
        }
    }

    private JasperPrint fill(Integer idHydrotest) {
        ClassPathResource resource = new ClassPathResource(TEMPLATE_PATH);
        if (!resource.exists()) {
            throw new ReportTemplateNotFoundException(
                    "Report template not found: classpath:" + TEMPLATE_PATH);
        }
        Map<String, Object> params = new HashMap<>();
        params.put(PARAM_ID, idHydrotest);
        try (InputStream in = resource.getInputStream();
             Connection connection = dataSource.getConnection()) {
            JasperReport report = (JasperReport) JRLoader.loadObject(in);
            return JasperFillManager.fillReport(report, params, connection);
        } catch (ReportTemplateNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new IllegalStateException(
                    "Failed to fill report for p_id_hydrotest=" + idHydrotest, e);
        }
    }

    private enum ExportFormat {
        PDF, EXCEL, WORD
    }
}
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/main/resources/reports/.gitkeep \
  backend/src/main/java/patrubki/service/ReportTemplateNotFoundException.java \
  backend/src/main/java/patrubki/service/TestReportService.java
git commit -m "feat: add TestReportService for Jasper hydrotest exports"
```

---

### Task 3: TestReportController

**Files:**
- Create: `backend/src/main/java/patrubki/controller/TestReportController.java`

**Interfaces:**
- Consumes: `TestReportService.exportPdf|exportExcel|exportWord(Integer)`
- Produces: GET `/api/testreportpdf|testreportexcel|testreportword?id=`

- [ ] **Step 1: Create controller**

```java
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
```

Missing `id` is rejected by Spring with 400 (`MissingServletRequestParameterException`). Non-integer `id` → 400 via type conversion failure.

- [ ] **Step 2: Commit**

```bash
git add backend/src/main/java/patrubki/controller/TestReportController.java
git commit -m "feat: add testreport pdf/excel/word endpoints"
```

---

### Task 4: Verify compile & push

**Files:** none new (verification only)

- [ ] **Step 1: Compile backend** (may fail to resolve deps in this cloud sandbox without Artifactory — that is expected; syntax/package checks still apply)

```bash
cd backend && mvn -q -DskipTests compile
```

If Artifactory is unreachable here, at least confirm Java sources have no obvious errors and document that full resolve happens on the production LAN.

- [ ] **Step 2: Push branch and open/update PR**

```bash
git push -u origin cursor/jasper-hydrotest-reports-c306
```

---

## Spec coverage check

| Spec requirement | Task |
|---|---|
| pom deps 6.20.6 / POI 5.2.2 / itext | Task 1 |
| classpath `reports/test.jasper`, param `p_id_hydrotest` | Task 2 |
| three GET endpoints with `?id=` | Task 3 |
| MIME + Content-Disposition | Task 3 |
| 404 missing template / 500 fill errors / 400 missing id | Task 3 |
| no template binary in repo | Task 2 `.gitkeep` only |
