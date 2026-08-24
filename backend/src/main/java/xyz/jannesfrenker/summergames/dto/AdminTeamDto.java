package xyz.jannesfrenker.summergames.dto;

import xyz.jannesfrenker.summergames.model.Team;

public record AdminTeamDto(Long id, String name, String partner1, String partner2, String clique, String password) {
    public static AdminTeamDto from(Team t) {
        return new AdminTeamDto(t.getId(), t.getName(), t.getTeampartner1(), t.getTeampartner2(), t.getClique().name(), t.getPassword());
    }
}
