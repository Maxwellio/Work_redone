package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "operation_structure_spr", schema = "substitute")
public class OperationStructureSpr {

    @Id
    @Column(name = "id_operations")
    private Integer idOperations;

    @Column(name = "nm_operations", length = 255)
    private String nmOperations;

    @Column(name = "tk", precision = 19, scale = 2)
    private BigDecimal tk;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_group_operations")
    private OperationStructureGroup idGroupOperations;

    public Integer getIdOperations() {
        return idOperations;
    }

    public void setIdOperations(Integer idOperations) {
        this.idOperations = idOperations;
    }

    public String getNmOperations() {
        return nmOperations;
    }

    public void setNmOperations(String nmOperations) {
        this.nmOperations = nmOperations;
    }

    public BigDecimal getTk() {
        return tk;
    }

    public void setTk(BigDecimal tk) {
        this.tk = tk;
    }

    public OperationStructureGroup getIdGroupOperations() {
        return idGroupOperations;
    }

    public void setIdGroupOperations(OperationStructureGroup idGroupOperations) {
        this.idGroupOperations = idGroupOperations;
    }
}
