package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FitingDetailNtkDto {

    @JsonProperty("idFitingDetail")
    private Integer idFitingDetail;

    @JsonProperty("idNtk")
    private Integer idNtk;

    public FitingDetailNtkDto() {
    }

    public FitingDetailNtkDto(Integer idFitingDetail, Integer idNtk) {
        this.idFitingDetail = idFitingDetail;
        this.idNtk = idNtk;
    }

    public Integer getIdFitingDetail() {
        return idFitingDetail;
    }

    public void setIdFitingDetail(Integer idFitingDetail) {
        this.idFitingDetail = idFitingDetail;
    }

    public Integer getIdNtk() {
        return idNtk;
    }

    public void setIdNtk(Integer idNtk) {
        this.idNtk = idNtk;
    }
}
