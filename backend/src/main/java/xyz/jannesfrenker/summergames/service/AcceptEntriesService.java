package xyz.jannesfrenker.summergames.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicBoolean;

@Service
public class AcceptEntriesService {

    private final AtomicBoolean acceptEntries = new AtomicBoolean(false);

    public boolean isAcceptingEntries() {
        return acceptEntries.get();
    }

    public void setAcceptEntries(boolean value) {
        acceptEntries.set(value);
    }
}
