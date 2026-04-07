package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class NtkTransitionRowDto {

    @JsonProperty("idNtk")
    private Integer idNtk;

    @JsonProperty("nm")
    private String nm;

    @JsonProperty("parid")
    private BigDecimal parid;

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

    public BigDecimal getParid() {
        return parid;
    }

    public void setParid(BigDecimal parid) {
        this.parid = parid;
    }
}
