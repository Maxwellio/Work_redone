package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import patrubki.entity.FitingDetail;

import java.util.Collection;
import java.util.List;

public interface FitingDetailRepository extends JpaRepository<FitingDetail, Integer> {

    List<FitingDetail> findByIdFiting_IdFitingOrderBySeqNumOperAsc(Integer idFiting);

    @Query("SELECT d.idFiting.idFiting, COUNT(d) FROM FitingDetail d "
            + "WHERE d.idFiting.idFiting IN :ids "
            + "GROUP BY d.idFiting.idFiting")
    List<Object[]> countGroupedByFitingId(@Param("ids") Collection<Integer> ids);
}
