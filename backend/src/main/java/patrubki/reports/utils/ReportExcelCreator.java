package patrubki.reports.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.ss.util.CellRangeAddressBase;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.io.OutputStream;
import java.util.*;

@Component
public class ReportExcelCreator {


    /*-----------------------------------------------------------------------------------
    List<Map<String, Object>> data1/2 - Результат запроса к бд в repository, ключ-значение
    List<String> columns1/2 - лист указанных столбцов, выбранных из результата запроса к бд
    String nameData - название именованной ячейки name для вставки названия переводника/трубы/патрубка через setNameCell()
    String template - путь до xlsx шаблона, через ClassPathResource стартует из папки resources
     ------------------------------------------------------------------------------------*/
    public void createExcel2(OutputStream out, List<Map<String, Object>> data1, List<Map<String, Object>> data2,List<String> columns1, List<String> columns2,
                             String nameData, String template, String sum, Orientation orientation1, Orientation orientation2) throws Exception {
        //Берем шаблон из папки resources
        ClassPathResource resource = new ClassPathResource(template);
        ///////
        try (InputStream templateStream = resource.getInputStream();
             Workbook workbook = new XSSFWorkbook(templateStream)) {
            //Один лист
            Sheet sheet = workbook.getSheetAt(0);


            if (nameData !=null) {
                setNameCell(workbook, sheet, "name", nameData);
            }

            if (sum !=null) {
                setNameCell(workbook, sheet, "sum", sum);
            }

                printTableHeader(workbook, data1, "table1Start", "table1End", "table1Target");
                fillTable(workbook, sheet, "report_start1", data1, columns1, orientation1);
                printTableHeader(workbook, data2, "table2Start", "table2End", "table2Target");
                fillTable(workbook, sheet, "report_start2", data2, columns2, orientation2);

            calculateNamedCellFormula(workbook, "sum", sum);

            workbook.write(out);

        }
    }

    /* ЗАПИСЬ ДАННЫХ В ЯЧЕЙКУ
    Запись в переданную ячейку + значение
    */
    private void writeCellValue(Cell cell, Object value) {
        //Если переданное значение = null, то пустая ячейка
        if (value == null) {
            cell.setBlank();
            return;
        }
        //Если число
        if (value instanceof Number) {
            cell.setCellValue(((Number) value).doubleValue());
        //Если boolean
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        //Всё остальное (преимущественно текст)
        } else {
            cell.setCellValue(value.toString());
        }
    }

    /* ЗАПОЛНЕНИЕ ТАБЛИЦЫ ДАННЫМИ ЗАПРОСА
    Workbook workbook - таблица и её тип
    Sheet sheet - лист в который пишем
    String startName - именованная ячейка старта отчета (с которой начинаются строки данных)
    List<Map<String, Object>> data - результат запроса к бд
    List<String> columns - выбранные для вывода в отчет столбцы из запроса к бд
    Orientation orientation - выводим данные построчно(horizontal) или в столбец(vertical)
    */
    private void fillTable(Workbook workbook, Sheet sheet, String startName, List<Map<String, Object>> data, List<String> columns, Orientation orientation) {
        if (data == null || data.isEmpty()) {
            return;
        }
        Name name = workbook.getName(startName);
        if (name == null) {
            throw new IllegalStateException(startName + " не найден");
        }

        CellReference ref = new CellReference(name.getRefersToFormula());
        int startRow = ref.getRow();
        int startCol = ref.getCol();

        Row templateRow = sheet.getRow(startRow);
        if (templateRow == null) {
            throw new IllegalStateException("Строка-шаблон не найдена для " + startName);
        }

        int currentRow = startRow;

        int rowsToInsert = data.size() - 1;
        if (rowsToInsert > 0) {
            sheet.shiftRows(startRow + 1, sheet.getLastRowNum() + 1, rowsToInsert);
        }

        for (Map<String, Object> rowData : data) {
            int currentCol = startCol;
            for (String column : columns) {
                int r = orientation == Orientation.vertical
                        ? currentRow++
                        : currentRow;

                int c = orientation == Orientation.horizontal
                        ? currentCol++
                        : currentCol;

                Row row = sheet.getRow(r);
                if (row == null) {
                    row = sheet.createRow(r);
                }
                //int span = getSpanForCell(currentCol, templateMerges);

                Cell cell = row.getCell(c);
                if (cell == null) {
                    cell = row.createCell(c);
                }

                Cell templateCell = templateRow.getCell(c);
                if (templateCell != null && templateCell.getCellStyle() != null) {
                    cell.setCellStyle(templateCell.getCellStyle());
                }
                writeCellValue(cell, rowData.get(column));
                c++;
                // currentCol+= span;
            }

            if (orientation == Orientation.horizontal){
                currentRow++;
            } else currentCol++;
            //currentRow++;
        }
    }

    /* ВЫВОД В КОНКРЕТНУЮ ИМЕНОВАННУЮ ЯЧЕЙКУ
    Workbook workbook - таблица и её тип
    Sheet sheet - лист в который пишем
    String startName - именованная ячейка в которую пишем
    Object value - что пишем в именованную ячейку
    */
    private void setNameCell(Workbook workbook, Sheet sheet, String name, Object value) {
        Name namedCell = workbook.getName(name);
        if (namedCell == null) {
            throw new IllegalStateException(name + " не найден");
        }
        CellReference ref = new CellReference(namedCell.getRefersToFormula());
        Row row = sheet.getRow(ref.getRow());
        if (row == null) {
            row = sheet.createRow(ref.getRow());
        }
        Cell cell = row.getCell(ref.getCol());
        if (cell == null) {
            cell = row.createCell(ref.getCol());
        }

        Cell templateCell = sheet.getRow(ref.getRow()).getCell(ref.getCol());
        if (templateCell != null && templateCell.getCellStyle() != null) {
            cell.setCellStyle(templateCell.getCellStyle());
        }

        cell.setCellValue((String) value);
    }


    /* ВЫЧИСЛЕНИЕ ФОРМУЛЫ В ЯЧЕЙКЕ
    Workbook workbook - таблица и её тип
    String namedCellName - именованная ячейка в которую пишем
    String sum - что пишем в именованную ячейку, если сумма уже вычислена и есть в бд
    !!!! ИНАЧЕ вычисляем по формуле из ячейки, т.к. в р7-офис не высчитывается формула
    */
    private void calculateNamedCellFormula(Workbook workbook, String namedCellName, String sum) {
        Name namedCell = workbook.getName(namedCellName);
        if (namedCell == null) {
            throw new IllegalArgumentException(namedCellName + " не найдена");
        }
        CellReference ref = new CellReference(namedCell.getRefersToFormula());
        Sheet sheet = workbook.getSheet(ref.getSheetName());
        if (sheet == null) {
            throw new IllegalStateException("Лист " + ref.getSheetName() + " не найден");
        }
        Row row = sheet.getRow(ref.getRow());
        if (row == null) {
            row = sheet.createRow(ref.getRow());
        }
        Cell cell = row.getCell(ref.getCol());
        if (cell == null) {
            cell = row.createCell(ref.getCol());
        }

        if (sum == null) {
            FormulaEvaluator evaluator = workbook.getCreationHelper().createFormulaEvaluator();
            evaluator.evaluateFormulaCell(cell);
        } else cell.setCellFormula(null);
    }


    /* ПЕЧАТЬ ШАПКИ ТАБЛИЦЫ
    Workbook workbook - таблица и её тип
    List<Map<String, Object>> data - проверяем есть ли данные и печатаем или удаляем шапку таблицы
    String topLeftCornerName - именованная ячейка, левый верхний угол, где начинается шаблон шапки таблицы
    String btmRightCornerName - именованная ячейка, правый нижний угол, где заканчивается шаблон шапки таблицы
    String tableStartName - именованная ячейка, левый верхний угол, с которого начинать выводить таблицу
    */
    private void printTableHeader(Workbook workbook, List<Map<String, Object>> data, String topLeftCornerName, String btmRightCornerName, String tableStartName) {
        if (data == null || workbook == null || data.isEmpty()) return;
        Name topLeft = workbook.getName(topLeftCornerName);
        Name btmRight = workbook.getName(btmRightCornerName);
        if (topLeft == null || btmRight == null) return;
        CellReference topLeftRef = new CellReference(topLeft.getRefersToFormula());
        CellReference btmRightRef = new CellReference(btmRight.getRefersToFormula());
        Sheet sheet = workbook.getSheet(topLeftRef.getSheetName());
        if (sheet == null) return;

        int startRow = topLeftRef.getRow();
        int endRow = btmRightRef.getRow();
        int startCol = topLeftRef.getCol();
        int endCol = btmRightRef.getCol();

        List<CellRangeAddress> mergesToMove = new ArrayList<>();
        for (int i = 0; i < sheet.getNumMergedRegions(); i++){
            CellRangeAddress region = sheet.getMergedRegion(i);
            if (region.getFirstRow() >= startRow && region.getLastRow() <= endRow && region.getFirstColumn() >= startCol && region.getLastColumn() <= endCol) {
                mergesToMove.add(region);
            }
        }

        if (data.isEmpty()) {
            for (int i = startRow; i <= endRow; i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                for (int j = startCol; j <= endCol; j++) {
                    Cell cell = row.getCell(j);
                    if (cell != null) {
                        cell.setBlank();
                        cell.setCellStyle(sheet.getWorkbook().createCellStyle());
                    }
                }
            }
            mergesToMove.sort(Comparator.comparingInt(CellRangeAddress::getFirstRow).reversed());
            for (CellRangeAddress merge : mergesToMove) {
                sheet.removeMergedRegion(sheet.getMergedRegions().indexOf(merge));
            }
            return;
        }

        Name tableStart = workbook.getName(tableStartName);
        if (tableStart == null) return;

        CellReference tableRef = new CellReference(tableStart.getRefersToFormula());
        Sheet tableSheet = workbook.getSheet(tableRef.getSheetName());
        if (tableSheet == null) return;

        for (CellRangeAddress merge : mergesToMove) {
            CellRangeAddress newMerge = new CellRangeAddress(
                    tableRef.getRow() + (merge.getFirstRow() - startRow),
                    tableRef.getRow() + (merge.getLastRow() - startRow),
                    tableRef.getCol() + (merge.getFirstColumn() - startCol),
                    tableRef.getCol() + (merge.getLastColumn() - startCol));
            tableSheet.addMergedRegion(newMerge);
        }

        for (int i = startRow; i <= endRow; i++) {
            Row sourceRow = sheet.getRow(i);
            Row targetRow = tableSheet.getRow(tableRef.getRow() + (i - startRow));
            if (targetRow == null) targetRow = tableSheet.createRow(tableRef.getRow() + (i - startRow));

            for (int j = startCol; j <= endCol; j++) {
                Cell sourceCell = sourceRow != null ? sourceRow.getCell(j) : null;
                Cell targetCell = targetRow.getCell(tableRef.getCol() + (j - startCol));
                if (targetCell == null) targetCell = targetRow.createCell(tableRef.getCol() + (j - startCol));

                if (sourceCell != null) {
                    CellType type = sourceCell.getCellType();
                    switch (type) {
                        case STRING:
                            targetCell.setCellValue(sourceCell.getStringCellValue());
                            break;
                        case NUMERIC:
                            targetCell.setCellValue(sourceCell.getNumericCellValue());
                            break;
                        case BOOLEAN:
                            targetCell.setCellValue(sourceCell.getBooleanCellValue());
                            break;
                        case FORMULA:
                            targetCell.setCellValue(sourceCell.getCellFormula());
                            break;
                        default:
                            targetCell.setBlank();
                            break;
                    }
                    if (sourceCell.getCellStyle() != null){
                        CellStyle newStyle = workbook.createCellStyle();
                        newStyle.cloneStyleFrom(sourceCell.getCellStyle());
                        targetCell.setCellStyle(newStyle);
                    }
                    sourceCell.setBlank();
                    sourceCell.setCellStyle(workbook.createCellStyle());
                } else
                    targetCell.setBlank();
            }
        }
        mergesToMove.sort(Comparator.comparingInt(CellRangeAddressBase::getFirstRow).reversed());
        for (CellRangeAddress merge : mergesToMove) {
            sheet.removeMergedRegion(sheet.getMergedRegions().indexOf(merge));
        }
    }
}
