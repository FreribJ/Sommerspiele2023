package xyz.jannesfrenker.summergames.dto;

import xyz.jannesfrenker.summergames.model.Team;

public record TeamDto(Long id, String name, String partner1, String partner2, String clique, Boolean passwordSet) {
    public static TeamDto from(Team t) {
        return new TeamDto(t.getId(), t.getName(), t.getTeampartner1(), t.getTeampartner2(), t.getClique().name(), !"UNSET".equals(t.getPassword()));
    }
}
