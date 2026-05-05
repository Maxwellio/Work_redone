package patrubki.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

/**
 * Тело запроса для расчёта нормы времени гидроиспытания (функция БД calculate_hydro_nv_form).
 * id = null при добавлении записи, иначе id редактируемой записи.
 */
public class HydrotestNvCalcRequestDto {

    @JsonProperty("id")
    private Integer id;

    @JsonProperty("d")
    private BigDecimal d;

    @JsonProperty("l")
    private BigDecimal l;

    @JsonProperty("th")
    private BigDecimal th;

    @JsonProperty("testtime")
    private BigDecimal testtime;

    @JsonProperty("mass")
    private BigDecimal mass;

    @JsonProperty("l1")
    private BigDecimal l1;

    @JsonProperty("l2")
    private BigDecimal l2;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BigDecimal getD() {
        return d;
    }

    public void setD(BigDecimal d) {
        this.d = d;
    }

    public BigDecimal getL() {
        return l;
    }

    public void setL(BigDecimal l) {
        this.l = l;
    }

    public BigDecimal getTh() {
        return th;
    }

    public void setTh(BigDecimal th) {
        this.th = th;
    }

    public BigDecimal getTesttime() {
        return testtime;
    }

    public void setTesttime(BigDecimal testtime) {
        this.testtime = testtime;
    }

    public BigDecimal getMass() {
        return mass;
    }

    public void setMass(BigDecimal mass) {
        this.mass = mass;
    }

    public BigDecimal getL1() {
        return l1;
    }

    public void setL1(BigDecimal l1) {
        this.l1 = l1;
    }

    public BigDecimal getL2() {
        return l2;
    }

    public void setL2(BigDecimal l2) {
        this.l2 = l2;
    }
}
