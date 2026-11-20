package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import patrubki.entity.MakeSubstituteMain;

import java.util.List;
import java.time.LocalDate;

public interface MakeSubstituteMainRepository extends JpaRepository<MakeSubstituteMain, Integer> {

    @Query(value = "SELECT * FROM substitute.make_substitute_main m WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "(COALESCE(m.nm_sub1, '') || '-' || COALESCE(m.nm_sub2, '') || '-' || COALESCE(m.nm_sub3, '') || '/' || COALESCE(m.nm_sub4, '') || '-' || COALESCE(m.nm_sub5, '')) ILIKE '%' || :search || '%') " +
            "ORDER BY (COALESCE(m.nm_sub1, '') || '-' || COALESCE(m.nm_sub2, '') || '-' || COALESCE(m.nm_sub3, '') || '/' || COALESCE(m.nm_sub4, '') || '-' || COALESCE(m.nm_sub5, ''))", nativeQuery = true)
    List<MakeSubstituteMain> findAllOrderByName(@Param("search") String search);

    @Query(value = "SELECT * FROM substitute.make_substitute_main m WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "(COALESCE(m.nm_sub1, '') || '-' || COALESCE(m.nm_sub2, '') || '-' || COALESCE(m.nm_sub3, '') || '/' || COALESCE(m.nm_sub4, '') || '-' || COALESCE(m.nm_sub5, '')) ILIKE '%' || :search || '%') " +
            "AND (:userId IS NULL OR m.id_user_creator = :userId) " +
            "ORDER BY (COALESCE(m.nm_sub1, '') || '-' || COALESCE(m.nm_sub2, '') || '-' || COALESCE(m.nm_sub3, '') || '/' || COALESCE(m.nm_sub4, '') || '-' || COALESCE(m.nm_sub5, ''))", nativeQuery = true)
    List<MakeSubstituteMain> findAllOrderByName(@Param("search") String search, @Param("userId") Integer userId);

    @Query(value = "SELECT * FROM substitute.make_substitute_main m WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "(COALESCE(m.nm_sub1, '') || '-' || COALESCE(m.nm_sub2, '') || '-' || COALESCE(m.nm_sub3, '') || '/' || COALESCE(m.nm_sub4, '') || '-' || COALESCE(m.nm_sub5, '')) ILIKE '%' || :search || '%') " +
            "AND m.created_at >= :createdFrom AND m.created_at < :createdTo " +
            "ORDER BY (COALESCE(m.nm_sub1, '') || '-' || COALESCE(m.nm_sub2, '') || '-' || COALESCE(m.nm_sub3, '') || '/' || COALESCE(m.nm_sub4, '') || '-' || COALESCE(m.nm_sub5, ''))", nativeQuery = true)
    List<MakeSubstituteMain> findAllOrderByNameAndCreatedAtBetween(@Param("search") String search,
                                                                   @Param("createdFrom") LocalDate createdFrom,
                                                                   @Param("createdTo") LocalDate createdTo);

    @Query(value = "SELECT * FROM substitute.make_substitute_main m WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "(COALESCE(m.nm_sub1, '') || '-' || COALESCE(m.nm_sub2, '') || '-' || COALESCE(m.nm_sub3, '') || '/' || COALESCE(m.nm_sub4, '') || '-' || COALESCE(m.nm_sub5, '')) ILIKE '%' || :search || '%') " +
            "AND (:userId IS NULL OR m.id_user_creator = :userId) " +
            "AND m.created_at >= :createdFrom AND m.created_at < :createdTo " +
            "ORDER BY (COALESCE(m.nm_sub1, '') || '-' || COALESCE(m.nm_sub2, '') || '-' || COALESCE(m.nm_sub3, '') || '/' || COALESCE(m.nm_sub4, '') || '-' || COALESCE(m.nm_sub5, ''))", nativeQuery = true)
    List<MakeSubstituteMain> findAllOrderByNameAndCreatedAtBetween(@Param("search") String search,
                                                                   @Param("userId") Integer userId,
                                                                   @Param("createdFrom") LocalDate createdFrom,
                                                                   @Param("createdTo") LocalDate createdTo);
}
