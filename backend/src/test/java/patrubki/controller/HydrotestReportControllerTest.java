package patrubki.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import patrubki.config.SecurityConfig;
import patrubki.service.HydrotestReportService;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = HydrotestReportController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import(SecurityConfig.class)
class HydrotestReportControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HydrotestReportService reportService;

    @Test
    void testReportPdfReturnsAttachment() throws Exception {
        byte[] pdf = new byte[]{37, 80, 68, 70}; // %PDF
        when(reportService.exportPdf(eq(42))).thenReturn(pdf);

        mockMvc.perform(get("/api/testreportpdf").param("id", "42"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_PDF))
                .andExpect(header().string("Content-Disposition",
                        "attachment; filename=\"hydrotest-42.pdf\""))
                .andExpect(content().bytes(pdf));

        verify(reportService).exportPdf(42);
    }

    @Test
    void testReportExcelReturnsXlsx() throws Exception {
        byte[] xlsx = new byte[]{1, 2, 3};
        when(reportService.exportExcel(eq(7))).thenReturn(xlsx);

        mockMvc.perform(get("/api/testreportexcel").param("id", "7"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .andExpect(header().string("Content-Disposition",
                        "attachment; filename=\"hydrotest-7.xlsx\""));

        verify(reportService).exportExcel(7);
    }

    @Test
    void testReportWordReturnsDocx() throws Exception {
        byte[] docx = new byte[]{4, 5, 6};
        when(reportService.exportWord(eq(9))).thenReturn(docx);

        mockMvc.perform(get("/api/testreportword").param("id", "9"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .andExpect(header().string("Content-Disposition",
                        "attachment; filename=\"hydrotest-9.docx\""));

        verify(reportService).exportWord(9);
    }
}
