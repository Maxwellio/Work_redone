package patrubki.service;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.export.ooxml.JRDocxExporter;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter;
import net.sf.jasperreports.engine.util.JRLoader;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import patrubki.repository.HydrotestRepository;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@Service
public class HydrotestReportService {

    public static final String TEMPLATE_CLASSPATH = "reports/test.jasper";
    public static final String PARAM_ID_HYDROTEST = "p_id_hydrotest";

    private final HydrotestRepository hydrotestRepository;
    private final JdbcTemplate jdbcTemplate;

    public HydrotestReportService(HydrotestRepository hydrotestRepository, JdbcTemplate jdbcTemplate) {
        this.hydrotestRepository = hydrotestRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public byte[] exportPdf(Integer idHydrotest) {
        JasperPrint print = fillReport(idHydrotest);
        try {
            return JasperExportManager.exportReportToPdf(print);
        } catch (JRException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Не удалось экспортировать отчёт в PDF", e);
        }
    }

    public byte[] exportExcel(Integer idHydrotest) {
        JasperPrint print = fillReport(idHydrotest);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            JRXlsxExporter exporter = new JRXlsxExporter();
            exporter.setExporterInput(new SimpleExporterInput(print));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
            exporter.exportReport();
            return out.toByteArray();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Не удалось экспортировать отчёт в Excel", e);
        }
    }

    public byte[] exportWord(Integer idHydrotest) {
        JasperPrint print = fillReport(idHydrotest);
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            JRDocxExporter exporter = new JRDocxExporter();
            exporter.setExporterInput(new SimpleExporterInput(print));
            exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(out));
            exporter.exportReport();
            return out.toByteArray();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Не удалось экспортировать отчёт в Word", e);
        }
    }

    private JasperPrint fillReport(Integer idHydrotest) {
        if (idHydrotest == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "id гидроиспытания обязателен");
        }
        if (!hydrotestRepository.existsById(idHydrotest)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Гидроиспытание id=" + idHydrotest + " не найдено");
        }

        JasperReport report = loadTemplate();
        Map<String, Object> params = new HashMap<>();
        params.put(PARAM_ID_HYDROTEST, idHydrotest);

        return jdbcTemplate.execute((Connection connection) -> {
            try {
                return JasperFillManager.fillReport(report, params, connection);
            } catch (JRException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Не удалось заполнить отчёт Jasper", e);
            }
        });
    }

    private JasperReport loadTemplate() {
        ClassPathResource resource = new ClassPathResource(TEMPLATE_CLASSPATH);
        if (!resource.exists()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Шаблон не найден в classpath: " + TEMPLATE_CLASSPATH
                            + " (положите test.jasper в src/main/resources/reports/)");
        }
        try (InputStream in = resource.getInputStream()) {
            return (JasperReport) JRLoader.loadObject(in);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Не удалось загрузить шаблон " + TEMPLATE_CLASSPATH, e);
        }
    }
}
