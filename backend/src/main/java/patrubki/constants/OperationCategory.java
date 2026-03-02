package patrubki.constants;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

/**
 * Категории операций из operation_structure_spr для удобного обращения.
 * Заглушки имён — можно переименовать позже.
 */
public enum OperationCategory {

    /** Операции 40-41, 52-55 — для присваивания сразу */
    CATEGORY_ASSIGNMENT(Stream.concat(
            IntStream.rangeClosed(40, 41).boxed(),
            IntStream.rangeClosed(52, 55).boxed()
    ).collect(Collectors.toSet())),

    /** Операции 13-39 — большая форма */
    CATEGORY_LARGE_FORM(IntStream.rangeClosed(13, 39).boxed().collect(Collectors.toSet())),

    /** Операции 1-12, 42-51 — маленькая форма */
    CATEGORY_SMALL_FORM(Stream.concat(
            IntStream.rangeClosed(1, 12).boxed(),
            IntStream.rangeClosed(42, 51).boxed()
    ).collect(Collectors.toSet()));

    private final Set<Integer> operationIds;

    OperationCategory(Set<Integer> operationIds) {
        this.operationIds = Collections.unmodifiableSet(operationIds);
    }

    public boolean contains(Integer id) {
        return id != null && operationIds.contains(id);
    }

    public Set<Integer> getOperationIds() {
        return operationIds;
    }

    public static OperationCategory of(Integer id) {
        if (id == null) {
            return null;
        }
        for (OperationCategory category : values()) {
            if (category.contains(id)) {
                return category;
            }
        }
        return null;
    }

    public static boolean isAssignment(Integer id) {
        return CATEGORY_ASSIGNMENT.contains(id);
    }

    public static boolean isLargeForm(Integer id) {
        return CATEGORY_LARGE_FORM.contains(id);
    }

    public static boolean isSmallForm(Integer id) {
        return CATEGORY_SMALL_FORM.contains(id);
    }
}
