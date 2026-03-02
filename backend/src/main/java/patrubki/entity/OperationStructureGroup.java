package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "operation_structure_group", schema = "substitute")
public class OperationStructureGroup {

    @Id
    @Column(name = "id_group_operations")
    private Integer idGroupOperations;

    @Column(name = "nm_group_operations", length = 255)
    private String nmGroupOperations;

    public Integer getIdGroupOperations() {
        return idGroupOperations;
    }

    public void setIdGroupOperations(Integer idGroupOperations) {
        this.idGroupOperations = idGroupOperations;
    }

    public String getNmGroupOperations() {
        return nmGroupOperations;
    }

    public void setNmGroupOperations(String nmGroupOperations) {
        this.nmGroupOperations = nmGroupOperations;
    }
}
