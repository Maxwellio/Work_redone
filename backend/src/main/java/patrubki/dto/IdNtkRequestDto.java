package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class IdNtkRequestDto {

    @JsonProperty("idNtk")
    private Integer idNtk;

    public Integer getIdNtk() {
        return idNtk;
    }

    public void setIdNtk(Integer idNtk) {
        this.idNtk = idNtk;
    }
}
