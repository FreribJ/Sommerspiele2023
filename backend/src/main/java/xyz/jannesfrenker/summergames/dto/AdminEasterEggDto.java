package xyz.jannesfrenker.summergames.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import xyz.jannesfrenker.summergames.model.EasterEgg;

public record AdminEasterEggDto(Long id, @JsonProperty("id_team") Long idTeam) {
    public static AdminEasterEggDto from(EasterEgg e) {
        return new AdminEasterEggDto(e.getId().getId(), e.getId().getIdTeam());
    }
}
