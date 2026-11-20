package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDate;

public class FitingDto {

    private Integer idFiting;

    private Integer idPreform;

    private String nmPreform;

    private String nm;

    private BigDecimal tip;

    private BigDecimal d;

    private BigDecimal th;

    private BigDecimal mass;

    private BigDecimal l;

    private BigDecimal dStan;

    private BigDecimal lPreform;

    private BigDecimal phPreform;

    private BigDecimal tSum;

    private String cnt;

    private Integer idUserCreator;

    private long transitionCount;
    @JsonProperty("createdAt")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd.MM.yyyy")
    private LocalDate createdAt;

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

    public String getNmPreform() {
        return nmPreform;
    }

    public void setNmPreform(String nmPreform) {
        this.nmPreform = nmPreform;
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

    public long getTransitionCount() {
        return transitionCount;
    }

    public void setTransitionCount(long transitionCount) {
        this.transitionCount = transitionCount;
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
}
