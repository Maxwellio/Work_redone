package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class HydrotestDto {

    @JsonProperty("idHydrotest")
    private Integer idHydrotest;
    
    @JsonProperty("nh")
    private String nh;
    
    @JsonProperty("d")
    private BigDecimal d;
    
    @JsonProperty("l")
    private BigDecimal l;
    
    @JsonProperty("th")
    private BigDecimal th;
    
    @JsonProperty("testtime")
    private BigDecimal testtime;
    
    @JsonProperty("mass")
    private BigDecimal mass;
    
    @JsonProperty("l1")
    private BigDecimal l1;
    
    @JsonProperty("l2")
    private BigDecimal l2;
    
    @JsonProperty("nv")
    private BigDecimal nv;
    
    @JsonProperty("idUserCreator")
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
