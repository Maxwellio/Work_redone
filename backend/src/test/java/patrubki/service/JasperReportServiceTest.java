package patrubki.service;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import org.junit.jupiter.api.Test;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JasperReportServiceTest {

    private final JasperReportService jasperReportService = new JasperReportService(null);

    @Test
    void contracts_matchStudioTemplate() {
        assertEquals("p_id_hydrotest", JasperReportService.PARAM_ID_HYDROTEST);
        assertEquals("/reports/test.jasper", JasperReportService.TEST_TEMPLATE_PATH);
    }

    @Test
    void exportFormats_produceNonEmptyBytes() throws Exception {
        // Minimal inline report only to verify PDF/XLSX/DOCX exporters; production uses resources/reports/test.jasper
        String jrxml = """
                <?xml version="1.0" encoding="UTF-8"?>
                <jasperReport xmlns="http://jasperreports.sourceforge.net/jasperreports"
                              name="unit_test" pageWidth="200" pageHeight="200"
                              columnWidth="160" leftMargin="20" rightMargin="20"
                              topMargin="20" bottomMargin="20">
                    <parameter name="p_id_hydrotest" class="java.lang.Integer"/>
                    <title>
                        <band height="40">
                            <textField>
                                <reportElement x="0" y="0" width="160" height="20"/>
                                <textFieldExpression><![CDATA["id=" + $P{p_id_hydrotest}]]></textFieldExpression>
                            </textField>
                        </band>
                    </title>
                </jasperReport>
                """;

        JasperReport report = JasperCompileManager.compileReport(
                new ByteArrayInputStream(jrxml.getBytes(StandardCharsets.UTF_8)));
        Map<String, Object> params = new HashMap<>();
        params.put("p_id_hydrotest", 15);
        JasperPrint print = JasperFillManager.fillReport(report, params, new JREmptyDataSource());

        assertTrue(jasperReportService.export(print, JasperReportService.ReportFormat.PDF).length > 0);
        assertTrue(jasperReportService.export(print, JasperReportService.ReportFormat.EXCEL).length > 0);
        assertTrue(jasperReportService.export(print, JasperReportService.ReportFormat.WORD).length > 0);
    }
}
