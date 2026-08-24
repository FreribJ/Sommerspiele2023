package xyz.jannesfrenker.summergames.controller;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import xyz.jannesfrenker.summergames.dto.*;
import xyz.jannesfrenker.summergames.model.Session;
import xyz.jannesfrenker.summergames.model.Team;
import xyz.jannesfrenker.summergames.repository.SessionRepository;
import xyz.jannesfrenker.summergames.repository.TeamRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
@RestController
public class PublicController {
    private final TeamRepository teamRepo;
    private final SessionRepository sessionRepo;
    public PublicController(TeamRepository teamRepo, SessionRepository sessionRepo) {
        this.teamRepo = teamRepo; this.sessionRepo = sessionRepo;
    }
    @GetMapping("/teams")
    public List<TeamDto> getTeams() {
        return teamRepo.findAllByOrderByNameAsc().stream().map(TeamDto::from).toList();
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req, HttpServletResponse res) {
        if (req.id() == null || req.password() == null)
            return ResponseEntity.badRequest().body(Map.of("message","Invalid input"));
        Optional<Team> opt = teamRepo.findById(req.id());
        if (opt.isEmpty()) return ResponseEntity.status(401).body(Map.of("message","incorrect password"));
        Team team = opt.get();
        boolean unset = "UNSET".equals(team.getPassword());
        if (!unset && !team.getPassword().equals(req.password()))
            return ResponseEntity.status(401).body(Map.of("message","incorrect password"));
        if (unset) { team.setPassword(req.password()); teamRepo.save(team); }
        long token = ThreadLocalRandom.current().nextLong(1_000_000_000_000_000L);
        Session session = new Session();
        session.setToken(token); session.setIdTeam(team.getId()); session.setTimestamp(LocalDateTime.now());
        sessionRepo.save(session);
        Cookie cookie = new Cookie("login-token", String.valueOf(token));
        cookie.setPath("/"); cookie.setMaxAge(Integer.MAX_VALUE);
        res.addCookie(cookie);
        return ResponseEntity.ok(new LoginResponse(token));
    }
}
