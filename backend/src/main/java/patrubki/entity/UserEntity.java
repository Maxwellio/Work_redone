package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.time.LocalDate;

/**
 * Пользователь (таблица substitute.users).
 * Колонки: users_id, user_name, pwd, active, role_id, org_id, и др.
 */
@Entity
@Table(name = "users", schema = "substitute")
public class UserEntity {

    @Id
    @Column(name = "users_id")
    private Integer usersId;

    @Column(name = "user_name", nullable = false, unique = true, length = 255)
    private String userName;

    @Column(name = "pwd", nullable = false, length = 255)
    private String password;

    @Column(name = "active", nullable = false)
    private Integer active;

    @Column(name = "note", length = 1000)
    private String note;

    @Column(name = "dtenter")
    private LocalDate dtenter;

    @Column(name = "dtout")
    private LocalDate dtout;

    @Column(name = "fio", length = 500)
    private String fio;

    @Column(name = "telefon", length = 100)
    private String telefon;

    @Column(name = "is_first_login")
    private Boolean isFirstLogin;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "role_id", nullable = false)
    private RoleSpr role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    private OrgStru org;

    public Integer getUsersId() {
        return usersId;
    }

    public void setUsersId(Integer usersId) {
        this.usersId = usersId;
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

    public Integer getActive() {
        return active;
    }

    public void setActive(Integer active) {
        this.active = active;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
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

    public String getFio() {
        return fio;
    }

    public void setFio(String fio) {
        this.fio = fio;
    }

    public String getTelefon() {
        return telefon;
    }

    public void setTelefon(String telefon) {
        this.telefon = telefon;
    }

    public Boolean getIsFirstLogin() {
        return isFirstLogin;
    }

    public void setIsFirstLogin(Boolean isFirstLogin) {
        this.isFirstLogin = isFirstLogin;
    }

    public RoleSpr getRole() {
        return role;
    }

    public void setRole(RoleSpr role) {
        this.role = role;
    }

    public OrgStru getOrg() {
        return org;
    }

    public void setOrg(OrgStru org) {
        this.org = org;
    }
}
