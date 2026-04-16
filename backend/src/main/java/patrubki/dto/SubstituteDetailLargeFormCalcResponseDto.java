package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class SubstituteDetailLargeFormCalcResponseDto {

    private BigDecimal tVp;
    private BigDecimal vRez;
    private BigDecimal tMach;
    private BigDecimal tSum;

    @JsonProperty("tVp")
    public BigDecimal getTvp() {
        return tVp;
    }

    @JsonProperty("tVp")
    public void setTvp(BigDecimal tVp) {
        this.tVp = tVp;
    }

    @JsonProperty("vRez")
    public BigDecimal getVRez() {
        return vRez;
    }

    @JsonProperty("vRez")
    public void setVRez(BigDecimal vRez) {
        this.vRez = vRez;
    }

    @JsonProperty("tMach")
    public BigDecimal getTMach() {
        return tMach;
    }

    @JsonProperty("tMach")
    public void setTMach(BigDecimal tMach) {
        this.tMach = tMach;
    }

    @JsonProperty("tSum")
    public BigDecimal getTSum() {
        return tSum;
    }

    @JsonProperty("tSum")
    public void setTSum(BigDecimal tSum) {
        this.tSum = tSum;
    }
}
