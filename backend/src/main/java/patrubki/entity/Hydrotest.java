package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "hydrotest", schema = "substitute")
public class Hydrotest {

    @Id
    @Column(name = "id_hydrotest")
    private Integer idHydrotest;

    @Column(name = "nh", length = 255)
    private String nh;

    @Column(name = "d", precision = 19, scale = 2)
    private BigDecimal d;

    @Column(name = "l", precision = 19, scale = 2)
    private BigDecimal l;

    @Column(name = "th", precision = 19, scale = 2)
    private BigDecimal th;

    @Column(name = "testtime", precision = 19, scale = 2)
    private BigDecimal testtime;

    @Column(name = "mass", precision = 19, scale = 2)
    private BigDecimal mass;

    @Column(name = "l1", precision = 19, scale = 2)
    private BigDecimal l1;

    @Column(name = "l2", precision = 19, scale = 2)
    private BigDecimal l2;

    @Column(name = "nv", precision = 19, scale = 2)
    private BigDecimal nv;

    @Column(name = "id_user_creator")
    private Integer idUserCreator;

    public Integer getIdHydrotest() {
        return idHydrotest;
    }

    public void setIdHydrotest(Integer idHydrotest) {
        this.idHydrotest = idHydrotest;
    }

    public String getNh() {
        return nh;
    }

    public void setNh(String nh) {
        this.nh = nh;
    }

    public BigDecimal getD() {
        return d;
    }

    public void setD(BigDecimal d) {
        this.d = d;
    }

    public BigDecimal getL() {
        return l;
    }

    public void setL(BigDecimal l) {
        this.l = l;
    }

    public BigDecimal getTh() {
        return th;
    }

    public void setTh(BigDecimal th) {
        this.th = th;
    }

    public BigDecimal getTesttime() {
        return testtime;
    }

    public void setTesttime(BigDecimal testtime) {
        this.testtime = testtime;
    }

    public BigDecimal getMass() {
        return mass;
    }

    public void setMass(BigDecimal mass) {
        this.mass = mass;
    }

    public BigDecimal getL1() {
        return l1;
    }

    public void setL1(BigDecimal l1) {
        this.l1 = l1;
    }

    public BigDecimal getL2() {
        return l2;
    }

    public void setL2(BigDecimal l2) {
        this.l2 = l2;
    }

    public BigDecimal getNv() {
        return nv;
    }

    public void setNv(BigDecimal nv) {
        this.nv = nv;
    }

    public Integer getIdUserCreator() {
        return idUserCreator;
    }

    public void setIdUserCreator(Integer idUserCreator) {
        this.idUserCreator = idUserCreator;
    }
}
