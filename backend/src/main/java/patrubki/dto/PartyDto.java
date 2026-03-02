package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class PartyDto {

    @JsonProperty("colParty")
    private String colParty;

    @JsonProperty("tsh")
    private BigDecimal tsh;

    @JsonProperty("ktv")
    private BigDecimal ktv;

    public String getColParty() {
        return colParty;
    }

    public void setColParty(String colParty) {
        this.colParty = colParty;
    }

    public BigDecimal getTsh() {
        return tsh;
    }

    public void setTsh(BigDecimal tsh) {
        this.tsh = tsh;
    }

    public BigDecimal getKtv() {
        return ktv;
    }

    public void setKtv(BigDecimal ktv) {
        this.ktv = ktv;
    }
}
