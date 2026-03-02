package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class MakeSubstituteDetailSaveDto {

    @JsonProperty("id")
    private Integer id;

    @JsonProperty("idOperations")
    private Integer idOperations;

    @JsonProperty("seqNumOper")
    private Integer seqNumOper;

    @JsonProperty("d")
    private BigDecimal d;

    @JsonProperty("l")
    private BigDecimal l;

    @JsonProperty("valueMeas")
    private BigDecimal valueMeas;

    @JsonProperty("idSubstitutePrepared")
    private Integer idSubstitutePrepared;

    @JsonProperty("i")
    private Integer i;

    @JsonProperty("depthCut")
    private BigDecimal depthCut;

    @JsonProperty("n")
    private BigDecimal n;

    @JsonProperty("s")
    private BigDecimal s;

    @JsonProperty("tMach")
    private BigDecimal tMach;

    @JsonProperty("tVp")
    private BigDecimal tVp;

    @JsonProperty("vRez")
    private BigDecimal vRez;

    @JsonProperty("masCur")
    private BigDecimal masCur;

    @JsonProperty("lCur")
    private BigDecimal lCur;

    @JsonProperty("tVpNbdt")
    private BigDecimal tVpNbdt;

    @JsonProperty("idUserCreator")
    private Integer idUserCreator;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdOperations() {
        return idOperations;
    }

    public void setIdOperations(Integer idOperations) {
        this.idOperations = idOperations;
    }

    public Integer getSeqNumOper() {
        return seqNumOper;
    }

    public void setSeqNumOper(Integer seqNumOper) {
        this.seqNumOper = seqNumOper;
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

    public BigDecimal getValueMeas() {
        return valueMeas;
    }

    public void setValueMeas(BigDecimal valueMeas) {
        this.valueMeas = valueMeas;
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

    public BigDecimal getDepthCut() {
        return depthCut;
    }

    public void setDepthCut(BigDecimal depthCut) {
        this.depthCut = depthCut;
    }

    public BigDecimal getN() {
        return n;
    }

    public void setN(BigDecimal n) {
        this.n = n;
    }

    public BigDecimal getS() {
        return s;
    }

    public void setS(BigDecimal s) {
        this.s = s;
    }

    public BigDecimal getTMach() {
        return tMach;
    }

    public void setTMach(BigDecimal tMach) {
        this.tMach = tMach;
    }

    public BigDecimal getTVp() {
        return tVp;
    }

    public void setTVp(BigDecimal tVp) {
        this.tVp = tVp;
    }

    public BigDecimal getVRez() {
        return vRez;
    }

    public void setVRez(BigDecimal vRez) {
        this.vRez = vRez;
    }

    public BigDecimal getMasCur() {
        return masCur;
    }

    public void setMasCur(BigDecimal masCur) {
        this.masCur = masCur;
    }

    public BigDecimal getLCur() {
        return lCur;
    }

    public void setLCur(BigDecimal lCur) {
        this.lCur = lCur;
    }

    public BigDecimal getTVpNbdt() {
        return tVpNbdt;
    }

    public void setTVpNbdt(BigDecimal tVpNbdt) {
        this.tVpNbdt = tVpNbdt;
    }

    public Integer getIdUserCreator() {
        return idUserCreator;
    }

    public void setIdUserCreator(Integer idUserCreator) {
        this.idUserCreator = idUserCreator;
    }
}
