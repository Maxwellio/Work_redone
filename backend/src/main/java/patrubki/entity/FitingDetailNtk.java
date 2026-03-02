package patrubki.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "fiting_detail_ntk", schema = "substitute")
@IdClass(FitingDetailNtkId.class)
public class FitingDetailNtk {

    @Id
    @Column(name = "id_fiting_detail")
    private Integer idFitingDetail;

    @Id
    @Column(name = "id_ntk")
    private Integer idNtk;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_fiting_detail", insertable = false, updatable = false)
    private FitingDetail fitingDetail;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_ntk", insertable = false, updatable = false)
    private Ntk ntk;

    public Integer getIdFitingDetail() {
        return idFitingDetail;
    }

    public void setIdFitingDetail(Integer idFitingDetail) {
        this.idFitingDetail = idFitingDetail;
    }

    public Integer getIdNtk() {
        return idNtk;
    }

    public void setIdNtk(Integer idNtk) {
        this.idNtk = idNtk;
    }

    public FitingDetail getFitingDetail() {
        return fitingDetail;
    }

    public void setFitingDetail(FitingDetail fitingDetail) {
        this.fitingDetail = fitingDetail;
    }

    public Ntk getNtk() {
        return ntk;
    }

    public void setNtk(Ntk ntk) {
        this.ntk = ntk;
    }
}
