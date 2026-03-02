package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class OperationStructureSprDto {

    @JsonProperty("idOperations")
    private Integer idOperations;

    @JsonProperty("nmOperations")
    private String nmOperations;

    @JsonProperty("tk")
    private BigDecimal tk;

    @JsonProperty("idGroupOperations")
    private Integer idGroupOperations;

    public Integer getIdOperations() {
        return idOperations;
    }

    public void setIdOperations(Integer idOperations) {
        this.idOperations = idOperations;
    }

    public String getNmOperations() {
        return nmOperations;
    }

    public void setNmOperations(String nmOperations) {
        this.nmOperations = nmOperations;
    }

    public BigDecimal getTk() {
        return tk;
    }

    public void setTk(BigDecimal tk) {
        this.tk = tk;
    }

    public Integer getIdGroupOperations() {
        return idGroupOperations;
    }

    public void setIdGroupOperations(Integer idGroupOperations) {
        this.idGroupOperations = idGroupOperations;
    }
}
