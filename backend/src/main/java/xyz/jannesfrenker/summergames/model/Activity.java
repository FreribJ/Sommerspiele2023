package xyz.jannesfrenker.summergames.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data @Entity @Table(name = "activity")
public class Activity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "id_game") private Long idGame;
    @Column(name = "id_team1") private Long idTeam1;
    @Column(name = "id_team2") private Long idTeam2;
    @Column(name = "id_winner") private Long idWinner;
    private Boolean plan;
    private LocalDateTime timestamp;
}
