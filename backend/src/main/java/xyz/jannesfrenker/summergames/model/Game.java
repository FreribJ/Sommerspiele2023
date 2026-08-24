package xyz.jannesfrenker.summergames.model;
import jakarta.persistence.*;
import lombok.Data;
@Data @Entity @Table(name = "game")
public class Game {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
}
