package xyz.jannesfrenker.summergames.dto;

import java.util.List;

public record ActivitiesResponse(Long idTeam, List<ActivityDto> activities) {}
