package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

/**
 * Элемент списка пользователей для админ-панели (без пароля, без названий org_stru).
 */
public class AdminUserListItemDto {

    @JsonProperty("usersId")
    private final Integer usersId;

    @JsonProperty("orgId")
    private final Integer orgId;

    @JsonProperty("roleId")
    private final Integer roleId;

    @JsonProperty("roleName")
    private final String roleName;

    @JsonProperty("note")
    private final String note;

    @JsonProperty("active")
    private final Integer active;

    @JsonProperty("dtenter")
    private final LocalDate dtenter;

    @JsonProperty("dtout")
    private final LocalDate dtout;

    @JsonProperty("mail")
    private final String mail;

    @JsonProperty("userName")
    private final String userName;

    @JsonProperty("fio")
    private final String fio;

    @JsonProperty("telefon")
    private final String telefon;

    @JsonProperty("isFirstLogin")
    private final Boolean isFirstLogin;

    public AdminUserListItemDto(
            Integer usersId,
            Integer orgId,
            Integer roleId,
            String roleName,
            String note,
            Integer active,
            LocalDate dtenter,
            LocalDate dtout,
            String mail,
            String userName,
            String fio,
            String telefon,
            Boolean isFirstLogin) {
        this.usersId = usersId;
        this.orgId = orgId;
        this.roleId = roleId;
        this.roleName = roleName;
        this.note = note;
        this.active = active;
        this.dtenter = dtenter;
        this.dtout = dtout;
        this.mail = mail;
        this.userName = userName;
        this.fio = fio;
        this.telefon = telefon;
        this.isFirstLogin = isFirstLogin;
    }

    public Integer getUsersId() {
        return usersId;
    }

    public Integer getOrgId() {
        return orgId;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public String getNote() {
        return note;
    }

    public Integer getActive() {
        return active;
    }

    public LocalDate getDtenter() {
        return dtenter;
    }

    public LocalDate getDtout() {
        return dtout;
    }

    public String getMail() {
        return mail;
    }

    public String getUserName() {
        return userName;
    }

    public String getFio() {
        return fio;
    }

    public String getTelefon() {
        return telefon;
    }

    public Boolean getIsFirstLogin() {
        return isFirstLogin;
    }
}
