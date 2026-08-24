package xyz.jannesfrenker.summergames.model;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;
@Data @Embeddable @NoArgsConstructor @AllArgsConstructor
public class EasterEggId implements Serializable {
    @Column(name = "id") private Long id;
    @Column(name = "id_team") private Long idTeam;
}
