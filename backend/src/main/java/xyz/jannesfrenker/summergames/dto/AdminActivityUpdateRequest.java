package xyz.jannesfrenker.summergames.dto;

public record AdminActivityUpdateRequest(Long idGame, Long idTeam1, Long idTeam2, Long idWinner, Boolean plan) {}
