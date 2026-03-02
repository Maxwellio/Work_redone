package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

/**
 * Тело запроса для добавления/редактирования переводника (вызов процедуры БД).
 * id = null для добавления, id задан — для редактирования.
 */
public class SubstituteSaveDto {

    @JsonProperty("id")
    private Integer id;
    
    @JsonProperty("nmSub1")
    private String nmSub1;
    
    @JsonProperty("nmSub2")
    private String nmSub2;
    
    @JsonProperty("nmSub3")
    private String nmSub3;
    
    @JsonProperty("nmSub4")
    private String nmSub4;
    
    @JsonProperty("nmSub5")
    private String nmSub5;
    
    @JsonProperty("dSubstituteOut")
    private BigDecimal dSubstituteOut;
    
    @JsonProperty("dSubstituteIn")
    private BigDecimal dSubstituteIn;
    
    @JsonProperty("lSubstitute")
    private BigDecimal lSubstitute;
    
    @JsonProperty("idPreform")
    private Integer idPreform;
    
    @JsonProperty("dPreformOut")
    private BigDecimal dPreformOut;
    
    @JsonProperty("dPreformIn")
    private BigDecimal dPreformIn;
    
    @JsonProperty("lPreform")
    private BigDecimal lPreform;
    
    @JsonProperty("ph")
    private BigDecimal ph;
    
    @JsonProperty("massPreform")
    private BigDecimal massPreform;

    @JsonProperty("idUserCreator")
    private Integer idUserCreator;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public BigDecimal getLPreform() {
        return lPreform;
    }

    public void setLPreform(BigDecimal lPreform) {
        this.lPreform = lPreform;
    }

    public BigDecimal getPh() {
        return ph;
    }

    public void setPh(BigDecimal ph) {
        this.ph = ph;
    }

    public BigDecimal getMassPreform() {
        return massPreform;
    }

    public void setMassPreform(BigDecimal massPreform) {
        this.massPreform = massPreform;
    }

    public Integer getIdUserCreator() {
        return idUserCreator;
    }

    public void setIdUserCreator(Integer idUserCreator) {
        this.idUserCreator = idUserCreator;
    }
}
