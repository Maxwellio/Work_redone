package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "preform_typ", schema = "substitute")
public class PreformTyp {

    @Id
    @Column(name = "id_preform")
    private Integer idPreform;

    @Column(name = "nm_preform", length = 255)
    private String nmPreform;

    public Integer getIdPreform() {
        return idPreform;
    }

    public void setIdPreform(Integer idPreform) {
        this.idPreform = idPreform;
    }

    public String getNmPreform() {
        return nmPreform;
    }

    public void setNmPreform(String nmPreform) {
        this.nmPreform = nmPreform;
    }
}
