package xyz.jannesfrenker.summergames.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import xyz.jannesfrenker.summergames.dto.AcceptEntriesResponse;
import xyz.jannesfrenker.summergames.dto.ActivityDto;

@Service
public class ActivityBroadcastService {

    private final SimpMessagingTemplate messaging;

    public ActivityBroadcastService(SimpMessagingTemplate messaging) {
        this.messaging = messaging;
    }

    public void broadcastActivity(ActivityDto dto) {
        messaging.convertAndSend("/topic/activities", dto);
    }

    public void broadcastAcceptEntries(boolean value) {
        messaging.convertAndSend("/topic/acceptentries", new AcceptEntriesResponse(value));
    }
}
