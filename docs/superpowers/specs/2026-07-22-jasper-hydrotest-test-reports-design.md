# Jasper hydrotest test reports — design

## Goal

Add three authenticated API endpoints that fill the existing compiled Jasper template `reports/test.jasper` for a hydrotest id and return PDF, Excel (XLSX), or Word (DOCX). This is a temporary capability test of Jasper in the production app; the template lives on the production machine and will be copied into `src/main/resources/reports/` there.

## Environment constraints

- Spring Boot 2.7.8, Java 17, PostgreSQL via existing `DataSource`
- Offline LAN; dependencies resolved from local Artifactory only
- Jaspersoft Studio 6.20 → JasperReports Library **6.20.6**
- Confirmed in Artifactory: `jasperreports:6.20.6`, `jasperreports-fonts:6.20.6`, `poi` / `poi-ooxml`, `com.lowagie:itext`
- Pin Apache POI to **5.2.2** (matches JasperReports 6.20.6)

## Dependencies (`backend/pom.xml`)

| Artifact | Version |
|---|---|
| `net.sf.jasperreports:jasperreports` | 6.20.6 |
| `net.sf.jasperreports:jasperreports-fonts` | 6.20.6 |
| `org.apache.poi:poi` | 5.2.2 |
| `org.apache.poi:poi-ooxml` | 5.2.2 |
| `com.lowagie:itext` | version present in Artifactory (prefer transitive from jasperreports / `2.1.7.js10` if available) |

No other report-related dependencies.

## Template & parameter contract

- Resource path: `classpath:reports/test.jasper`
- This repository does **not** ship the binary template; code assumes it will exist after transfer to the production tree
- Report parameter: `p_id_hydrotest` (Integer), equals request `id`
- DB column / entity id: `id_hydrotest` / `Hydrotest.idHydrotest`
- Data source: JDBC `Connection` from Spring `DataSource` (query lives inside the `.jasper`)

## API

All under `/api`, authenticated like other API routes.

| Method | Path | Query | Response |
|---|---|---|---|
| GET | `/api/testreportpdf` | `id` (required, Integer) | `application/pdf`, attachment `hydrotest-{id}.pdf` |
| GET | `/api/testreportexcel` | `id` (required, Integer) | `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, attachment `hydrotest-{id}.xlsx` |
| GET | `/api/testreportword` | `id` (required, Integer) | `application/vnd.openxmlformats-officedocument.wordprocessingml.document`, attachment `hydrotest-{id}.docx` |

## Components

### `TestReportService`

- Load compiled report from classpath
- Fill with `p_id_hydrotest` + JDBC connection
- Export via `JRPdfExporter` / `JRXlsxExporter` / `JRDocxExporter`
- Return `byte[]`
- Close JDBC connection in `finally` / try-with-resources
- Map missing template to a dedicated unchecked/checked exception that the controller turns into 404

### `TestReportController` (thin)

- Three GET mappings as above
- Missing/invalid `id` → 400
- Missing template → 404
- Fill/export failures → 500 (log stack trace)

Keep out of `MainDataController` to avoid bloating it for a throwaway test surface.

## Error matrix

| Situation | HTTP |
|---|---|
| Missing / non-integer `id` | 400 |
| `reports/test.jasper` absent | 404 |
| Fill/export/JDBC failure | 500 |
| Unauthenticated | 401 |

## Out of scope

- Frontend buttons / download UI
- Compiling `.jrxml` at runtime
- Multiple report templates or format negotiation via a single endpoint
- Auth/role changes beyond existing `/api/**` authenticated rule

## Success criteria

- With `reports/test.jasper` on the classpath and a valid hydrotest id, each endpoint returns a non-empty file of the correct MIME type
- Without the template, endpoints return 404 with a clear message
- Build resolves against Artifactory with the pinned versions above
