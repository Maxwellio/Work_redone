package patrubki.service;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.sql.DataSource;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@Service
public class JasperReportService {

    public static final String TEST_TEMPLATE_PATH = "/reports/test.jasper";
    public static final String PARAM_ID_HYDROTEST = "p_id_hydrotest";

    public enum ReportFormat {
        PDF,
        EXCEL,
        WORD
    }

    private final DataSource dataSource;

    public JasperReportService(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public byte[] exportTestHydroReport(Integer idHydrotest, ReportFormat format) {
        if (idHydrotest == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "id is required");
        }
        try (InputStream template = openTemplate();
             Connection connection = dataSource.getConnection()) {
            Map<String, Object> params = new HashMap<>();
            params.put(PARAM_ID_HYDROTEST, idHydrotest);
            JasperPrint print = JasperFillManager.fillReport(template, params, connection);
            return export(print, format);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to generate report: " + ex.getMessage(),
                    ex);
        }
    }

    public byte[] export(JasperPrint print, ReportFormat format) throws JRException {
        return switch (format) {
            case PDF -> JasperExportManager.exportReportToPdf(print);
            case EXCEL -> exportXlsx(print);
            case WORD -> exportDocx(print);
        };
    }

    private InputStream openTemplate() {
        InputStream stream = JasperReportService.class.getResourceAsStream(TEST_TEMPLATE_PATH);
        if (stream == null) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Report template not found: " + TEST_TEMPLATE_PATH);
        }
        return stream;
    }

    private byte[] exportXlsx(JasperPrint print) throws JRException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        JRXlsxExporter exporter = new JRXlsxExporter();
        exporter.setExporterInput(new SimpleExporterInput(print));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
        exporter.exportReport();
        return out.toByteArray();
    }

    private byte[] exportDocx(JasperPrint print) throws JRException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        JRDocxExporter exporter = new JRDocxExporter();
        exporter.setExporterInput(new SimpleExporterInput(print));
        exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
        exporter.exportReport();
        return out.toByteArray();
    }
}
