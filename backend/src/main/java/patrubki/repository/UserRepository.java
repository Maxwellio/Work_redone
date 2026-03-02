package patrubki.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import patrubki.entity.UserEntity;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByUsernameAndActive(String username, Integer active);

    Optional<UserEntity> findByUsernameIgnoreCaseAndActive(String username, Integer active);
}
