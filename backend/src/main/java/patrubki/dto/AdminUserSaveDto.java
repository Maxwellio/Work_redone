package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public class AdminUserSaveDto {

    @JsonProperty("usersId")
    private Integer usersId;

    @JsonProperty("roleId")
    private Integer roleId;

    @JsonProperty("orgId")
    private Integer orgId;

    @JsonProperty("fio")
    private String fio;

    @JsonProperty("userName")
    private String userName;

    @JsonProperty("password")
    private String password;

    @JsonProperty("telefon")
    private String telefon;

    @JsonProperty("dtenter")
    private LocalDate dtenter;

    @JsonProperty("dtout")
    private LocalDate dtout;

    @JsonProperty("note")
    private String note;

    @JsonProperty("active")
    private Boolean active;

    @JsonProperty("isFirstLogin")
    private Boolean isFirstLogin;

    public Integer getUsersId() {
        return usersId;
    }

    public void setUsersId(Integer usersId) {
        this.usersId = usersId;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public Integer getOrgId() {
        return orgId;
    }

    public void setOrgId(Integer orgId) {
        this.orgId = orgId;
    }

    public String getFio() {
        return fio;
    }

    public void setFio(String fio) {
        this.fio = fio;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public LocalDate getDtenter() {
        return dtenter;
    }

    public void setDtenter(LocalDate dtenter) {
        this.dtenter = dtenter;
    }

    public LocalDate getDtout() {
        return dtout;
    }

    public void setDtout(LocalDate dtout) {
        this.dtout = dtout;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Boolean getIsFirstLogin() {
        return isFirstLogin;
    }

    public void setIsFirstLogin(Boolean isFirstLogin) {
        this.isFirstLogin = isFirstLogin;
    }
}
