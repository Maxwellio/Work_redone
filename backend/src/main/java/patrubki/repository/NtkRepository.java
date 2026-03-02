package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import patrubki.entity.Ntk;

import java.util.List;

public interface NtkRepository extends JpaRepository<Ntk, Integer> {

    List<Ntk> findAllByOrderByIdNtkAsc();
}
