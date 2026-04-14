package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class SubstituteDetailCalcTvpRequestDto {

    @JsonProperty("idOperations")
    private Integer idOperations;

    @JsonProperty("massPreform")
    private BigDecimal massPreform;

    @JsonProperty("lPreform")
    private BigDecimal lPreform;

    public Integer getIdOperations() {
        return idOperations;
    }

    public void setIdOperations(Integer idOperations) {
        this.idOperations = idOperations;
    }

    public BigDecimal getMassPreform() {
        return massPreform;
    }

    public void setMassPreform(BigDecimal massPreform) {
        this.massPreform = massPreform;
    }

    public BigDecimal getLPreform() {
        return lPreform;
    }

    public void setLPreform(BigDecimal lPreform) {
        this.lPreform = lPreform;
    }
}
