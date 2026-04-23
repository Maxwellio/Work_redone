package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Подразделение / организация (таблица substitute.org_stru).
 */
@Entity
@Table(name = "org_stru", schema = "substitute")
public class OrgStru {

    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "nm", length = 1000)
    private String nm;

    @Column(name = "fullnm", length = 2000)
    private String fullnm;

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

    public String getFullnm() {
        return fullnm;
    }

    public void setFullnm(String fullnm) {
        this.fullnm = fullnm;
    }
}
