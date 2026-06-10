package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import patrubki.entity.Fiting;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface FitingRepository extends JpaRepository<Fiting, Integer> {

    @Query("SELECT f FROM Fiting f WHERE f.tip = :tip AND " +
            "(:search IS NULL OR :search = '' OR LOWER(f.nm) LIKE LOWER(CONCAT(CONCAT('%', :search), '%'))) " +
            "AND (:createdFrom IS NULL OR (f.createdAt >= :createdFrom AND f.createdAt < :createdTo)) " +
            "ORDER BY f.nm")
    List<Fiting> findByTipOrderByNmAsc(@Param("tip") BigDecimal tip,
                                       @Param("search") String search,
                                       @Param("createdFrom") LocalDate createdFrom,
                                       @Param("createdTo") LocalDate createdTo);

    @Query("SELECT f FROM Fiting f WHERE f.tip = :tip AND " +
            "(:search IS NULL OR :search = '' OR LOWER(f.nm) LIKE LOWER(CONCAT(CONCAT('%', :search), '%'))) " +
            "AND (:userId IS NULL OR f.idUserCreator = :userId) " +
            "AND (:createdFrom IS NULL OR (f.createdAt >= :createdFrom AND f.createdAt < :createdTo)) " +
            "ORDER BY f.nm")
    List<Fiting> findByTipOrderByNmAsc(@Param("tip") BigDecimal tip,
                                       @Param("search") String search,
                                       @Param("userId") Integer userId,
                                       @Param("createdFrom") LocalDate createdFrom,
                                       @Param("createdTo") LocalDate createdTo);
}
