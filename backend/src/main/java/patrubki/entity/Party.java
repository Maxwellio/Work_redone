package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "party", schema = "substitute")
public class Party {

    @Id
    @Column(name = "col_party", length = 255)
    private String colParty;

    @Column(name = "tsh", precision = 19, scale = 2)
    private BigDecimal tsh;

    @Column(name = "ktv", precision = 19, scale = 2)
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
