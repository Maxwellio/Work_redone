package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class NtkDto {

    @JsonProperty("idNtk")
    private Integer idNtk;

    @JsonProperty("nm")
    private String nm;

    @JsonProperty("d")
    private BigDecimal d;

    @JsonProperty("ntk")
    private BigDecimal ntk;

    @JsonProperty("poz")
    private BigDecimal poz;

    @JsonProperty("ind")
    private String ind;

    public Integer getIdNtk() {
        return idNtk;
    }

    public void setIdNtk(Integer idNtk) {
        this.idNtk = idNtk;
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

    public BigDecimal getNtk() {
        return ntk;
    }

    public void setNtk(BigDecimal ntk) {
        this.ntk = ntk;
    }

    public BigDecimal getPoz() {
        return poz;
    }

    public void setPoz(BigDecimal poz) {
        this.poz = poz;
    }

    public String getInd() {
        return ind;
    }

    public void setInd(String ind) {
        this.ind = ind;
    }
}
