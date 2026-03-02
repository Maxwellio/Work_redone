package patrubki.dto;

import java.util.List;

/**
 * DTO текущего пользователя для GET /api/current-user.
 */
public class CurrentUserDto {

    private final String username;
    private final List<String> roles;
    private final Integer userId;

    public CurrentUserDto(String username, List<String> roles, Integer userId) {
        this.username = username;
        this.roles = roles != null ? List.copyOf(roles) : List.of();
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public Integer getUserId() {
        return userId;
    }
}
