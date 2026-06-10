package patrubki.util;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.YearMonth;

public final class YearMonthRangeUtil {

    private YearMonthRangeUtil() {
    }

    public static LocalDate[] parseRange(String yearMonth) {
        if (yearMonth == null || yearMonth.trim().isEmpty()) {
            return null;
        }
        try {
            YearMonth ym = YearMonth.parse(yearMonth.trim());
            LocalDate from = ym.atDay(1);
            LocalDate to = ym.plusMonths(1).atDay(1);
            return new LocalDate[]{from, to};
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid yearMonth format, expected YYYY-MM");
        }
    }
}
