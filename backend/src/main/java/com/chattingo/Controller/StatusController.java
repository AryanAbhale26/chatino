package com.chattingo.Controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chattingo.Exception.UserException;
import com.chattingo.Model.Status;
import com.chattingo.Model.User;
import com.chattingo.Repository.StatusRepository;
import com.chattingo.Service.UserService;

@RestController
@RequestMapping("/api/status")
public class StatusController {

    @Autowired
    private StatusRepository statusRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/create")
    public ResponseEntity<Status> createStatusHandler(
            @RequestBody Status status,
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfile(jwt);

        status.setUser(user);
        status.setCreatedAt(LocalDateTime.now());

        Status savedStatus = statusRepository.save(status);

        return new ResponseEntity<>(savedStatus, HttpStatus.CREATED);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Status>> getMyStatusHandler(
            @RequestHeader("Authorization") String jwt) throws UserException {

        User user = userService.findUserProfile(jwt);
        List<Status> statuses = statusRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        return new ResponseEntity<>(statuses, HttpStatus.OK);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentStatusesHandler(
            @RequestHeader("Authorization") String jwt) throws UserException {

        User currentUser = userService.findUserProfile(jwt);
        List<Status> allStatuses = statusRepository.findAllByOrderByCreatedAtDesc();

        // Group statuses by user, excluding current user
        Map<Integer, Map<String, Object>> userStatusMap = new HashMap<>();

        for (Status s : allStatuses) {
            User author = s.getUser();
            if (author != null && author.getId() != currentUser.getId()) {
                if (!userStatusMap.containsKey(author.getId())) {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("userId", String.valueOf(author.getId()));
                    entry.put("userName", author.getName());
                    entry.put("userAvatar", author.getProfile());
                    entry.put("updatedAt", s.getCreatedAt().toString());
                    entry.put("stories", new ArrayList<Map<String, Object>>());
                    userStatusMap.put(author.getId(), entry);
                }

                @SuppressWarnings("unchecked")
                List<Map<String, Object>> stories = (List<Map<String, Object>>) userStatusMap.get(author.getId()).get("stories");
                Map<String, Object> storyItem = new HashMap<>();
                storyItem.put("id", String.valueOf(s.getId()));
                storyItem.put("image", s.getImage());
                storyItem.put("caption", s.getCaption());
                storyItem.put("timestamp", s.getCreatedAt().toString());
                stories.add(storyItem);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>(userStatusMap.values());
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Status>> getUserStatusesHandler(
            @PathVariable("userId") Integer userId) {

        List<Status> statuses = statusRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return new ResponseEntity<>(statuses, HttpStatus.OK);
    }
}
