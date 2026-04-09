package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import patrubki.entity.MakeSubstituteDetail;

import java.util.Collection;
import java.util.List;

public interface MakeSubstituteDetailRepository extends JpaRepository<MakeSubstituteDetail, Integer> {

    List<MakeSubstituteDetail> findByIdSubstitutePrepared_IdSubstitutePreparedOrderBySeqNumOperAsc(Integer idSubstitutePrepared);

    @Query("SELECT d.idSubstitutePrepared.idSubstitutePrepared, COUNT(d) FROM MakeSubstituteDetail d "
            + "WHERE d.idSubstitutePrepared.idSubstitutePrepared IN :ids "
            + "GROUP BY d.idSubstitutePrepared.idSubstitutePrepared")
    List<Object[]> countGroupedBySubstitutePreparedId(@Param("ids") Collection<Integer> ids);
}
