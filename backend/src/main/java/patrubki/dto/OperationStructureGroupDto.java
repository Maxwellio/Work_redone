package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OperationStructureGroupDto {

    @JsonProperty("idGroupOperations")
    private Integer idGroupOperations;

    @JsonProperty("nmGroupOperations")
    private String nmGroupOperations;

    public Integer getIdGroupOperations() {
        return idGroupOperations;
    }

    public void setIdGroupOperations(Integer idGroupOperations) {
        this.idGroupOperations = idGroupOperations;
    }

    public String getNmGroupOperations() {
        return nmGroupOperations;
    }

    public void setNmGroupOperations(String nmGroupOperations) {
        this.nmGroupOperations = nmGroupOperations;
    }
}
