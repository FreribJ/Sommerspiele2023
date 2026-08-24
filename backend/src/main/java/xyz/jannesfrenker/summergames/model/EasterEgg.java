package xyz.jannesfrenker.summergames.model;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
@Data @Entity @Table(name = "easteregg")
public class EasterEgg {
    @EmbeddedId private EasterEggId id;
    private LocalDateTime timestamp;
}
