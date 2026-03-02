package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import patrubki.entity.MakeSubstituteDetail;

import java.util.List;

public interface MakeSubstituteDetailRepository extends JpaRepository<MakeSubstituteDetail, Integer> {

    List<MakeSubstituteDetail> findByIdSubstitutePrepared_IdSubstitutePreparedOrderBySeqNumOperAsc(Integer idSubstitutePrepared);
}
