package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "fiting", schema = "substitute")
public class Fiting {

    @Id
    @Column(name = "id_fiting")
    private Integer idFiting;

    @Column(name = "id_preform")
    private Integer idPreform;

    @Column(name = "nm", length = 255)
    private String nm;

    @Column(name = "tip", precision = 19, scale = 2)
    private BigDecimal tip;

    @Column(name = "d", precision = 19, scale = 2)
    private BigDecimal d;

    @Column(name = "th", precision = 19, scale = 2)
    private BigDecimal th;

    @Column(name = "mass", precision = 19, scale = 2)
    private BigDecimal mass;

    @Column(name = "l", precision = 19, scale = 2)
    private BigDecimal l;

    @Column(name = "d_stan", precision = 19, scale = 2)
    private BigDecimal dStan;

    @Column(name = "l_preform", precision = 19, scale = 2)
    private BigDecimal lPreform;

    @Column(name = "ph_preform", precision = 19, scale = 2)
    private BigDecimal phPreform;

    @Column(name = "t_sum", precision = 19, scale = 2)
    private BigDecimal tSum;

    @Column(name = "cnt", length = 255)
    private String cnt;

    @Column(name = "id_user_creator")
    private Integer idUserCreator;

    public Integer getIdFiting() {
        return idFiting;
    }

    public void setIdFiting(Integer idFiting) {
        this.idFiting = idFiting;
    }

    public Integer getIdPreform() {
        return idPreform;
    }

    public void setIdPreform(Integer idPreform) {
        this.idPreform = idPreform;
    }

    public String getNm() {
        return nm;
    }

    public void setNm(String nm) {
        this.nm = nm;
    }

    public BigDecimal getTip() {
        return tip;
    }

    public void setTip(BigDecimal tip) {
        this.tip = tip;
    }

    public BigDecimal getD() {
        return d;
    }

    public void setD(BigDecimal d) {
        this.d = d;
    }

    public BigDecimal getTh() {
        return th;
    }

    public void setTh(BigDecimal th) {
        this.th = th;
    }

    public BigDecimal getMass() {
        return mass;
    }

    public void setMass(BigDecimal mass) {
        this.mass = mass;
    }

    public BigDecimal getL() {
        return l;
    }

    public void setL(BigDecimal l) {
        this.l = l;
    }

    public BigDecimal getDStan() {
        return dStan;
    }

    public void setDStan(BigDecimal dStan) {
        this.dStan = dStan;
    }

    public BigDecimal getLPreform() {
        return lPreform;
    }

    public void setLPreform(BigDecimal lPreform) {
        this.lPreform = lPreform;
    }

    public BigDecimal getPhPreform() {
        return phPreform;
    }

    public void setPhPreform(BigDecimal phPreform) {
        this.phPreform = phPreform;
    }

    public BigDecimal getTSum() {
        return tSum;
    }

    public void setTSum(BigDecimal tSum) {
        this.tSum = tSum;
    }

    public String getCnt() {
        return cnt;
    }

    public void setCnt(String cnt) {
        this.cnt = cnt;
    }

    public Integer getIdUserCreator() {
        return idUserCreator;
    }

    public void setIdUserCreator(Integer idUserCreator) {
        this.idUserCreator = idUserCreator;
    }
}
