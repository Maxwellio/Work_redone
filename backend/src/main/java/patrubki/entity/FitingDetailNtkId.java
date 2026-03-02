package patrubki.entity;

import java.io.Serializable;
import java.util.Objects;

/**
 * Составной первичный ключ для таблицы fiting_detail_ntk.
 */
public class FitingDetailNtkId implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer idFitingDetail;
    private Integer idNtk;

    public FitingDetailNtkId() {
    }

    public FitingDetailNtkId(Integer idFitingDetail, Integer idNtk) {
        this.idFitingDetail = idFitingDetail;
        this.idNtk = idNtk;
    }

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FitingDetailNtkId that = (FitingDetailNtkId) o;
        return Objects.equals(idFitingDetail, that.idFitingDetail) && Objects.equals(idNtk, that.idNtk);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idFitingDetail, idNtk);
    }
}
