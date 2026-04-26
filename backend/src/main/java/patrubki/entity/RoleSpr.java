package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Справочник ролей (таблица substitute.spr_role).
 */
@Entity
@Table(name = "spr_role", schema = "substitute")
public class RoleSpr {

    @Id
    @Column(name = "role_id")
    private Integer id;

    @Column(name = "nm", nullable = false, length = 255)
    private String nm;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNm() {
        return nm;
    }

    public void setNm(String nm) {
        this.nm = nm;
    }
}
