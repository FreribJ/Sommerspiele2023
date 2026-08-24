package xyz.jannesfrenker.summergames.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import xyz.jannesfrenker.summergames.model.Activity;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByIdTeam1OrIdTeam2OrderByTimestampDesc(Long idTeam1, Long idTeam2);

    List<Activity> findAllByOrderByTimestampDesc();

    @Modifying
    @Transactional
    @Query("DELETE FROM Activity a WHERE a.id = :id AND a.plan = false")
    int deleteByIdAndPlanFalse(@Param("id") Long id);
}
