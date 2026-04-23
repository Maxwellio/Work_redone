package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import patrubki.entity.OrgStru;

import java.util.List;

public interface OrgStruRepository extends JpaRepository<OrgStru, Integer> {

    List<OrgStru> findByIdInOrderByIdAsc(Iterable<Integer> ids);
}
