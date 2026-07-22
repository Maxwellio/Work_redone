package patrubki.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import patrubki.service.JasperReportService;
import patrubki.service.JasperReportService.ReportFormat;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = TestReportController.class)
@AutoConfigureMockMvc(addFilters = false)
class TestReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JasperReportService jasperReportService;

    @Test
    void testReportPdf_returnsPdfAttachment() throws Exception {
        byte[] payload = new byte[]{37, 80, 68, 70}; // %PDF
        when(jasperReportService.exportTestHydroReport(eq(42), eq(ReportFormat.PDF)))
                .thenReturn(payload);

        mockMvc.perform(get("/api/testreportpdf").param("id", "42"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string("Content-Disposition",
                        org.hamcrest.Matchers.containsString("test_hydro_42.pdf")))
                .andExpect(content().bytes(payload));
    }

    @Test
    void testReportExcel_returnsXlsxAttachment() throws Exception {
        byte[] payload = new byte[]{80, 75}; // PK
        when(jasperReportService.exportTestHydroReport(eq(7), eq(ReportFormat.EXCEL)))
                .thenReturn(payload);

        mockMvc.perform(get("/api/testreportexcel").param("id", "7"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .andExpect(header().string("Content-Disposition",
                        org.hamcrest.Matchers.containsString("test_hydro_7.xlsx")))
                .andExpect(content().bytes(payload));
    }

    @Test
    void testReportWord_returnsDocxAttachment() throws Exception {
        byte[] payload = new byte[]{80, 75};
        when(jasperReportService.exportTestHydroReport(eq(3), eq(ReportFormat.WORD)))
                .thenReturn(payload);

        mockMvc.perform(get("/api/testreportword").param("id", "3"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .andExpect(header().string("Content-Disposition",
                        org.hamcrest.Matchers.containsString("test_hydro_3.docx")))
                .andExpect(content().bytes(payload));
    }

    @Test
    void testReportPdf_requiresId() throws Exception {
        mockMvc.perform(get("/api/testreportpdf"))
                .andExpect(status().isBadRequest());
    }
}
