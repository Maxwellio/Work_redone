package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import patrubki.entity.MakeSubstituteMain;

import java.time.LocalDate;
import java.util.List;

public interface MakeSubstituteMainRepository extends JpaRepository<MakeSubstituteMain, Integer> {

    @Query(value = "SELECT * FROM substitute.make_substitute_main m WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "(COALESCE(m.nm_sub1, '') || ' - ' || COALESCE(m.nm_sub2, '') || ' - ' || COALESCE(m.nm_sub3, '') || ' x ' || COALESCE(m.nm_sub4, '') || ' - ' || COALESCE(m.nm_sub5, '')) ILIKE '%' || :search || '%') " +
            "ORDER BY nm_sub1, nm_sub2, nm_sub3, nm_sub4, nm_sub5", nativeQuery = true)
    List<MakeSubstituteMain> findAllOrderByName(@Param("search") String search);

    @Query(value = "SELECT * FROM substitute.make_substitute_main m WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "(COALESCE(m.nm_sub1, '') || ' - ' || COALESCE(m.nm_sub2, '') || ' - ' || COALESCE(m.nm_sub3, '') || ' x ' || COALESCE(m.nm_sub4, '') || ' - ' || COALESCE(m.nm_sub5, '')) ILIKE '%' || :search || '%') " +
            "AND (:userId IS NULL OR m.id_user_creator = :userId) " +
            "ORDER BY nm_sub1, nm_sub2, nm_sub3, nm_sub4, nm_sub5", nativeQuery = true)
    List<MakeSubstituteMain> findAllOrderByName(@Param("search") String search, @Param("userId") Integer userId);

    @Query(value = "SELECT * FROM substitute.make_substitute_main m WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "(COALESCE(m.nm_sub1, '') || ' - ' || COALESCE(m.nm_sub2, '') || ' - ' || COALESCE(m.nm_sub3, '') || ' x ' || COALESCE(m.nm_sub4, '') || ' - ' || COALESCE(m.nm_sub5, '')) ILIKE '%' || :search || '%') " +
            "AND m.created_at >= :createdFrom AND m.created_at < :createdTo " +
            "ORDER BY nm_sub1, nm_sub2, nm_sub3, nm_sub4, nm_sub5", nativeQuery = true)
    List<MakeSubstituteMain> findAllOrderByNameAndCreatedAtBetween(@Param("search") String search,
                                                                   @Param("createdFrom") LocalDate createdFrom,
                                                                   @Param("createdTo") LocalDate createdTo);

    @Query(value = "SELECT * FROM substitute.make_substitute_main m WHERE " +
            "(:search IS NULL OR :search = '' OR " +
            "(COALESCE(m.nm_sub1, '') || ' - ' || COALESCE(m.nm_sub2, '') || ' - ' || COALESCE(m.nm_sub3, '') || ' x ' || COALESCE(m.nm_sub4, '') || ' - ' || COALESCE(m.nm_sub5, '')) ILIKE '%' || :search || '%') " +
            "AND (:userId IS NULL OR m.id_user_creator = :userId) " +
            "AND m.created_at >= :createdFrom AND m.created_at < :createdTo " +
            "ORDER BY nm_sub1, nm_sub2, nm_sub3, nm_sub4, nm_sub5", nativeQuery = true)
    List<MakeSubstituteMain> findAllOrderByNameAndCreatedAtBetween(@Param("search") String search,
                                                                   @Param("userId") Integer userId,
                                                                   @Param("createdFrom") LocalDate createdFrom,
                                                                   @Param("createdTo") LocalDate createdTo);
}
