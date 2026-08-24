package xyz.jannesfrenker.summergames.model;
import jakarta.persistence.*;
import lombok.Data;
@Data @Entity @Table(name = "team")
public class Team {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String teampartner1;
    private String teampartner2;
    private Integer guess;
    @Enumerated(EnumType.STRING)
    private Clique clique;
    private String password;
    private Boolean admin;
}
