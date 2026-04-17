package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;

public class FitingDetailLargeFormCalcRequestDto {

    @JsonProperty("idOperations")
    private Integer idOperations;

    @JsonProperty("idFiting")
    private Integer idFiting;

    @JsonProperty("i")
    private Integer i;

    @JsonProperty("s")
    private BigDecimal s;

    @JsonProperty("d")
    private BigDecimal d;

    @JsonProperty("n")
    private BigDecimal n;

    @JsonProperty("l")
    private BigDecimal l;

    @JsonProperty("valueMeas")
    private BigDecimal valueMeas;

    @JsonProperty("ph")
    private BigDecimal ph;

    @JsonProperty("dStan")
    private BigDecimal dStan;

    @JsonProperty("irazm")
    private BigDecimal irazm;

    @JsonProperty("idNtk")
    private List<Integer> idNtk;

    public Integer getIdOperations() {
        return idOperations;
    }

    public void setIdOperations(Integer idOperations) {
        this.idOperations = idOperations;
    }

    public Integer getIdFiting() {
        return idFiting;
    }

    public void setIdFiting(Integer idFiting) {
        this.idFiting = idFiting;
    }

    public Integer getI() {
        return i;
    }

    public void setI(Integer i) {
        this.i = i;
    }

    public BigDecimal getS() {
        return s;
    }

    public void setS(BigDecimal s) {
        this.s = s;
    }

    public BigDecimal getD() {
        return d;
    }

    public void setD(BigDecimal d) {
        this.d = d;
    }

    public BigDecimal getN() {
        return n;
    }

    public void setN(BigDecimal n) {
        this.n = n;
    }

    public BigDecimal getL() {
        return l;
    }

    public void setL(BigDecimal l) {
        this.l = l;
    }

    public BigDecimal getValueMeas() {
        return valueMeas;
    }

    public void setValueMeas(BigDecimal valueMeas) {
        this.valueMeas = valueMeas;
    }

    public BigDecimal getPh() {
        return ph;
    }

    public void setPh(BigDecimal ph) {
        this.ph = ph;
    }

    public BigDecimal getDStan() {
        return dStan;
    }

    public void setDStan(BigDecimal dStan) {
        this.dStan = dStan;
    }

    public BigDecimal getIrazm() {
        return irazm;
    }

    public void setIrazm(BigDecimal irazm) {
        this.irazm = irazm;
    }

    public List<Integer> getIdNtk() {
        return idNtk;
    }

    public void setIdNtk(List<Integer> idNtk) {
        this.idNtk = idNtk;
    }
}
