package xyz.jannesfrenker.summergames.controller;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.jannesfrenker.summergames.dto.*;
import xyz.jannesfrenker.summergames.model.*;
import xyz.jannesfrenker.summergames.repository.*;
import xyz.jannesfrenker.summergames.service.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
@RestController
public class PrivateController {
    private final TeamRepository teamRepo;
    private final GameRepository gameRepo;
    private final ActivityRepository activityRepo;
    private final EasterEggRepository eggRepo;
    private final AcceptEntriesService acceptEntries;
    private final ActivityBroadcastService broadcast;
    public PrivateController(TeamRepository teamRepo, GameRepository gameRepo,
            ActivityRepository activityRepo, EasterEggRepository eggRepo,
            AcceptEntriesService acceptEntries, ActivityBroadcastService broadcast) {
        this.teamRepo = teamRepo; this.gameRepo = gameRepo; this.activityRepo = activityRepo;
        this.eggRepo = eggRepo; this.acceptEntries = acceptEntries; this.broadcast = broadcast;
    }
    private SessionInfo session(HttpServletRequest req) {
        return (SessionInfo) req.getAttribute("sessionInfo");
    }
    @GetMapping("/checkLogin")
    public CheckLoginResponse checkLogin(HttpServletRequest req) {
        SessionInfo s = session(req);
        return new CheckLoginResponse(true, s.admin(), s.easterEggCount());
    }
    @GetMapping("/team")
    public ResponseEntity<?> getTeam(HttpServletRequest req) {
        return teamRepo.findById(session(req).idTeam())
            .map(t -> ResponseEntity.ok(TeamDto.from(t)))
            .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/games")
    public List<Game> getGames() { return gameRepo.findAll(); }
    @GetMapping("/activities")
    public ActivitiesResponse getActivities(HttpServletRequest req) {
        Long id = session(req).idTeam();
        List<ActivityDto> list = activityRepo.findByIdTeam1OrIdTeam2OrderByTimestampDesc(id, id)
            .stream().map(ActivityDto::from).toList();
        return new ActivitiesResponse(System.currentTimeMillis(), list);
    }
    @PostMapping("/activity")
    public ResponseEntity<?> createActivity(@RequestBody ActivityCreateRequest req, HttpServletRequest httpReq) {
        if (!acceptEntries.get()) return ResponseEntity.status(403).body(Map.of("message","Entries are closed"));
        Long teamId = session(httpReq).idTeam();
        Long winner = "won".equals(req.state()) ? teamId : req.opponentId();
        Activity a = new Activity();
        a.setIdGame(req.gameId()); a.setIdTeam1(teamId); a.setIdTeam2(req.opponentId());
        a.setIdWinner(winner); a.setPlan(false); a.setTimestamp(LocalDateTime.now());
        Activity saved = activityRepo.save(a);
        broadcast.broadcastActivity(ActivityDto.from(saved));
        return ResponseEntity.ok(ActivityDto.from(saved));
    }
    @PutMapping("/activity/{id}")
    public ResponseEntity<?> updateActivity(@PathVariable Long id, @RequestBody ActivityUpdateRequest req, HttpServletRequest httpReq) {
        if (!acceptEntries.get()) return ResponseEntity.status(403).body(Map.of("message","Entries are closed"));
        Long teamId = session(httpReq).idTeam();
        Optional<Activity> opt = activityRepo.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Activity a = opt.get();
        boolean belongs = teamId.equals(a.getIdTeam1()) || teamId.equals(a.getIdTeam2());
        if (!a.getPlan() || a.getIdWinner() != null || !belongs)
            return ResponseEntity.status(409).body(Map.of("message","Plan already filled out or not a plan at all"));
        a.setIdWinner(req.winnerId()); a.setTimestamp(LocalDateTime.now());
        Activity saved = activityRepo.save(a);
        broadcast.broadcastActivity(ActivityDto.from(saved));
        return ResponseEntity.ok(ActivityDto.from(saved));
    }
    @GetMapping("/guess")
    public ResponseEntity<?> getGuess(HttpServletRequest req) {
        return teamRepo.findById(session(req).idTeam())
            .map(t -> ResponseEntity.ok(t.getGuess())).orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/guess")
    public ResponseEntity<?> updateGuess(@RequestBody GuessRequest req, HttpServletRequest httpReq) {
        if (!acceptEntries.get()) return ResponseEntity.status(403).body(Map.of("message","Entries are closed"));
        teamRepo.findById(session(httpReq).idTeam()).ifPresent(t -> { t.setGuess(req.guess()); teamRepo.save(t); });
        return ResponseEntity.ok(req.guess());
    }
    @GetMapping("/eastereggs")
    public List<EasterEggFoundDto> getEasterEggs(HttpServletRequest req) {
        return eggRepo.findByIdTeam(session(req).idTeam())
            .stream().map(e -> new EasterEggFoundDto(e.getId().getId())).toList();
    }
    @PostMapping("/easteregg")
    public ResponseEntity<?> createEasterEgg(@RequestBody EasterEggRequest req, HttpServletRequest httpReq) {
        EasterEggId eggId = new EasterEggId(req.id(), session(httpReq).idTeam());
        if (eggRepo.existsById(eggId)) return ResponseEntity.status(409).body(Map.of("message","EasterEgg already found"));
        EasterEgg egg = new EasterEgg(); egg.setId(eggId); egg.setTimestamp(LocalDateTime.now());
        return ResponseEntity.ok(eggRepo.save(egg));
    }
    @PutMapping("/team/update")
    public ResponseEntity<?> updateTeam(@RequestBody TeamUpdateRequest req, HttpServletRequest httpReq) {
        if (req.updatedTeamName() == null) return ResponseEntity.badRequest().body(Map.of("message","Invalid input"));
        teamRepo.findById(session(httpReq).idTeam()).ifPresent(t -> {
            t.setName(req.updatedTeamName()); t.setTeampartner1(req.updatedTeamMate1()); t.setTeampartner2(req.updatedTeamMate2());
            teamRepo.save(t);
        });
        return ResponseEntity.ok().build();
    }
}
