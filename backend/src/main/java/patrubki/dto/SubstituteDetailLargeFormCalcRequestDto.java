package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class SubstituteDetailLargeFormCalcRequestDto {

    @JsonProperty("idOperations")
    private Integer idOperations;

    @JsonProperty("idSubstitutePrepared")
    private Integer idSubstitutePrepared;

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

    @JsonProperty("irazm")
    private BigDecimal irazm;

    public Integer getIdOperations() {
        return idOperations;
    }

    public void setIdOperations(Integer idOperations) {
        this.idOperations = idOperations;
    }

    public Integer getIdSubstitutePrepared() {
        return idSubstitutePrepared;
    }

    public void setIdSubstitutePrepared(Integer idSubstitutePrepared) {
        this.idSubstitutePrepared = idSubstitutePrepared;
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

    public BigDecimal getIrazm() {
        return irazm;
    }

    public void setIrazm(BigDecimal irazm) {
        this.irazm = irazm;
    }
}
