package xyz.jannesfrenker.summergames.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import xyz.jannesfrenker.summergames.model.EasterEgg;
import xyz.jannesfrenker.summergames.model.EasterEggId;

import java.util.List;

public interface EasterEggRepository extends JpaRepository<EasterEgg, EasterEggId> {

    @Query("SELECT e FROM EasterEgg e WHERE e.id.idTeam = :idTeam")
    List<EasterEgg> findByIdTeam(@Param("idTeam") Long idTeam);
}
