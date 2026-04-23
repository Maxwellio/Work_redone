package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AdminOrgChoiceDto {

    @JsonProperty("id")
    private final Integer id;

    @JsonProperty("nm")
    private final String nm;

    @JsonProperty("fullnm")
    private final String fullnm;

    public AdminOrgChoiceDto(Integer id, String nm, String fullnm) {
        this.id = id;
        this.nm = nm;
        this.fullnm = fullnm;
    }

    public Integer getId() {
        return id;
    }

    public String getNm() {
        return nm;
    }

    public String getFullnm() {
        return fullnm;
    }
}
