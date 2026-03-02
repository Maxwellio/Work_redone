package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "make_substitute_detail", schema = "substitute")
public class MakeSubstituteDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_make_substitute")
    private Integer idMakeSubstitute;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_operations")
    private OperationStructureSpr idOperations;

    @Column(name = "seq_num_oper")
    private Integer seqNumOper;

    @Column(name = "d", precision = 19, scale = 2)
    private BigDecimal d;

    @Column(name = "l", precision = 19, scale = 2)
    private BigDecimal l;

    @Column(name = "value_meas", precision = 19, scale = 2)
    private BigDecimal valueMeas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_substitute_prepared")
    private MakeSubstituteMain idSubstitutePrepared;

    @Column(name = "i")
    private Integer i;

    @Column(name = "depth_cut", precision = 19, scale = 2)
    private BigDecimal depthCut;

    @Column(name = "n", precision = 19, scale = 2)
    private BigDecimal n;

    @Column(name = "s", precision = 19, scale = 2)
    private BigDecimal s;

    @Column(name = "t_mach", precision = 19, scale = 2)
    private BigDecimal tMach;

    @Column(name = "t_vp", precision = 19, scale = 2)
    private BigDecimal tVp;

    @Column(name = "v_rez", precision = 19, scale = 2)
    private BigDecimal vRez;

    @Column(name = "mas_cur", precision = 19, scale = 2)
    private BigDecimal masCur;

    @Column(name = "l_cur", precision = 19, scale = 2)
    private BigDecimal lCur;

    @Column(name = "t_vp_nbdt", precision = 19, scale = 2)
    private BigDecimal tVpNbdt;

    @Column(name = "id_user_creator")
    private Integer idUserCreator;

    public Integer getIdMakeSubstitute() {
        return idMakeSubstitute;
    }

    public void setIdMakeSubstitute(Integer idMakeSubstitute) {
        this.idMakeSubstitute = idMakeSubstitute;
    }

    public OperationStructureSpr getIdOperations() {
        return idOperations;
    }

    public void setIdOperations(OperationStructureSpr idOperations) {
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

    public MakeSubstituteMain getIdSubstitutePrepared() {
        return idSubstitutePrepared;
    }

    public void setIdSubstitutePrepared(MakeSubstituteMain idSubstitutePrepared) {
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
