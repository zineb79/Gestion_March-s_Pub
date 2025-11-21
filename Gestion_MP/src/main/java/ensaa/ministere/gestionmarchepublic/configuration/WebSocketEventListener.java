package ensaa.ministere.gestionmarchepublic.configuration;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {

    private final SimpMessagingTemplate messagingTemplate;
    @Getter
    private final Set<String> connectedUsers = ConcurrentHashMap.newKeySet();

    @Autowired
    public WebSocketEventListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = Objects.requireNonNull(accessor.getUser()).getName();  // nécessite que tu utilises Spring Security
        connectedUsers.add(username);

        // Envoie la liste des utilisateurs connectés aux abonnés
        messagingTemplate.convertAndSend("/topic/activeUsers", connectedUsers);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = accessor.getUser() != null ? accessor.getUser().getName() : null;

        if (username != null) {
            connectedUsers.remove(username);
            messagingTemplate.convertAndSend("/topic/activeUsers", connectedUsers);
        }
    }

}
