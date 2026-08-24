package xyz.jannesfrenker.summergames.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import xyz.jannesfrenker.summergames.model.Game;

public interface GameRepository extends JpaRepository<Game, Long> {}
