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
                case PDF:
                    JRPdfExporter pdfExporter = new JRPdfExporter();
                    pdfExporter.setExporterInput(new SimpleExporterInput(print));
                    pdfExporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
                    pdfExporter.exportReport();
                    break;
                case EXCEL:
                    JRXlsxExporter xlsxExporter = new JRXlsxExporter();
                    xlsxExporter.setExporterInput(new SimpleExporterInput(print));
                    xlsxExporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
                    xlsxExporter.exportReport();
                    break;
                case WORD:
                    JRDocxExporter docxExporter = new JRDocxExporter();
                    docxExporter.setExporterInput(new SimpleExporterInput(print));
                    docxExporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
                    docxExporter.exportReport();
                    break;
                default:
                    throw new IllegalStateException("Unsupported export format: " + format);
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
        PDF,
        EXCEL,
        WORD
    }
}
