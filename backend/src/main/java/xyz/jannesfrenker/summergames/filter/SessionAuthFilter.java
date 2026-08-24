package xyz.jannesfrenker.summergames.filter;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import xyz.jannesfrenker.summergames.dto.SessionInfo;
import xyz.jannesfrenker.summergames.repository.SessionRepository;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Order(1)
@Component
public class SessionAuthFilter extends OncePerRequestFilter {

    private static final String COOKIE_NAME = "login-token";
    private static final List<String> PUBLIC_PATHS = List.of("/login", "/teams");

    private final SessionRepository sessionRepository;

    public SessionAuthFilter(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String path = req.getRequestURI();
        if (PUBLIC_PATHS.contains(path) || path.startsWith("/ws")) {
            chain.doFilter(req, res);
            return;
        }
        String tokenStr = extractCookie(req, COOKIE_NAME);
        if (tokenStr == null) {
            sendError(res, 401, "Unauthorized");
            return;
        }
        long token;
        try {
            token = Long.parseLong(tokenStr);
        } catch (NumberFormatException e) {
            sendError(res, 401, "Unauthorized");
            return;
        }
        Optional<SessionInfo> info = sessionRepository.findSessionInfoByToken(token);
        if (info.isEmpty()) {
            sendError(res, 401, "Unauthorized");
            return;
        }
        if (path.startsWith("/admin") && !Boolean.TRUE.equals(info.get().admin())) {
            sendError(res, 401, "Forbidden");
            return;
        }
        req.setAttribute("sessionInfo", info.get());
        chain.doFilter(req, res);
    }

    private String extractCookie(HttpServletRequest req, String name) {
        Cookie[] cookies = req.getCookies();
        if (cookies == null) return null;
        return Arrays.stream(cookies)
                .filter(c -> name.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    private void sendError(HttpServletResponse res, int status, String message) throws IOException {
        res.setStatus(status);
        res.setContentType("application/json");
        res.getWriter().write("{\"message\":\"" + message + "\"}");
    }
}
