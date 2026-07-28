package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import patrubki.entity.Hydrotest;

import java.time.LocalDate;
import java.util.List;

public interface HydrotestRepository extends JpaRepository<Hydrotest, Integer> {

    @Query("SELECT h FROM Hydrotest h WHERE " +
            "(:search IS NULL OR :search = '' OR LOWER(h.nh) LIKE LOWER(CONCAT(CONCAT('%', :search), '%'))) " +
            "ORDER BY h.nh")
    List<Hydrotest> findAllOrderByNhAsc(@Param("search") String search);

    @Query("SELECT h FROM Hydrotest h WHERE " +
            "(:search IS NULL OR :search = '' OR LOWER(h.nh) LIKE LOWER(CONCAT(CONCAT('%', :search), '%'))) " +
            "AND (:userId IS NULL OR h.idUserCreator = :userId) " +
            "ORDER BY h.nh")
    List<Hydrotest> findAllOrderByNhAsc(@Param("search") String search, @Param("userId") Integer userId);

    @Query("SELECT h FROM Hydrotest h WHERE " +
            "(:search IS NULL OR :search = '' OR LOWER(h.nh) LIKE LOWER(CONCAT(CONCAT('%', :search), '%'))) " +
            "AND h.createdAt >= :createdFrom AND h.createdAt < :createdTo " +
            "ORDER BY h.nh")
    List<Hydrotest> findAllOrderByNhAscAndCreatedAtBetween(@Param("search") String search,
                                                           @Param("createdFrom") LocalDate createdFrom,
                                                           @Param("createdTo") LocalDate createdTo);

    @Query("SELECT h FROM Hydrotest h WHERE " +
            "(:search IS NULL OR :search = '' OR LOWER(h.nh) LIKE LOWER(CONCAT(CONCAT('%', :search), '%'))) " +
            "AND (:userId IS NULL OR h.idUserCreator = :userId) " +
            "AND h.createdAt >= :createdFrom AND h.createdAt < :createdTo " +
            "ORDER BY h.nh")
    List<Hydrotest> findAllOrderByNhAscAndCreatedAtBetween(@Param("search") String search,
                                                           @Param("userId") Integer userId,
                                                           @Param("createdFrom") LocalDate createdFrom,
                                                           @Param("createdTo") LocalDate createdTo);
}
