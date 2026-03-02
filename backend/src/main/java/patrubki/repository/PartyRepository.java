package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import patrubki.entity.Party;

import java.util.List;

public interface PartyRepository extends JpaRepository<Party, String> {

    @Query(value = "SELECT * FROM substitute.party ORDER BY col_party", nativeQuery = true)
    List<Party> findAllOrderByColParty();

    @Query(value = "SELECT DISTINCT col_party FROM substitute.party WHERE col_party IS NOT NULL", nativeQuery = true)
    List<String> findDistinctColPartyOrdered();
}
