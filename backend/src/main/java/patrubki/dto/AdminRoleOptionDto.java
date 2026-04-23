package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AdminRoleOptionDto {

    @JsonProperty("id")
    private final Integer id;

    @JsonProperty("nm")
    private final String nm;

    public AdminRoleOptionDto(Integer id, String nm) {
        this.id = id;
        this.nm = nm;
    }

    public Integer getId() {
        return id;
    }

    public String getNm() {
        return nm;
    }
}
