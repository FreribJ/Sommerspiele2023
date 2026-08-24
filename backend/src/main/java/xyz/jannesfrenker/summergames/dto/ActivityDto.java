package xyz.jannesfrenker.summergames.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import xyz.jannesfrenker.summergames.model.Activity;

import java.time.LocalDateTime;

public record ActivityDto(
        Long id,
        @JsonProperty("id_game") Long idGame,
        @JsonProperty("id_team1") Long idTeam1,
        @JsonProperty("id_team2") Long idTeam2,
        @JsonProperty("id_winner") Long idWinner,
        Boolean plan,
        LocalDateTime timestamp
) {
    public static ActivityDto from(Activity a) {
        return new ActivityDto(a.getId(), a.getIdGame(), a.getIdTeam1(), a.getIdTeam2(), a.getIdWinner(), a.getPlan(), a.getTimestamp());
    }
}
