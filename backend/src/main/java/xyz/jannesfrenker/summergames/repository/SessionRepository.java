package xyz.jannesfrenker.summergames.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import xyz.jannesfrenker.summergames.dto.SessionInfo;
import xyz.jannesfrenker.summergames.model.Session;

import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Long> {

    @Query("""
            SELECT new xyz.jannesfrenker.summergames.dto.SessionInfo(s.idTeam, t.admin, COUNT(e.id.id))
            FROM Session s
            JOIN Team t ON t.id = s.idTeam
            LEFT JOIN EasterEgg e ON e.id.idTeam = t.id
            WHERE s.token = :token
            GROUP BY s.idTeam, t.admin
            """)
    Optional<SessionInfo> findSessionInfoByToken(@Param("token") Long token);
}
