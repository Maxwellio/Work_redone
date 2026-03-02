package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PreformTypDto {

    @JsonProperty("idPreform")
    private Integer idPreform;
    
    @JsonProperty("nmPreform")
    private String nmPreform;

    public Integer getIdPreform() {
        return idPreform;
    }

    public void setIdPreform(Integer idPreform) {
        this.idPreform = idPreform;
    }

    public String getNmPreform() {
        return nmPreform;
    }

    public void setNmPreform(String nmPreform) {
        this.nmPreform = nmPreform;
    }
}
