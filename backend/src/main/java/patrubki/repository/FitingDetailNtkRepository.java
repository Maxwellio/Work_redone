package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import patrubki.entity.FitingDetailNtk;
import patrubki.entity.FitingDetailNtkId;

import java.util.List;

public interface FitingDetailNtkRepository extends JpaRepository<FitingDetailNtk, FitingDetailNtkId> {

    List<FitingDetailNtk> findByIdFitingDetailOrderByIdNtkAsc(Integer idFitingDetail);

    void deleteByIdFitingDetailAndIdNtk(Integer idFitingDetail, Integer idNtk);

    boolean existsByIdFitingDetailAndIdNtk(Integer idFitingDetail, Integer idNtk);
}
