package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

/**
 * Тело запроса для добавления/редактирования патрубка или трубы (вызов процедуры БД).
 * id = null для добавления, id задан — для редактирования.
 */
public class FitingSaveDto {

    @JsonProperty("id")
    private Integer id;

    @JsonProperty("tip")
    private Integer tip;

    @JsonProperty("nm")
    private String nm;

    @JsonProperty("d")
    private BigDecimal d;

    @JsonProperty("th")
    private BigDecimal th;

    @JsonProperty("l")
    private BigDecimal l;

    @JsonProperty("mass")
    private BigDecimal mass;

    @JsonProperty("idPreform")
    private Integer idPreform;

    @JsonProperty("lPreform")
    private BigDecimal lPreform;

    @JsonProperty("phPreform")
    private BigDecimal phPreform;

    @JsonProperty("dStan")
    private BigDecimal dStan;

    @JsonProperty("cnt")
    private String cnt;

    @JsonProperty("idUserCreator")
    private Integer idUserCreator;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTip() {
        return tip;
    }

    public void setTip(Integer tip) {
        this.tip = tip;
    }

    public String getNm() {
        return nm;
    }

    public void setNm(String nm) {
        this.nm = nm;
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

    public BigDecimal getL() {
        return l;
    }

    public void setL(BigDecimal l) {
        this.l = l;
    }

    public BigDecimal getMass() {
        return mass;
    }

    public void setMass(BigDecimal mass) {
        this.mass = mass;
    }

    public Integer getIdPreform() {
        return idPreform;
    }

    public void setIdPreform(Integer idPreform) {
        this.idPreform = idPreform;
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

    public BigDecimal getDStan() {
        return dStan;
    }

    public void setDStan(BigDecimal dStan) {
        this.dStan = dStan;
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
