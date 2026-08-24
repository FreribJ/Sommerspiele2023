package xyz.jannesfrenker.summergames.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.jannesfrenker.summergames.model.Team;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    List<Team> findAllByOrderByNameAsc();
}
