package patrubki.dto;

import java.util.List;

/**
 * DTO текущего пользователя для GET /api/current-user.
 */
public class CurrentUserDto {

    private final String username;
    private final List<String> roles;
    private final Integer userId;
    private final Boolean isFirstLogin;

    public CurrentUserDto(String username, List<String> roles, Integer userId, Boolean isFirstLogin) {
        this.username = username;
        this.roles = roles != null ? List.copyOf(roles) : List.of();
        this.userId = userId;
        this.isFirstLogin = isFirstLogin;
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

    public Boolean getIsFirstLogin() {
        return isFirstLogin;
    }
}
