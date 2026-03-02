package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import patrubki.entity.OperationStructureSpr;

import java.util.List;

public interface OperationStructureSprRepository extends JpaRepository<OperationStructureSpr, Integer> {

    List<OperationStructureSpr> findByIdGroupOperations_IdGroupOperationsOrderByIdOperations(Integer idGroupOperations);
}
