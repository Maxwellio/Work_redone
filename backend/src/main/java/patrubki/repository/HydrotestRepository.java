package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import patrubki.entity.Hydrotest;

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
}
