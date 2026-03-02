package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "ntk", schema = "substitute")
public class Ntk {

    @Id
    @Column(name = "id_ntk")
    private Integer idNtk;

    @Column(name = "nm", length = 255)
    private String nm;

    @Column(name = "d", precision = 19, scale = 2)
    private BigDecimal d;

    @Column(name = "ntk", precision = 19, scale = 2)
    private BigDecimal ntk;

    @Column(name = "poz", precision = 19, scale = 2)
    private BigDecimal poz;

    @Column(name = "ind", length = 255)
    private String ind;

    public Integer getIdNtk() {
        return idNtk;
    }

    public void setIdNtk(Integer idNtk) {
        this.idNtk = idNtk;
    }

    public String getNm() {
        return nm;
    }

    public void setNm(String nm) {
        this.nm = nm;
    }

    public BigDecimal getD() {
        return d;
    }

    public void setD(BigDecimal d) {
        this.d = d;
    }

    public BigDecimal getNtk() {
        return ntk;
    }

    public void setNtk(BigDecimal ntk) {
        this.ntk = ntk;
    }

    public BigDecimal getPoz() {
        return poz;
    }

    public void setPoz(BigDecimal poz) {
        this.poz = poz;
    }

    public String getInd() {
        return ind;
    }

    public void setInd(String ind) {
        this.ind = ind;
    }
}
