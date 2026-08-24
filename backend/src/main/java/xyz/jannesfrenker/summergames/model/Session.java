package xyz.jannesfrenker.summergames.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data @Entity @Table(name = "session")
public class Session {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true) private Long token;
    @Column(name = "id_team") private Long idTeam;
    private LocalDateTime timestamp;
}
