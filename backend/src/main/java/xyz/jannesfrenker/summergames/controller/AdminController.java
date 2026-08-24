package xyz.jannesfrenker.summergames.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.jannesfrenker.summergames.dto.*;
import xyz.jannesfrenker.summergames.model.Activity;
import xyz.jannesfrenker.summergames.repository.*;
import xyz.jannesfrenker.summergames.service.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/admin")
public class AdminController {
    private final TeamRepository teamRepo;
    private final ActivityRepository activityRepo;
    private final EasterEggRepository eggRepo;
    private final AcceptEntriesService acceptEntries;
    private final ActivityBroadcastService broadcast;
    public AdminController(TeamRepository teamRepo, ActivityRepository activityRepo,
            EasterEggRepository eggRepo, AcceptEntriesService acceptEntries, ActivityBroadcastService broadcast) {
        this.teamRepo = teamRepo; this.activityRepo = activityRepo; this.eggRepo = eggRepo;
        this.acceptEntries = acceptEntries; this.broadcast = broadcast;
    }
    @GetMapping("/guess")
    public List<AdminGuessDto> getGuesses() {
        return teamRepo.findAll().stream().map(t -> new AdminGuessDto(t.getId(), t.getGuess())).toList();
    }
    @GetMapping("/teams")
    public List<AdminTeamDto> getTeams() {
        return teamRepo.findAll().stream().map(AdminTeamDto::from).toList();
    }
    @GetMapping("/eastereggs")
    public List<AdminEasterEggDto> getEasterEggs() {
        return eggRepo.findAll().stream().map(AdminEasterEggDto::from).toList();
    }
    @GetMapping("/activities")
    public List<ActivityDto> getActivities() {
        return activityRepo.findAllByOrderByTimestampDesc().stream().map(ActivityDto::from).toList();
    }
    @GetMapping("/activity/{id}")
    public ResponseEntity<ActivityDto> getActivity(@PathVariable Long id) {
        return activityRepo.findById(id).map(a -> ResponseEntity.ok(ActivityDto.from(a)))
            .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/activity/{id}")
    public ResponseEntity<?> updateActivity(@PathVariable Long id, @RequestBody AdminActivityUpdateRequest req) {
        Optional<Activity> opt = activityRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Activity a = opt.get();
        a.setIdGame(req.gameId()); a.setIdTeam1(req.team1Id()); a.setIdTeam2(req.team2Id());
        a.setIdWinner(req.winnerId());
        a.setTimestamp(req.winnerId() == null ? null : LocalDateTime.now());
        Activity saved = activityRepo.save(a);
        broadcast.broadcastActivity(ActivityDto.from(saved));
        return ResponseEntity.ok(ActivityDto.from(saved));
    }
    @DeleteMapping("/activity/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long id) {
        int deleted = activityRepo.deleteByIdAndPlanFalse(id);
        if (deleted == 0) return ResponseEntity.status(409).body(Map.of("message","Not found or is a plan"));
        return ResponseEntity.ok().build();
    }
    @GetMapping("/acceptentries")
    public AcceptEntriesResponse getAcceptEntries() {
        return new AcceptEntriesResponse(acceptEntries.get());
    }
    @PutMapping("/acceptentries")
    public AcceptEntriesResponse updateAcceptEntries(@RequestBody AcceptEntriesRequest req) {
        boolean val = acceptEntries.set(req.acceptEntries());
        broadcast.broadcastAcceptEntries(val);
        return new AcceptEntriesResponse(val);
    }
}
