package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import patrubki.entity.UserEntity;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    Optional<UserEntity> findByUserName(String userName);

    Optional<UserEntity> findByUserNameAndActive(String userName, Integer active);

    Optional<UserEntity> findByUserNameIgnoreCaseAndActive(String userName, Integer active);

    @Query("SELECT DISTINCT u FROM UserEntity u JOIN FETCH u.role JOIN FETCH u.org ORDER BY u.usersId")
    List<UserEntity> findAllForAdminList();
}
