package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "make_substitute_main", schema = "substitute")
public class MakeSubstituteMain {

    @Id
    @Column(name = "id_substitute_prepared")
    private Integer idSubstitutePrepared;

    @Column(name = "id_preform")
    private Integer idPreform;

    @Column(name = "d_preform_out", precision = 19, scale = 2)
    private BigDecimal dPreformOut;

    @Column(name = "d_preform_in", precision = 19, scale = 2)
    private BigDecimal dPreformIn;

    @Column(name = "ph", precision = 19, scale = 2)
    private BigDecimal ph;

    @Column(name = "l_preform", precision = 19, scale = 2)
    private BigDecimal lPreform;

    @Column(name = "mass_preform", precision = 19, scale = 2)
    private BigDecimal massPreform;

    @Column(name = "t_sum", precision = 19, scale = 2)
    private BigDecimal tSum;

    @Column(name = "d_substitute_out", precision = 19, scale = 2)
    private BigDecimal dSubstituteOut;

    @Column(name = "d_substitute_in", precision = 19, scale = 2)
    private BigDecimal dSubstituteIn;

    @Column(name = "l_substitute", precision = 19, scale = 2)
    private BigDecimal lSubstitute;

    @Column(name = "nm_sub1", length = 255)
    private String nmSub1;

    @Column(name = "nm_sub2", length = 255)
    private String nmSub2;

    @Column(name = "nm_sub3", length = 255)
    private String nmSub3;

    @Column(name = "nm_sub4", length = 255)
    private String nmSub4;

    @Column(name = "nm_sub5", length = 255)
    private String nmSub5;

    @Column(name = "id_user_creator")
    private Integer idUserCreator;

    public Integer getIdSubstitutePrepared() {
        return idSubstitutePrepared;
    }

    public void setIdSubstitutePrepared(Integer idSubstitutePrepared) {
        this.idSubstitutePrepared = idSubstitutePrepared;
    }

    public Integer getIdPreform() {
        return idPreform;
    }

    public void setIdPreform(Integer idPreform) {
        this.idPreform = idPreform;
    }

    public BigDecimal getDPreformOut() {
        return dPreformOut;
    }

    public void setDPreformOut(BigDecimal dPreformOut) {
        this.dPreformOut = dPreformOut;
    }

    public BigDecimal getDPreformIn() {
        return dPreformIn;
    }

    public void setDPreformIn(BigDecimal dPreformIn) {
        this.dPreformIn = dPreformIn;
    }

    public BigDecimal getPh() {
        return ph;
    }

    public void setPh(BigDecimal ph) {
        this.ph = ph;
    }

    public BigDecimal getLPreform() {
        return lPreform;
    }

    public void setLPreform(BigDecimal lPreform) {
        this.lPreform = lPreform;
    }

    public BigDecimal getMassPreform() {
        return massPreform;
    }

    public void setMassPreform(BigDecimal massPreform) {
        this.massPreform = massPreform;
    }

    public BigDecimal getTSum() {
        return tSum;
    }

    public void setTSum(BigDecimal tSum) {
        this.tSum = tSum;
    }

    public BigDecimal getDSubstituteOut() {
        return dSubstituteOut;
    }

    public void setDSubstituteOut(BigDecimal dSubstituteOut) {
        this.dSubstituteOut = dSubstituteOut;
    }

    public BigDecimal getDSubstituteIn() {
        return dSubstituteIn;
    }

    public void setDSubstituteIn(BigDecimal dSubstituteIn) {
        this.dSubstituteIn = dSubstituteIn;
    }

    public BigDecimal getLSubstitute() {
        return lSubstitute;
    }

    public void setLSubstitute(BigDecimal lSubstitute) {
        this.lSubstitute = lSubstitute;
    }

    public String getNmSub1() {
        return nmSub1;
    }

    public void setNmSub1(String nmSub1) {
        this.nmSub1 = nmSub1;
    }

    public String getNmSub2() {
        return nmSub2;
    }

    public void setNmSub2(String nmSub2) {
        this.nmSub2 = nmSub2;
    }

    public String getNmSub3() {
        return nmSub3;
    }

    public void setNmSub3(String nmSub3) {
        this.nmSub3 = nmSub3;
    }

    public String getNmSub4() {
        return nmSub4;
    }

    public void setNmSub4(String nmSub4) {
        this.nmSub4 = nmSub4;
    }

    public String getNmSub5() {
        return nmSub5;
    }

    public void setNmSub5(String nmSub5) {
        this.nmSub5 = nmSub5;
    }

    public Integer getIdUserCreator() {
        return idUserCreator;
    }

    public void setIdUserCreator(Integer idUserCreator) {
        this.idUserCreator = idUserCreator;
    }
}
