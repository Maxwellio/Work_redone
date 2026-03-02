package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import patrubki.entity.FitingDetail;

import java.util.List;

public interface FitingDetailRepository extends JpaRepository<FitingDetail, Integer> {

    List<FitingDetail> findByIdFiting_IdFitingOrderBySeqNumOperAsc(Integer idFiting);
}
