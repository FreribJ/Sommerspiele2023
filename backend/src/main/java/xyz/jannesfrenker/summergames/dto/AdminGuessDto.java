package xyz.jannesfrenker.summergames.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AdminGuessDto(@JsonProperty("id_team") Long idTeam, Integer guess) {}
