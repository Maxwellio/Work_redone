package patrubki.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import patrubki.dto.FitingDetailDto;
import patrubki.dto.FitingDetailNtkDto;
import patrubki.dto.FitingDetailSaveDto;
import patrubki.dto.FitingDto;
import patrubki.dto.HydrotestDto;
import patrubki.dto.IdNtkRequestDto;
import patrubki.dto.MakeSubstituteDetailDto;
import patrubki.dto.MakeSubstituteDetailSaveDto;
import patrubki.dto.MakeSubstituteMainDto;
import patrubki.dto.NtkDto;
import patrubki.dto.OperationStructureGroupDto;
import patrubki.dto.OperationStructureSprDto;
import patrubki.dto.PartyDto;
import patrubki.dto.PreformTypDto;
import patrubki.dto.FitingSaveDto;
import patrubki.dto.HydrotestSaveDto;
import patrubki.dto.SubstituteSaveDto;
import patrubki.service.FitingDetailNtkService;
import patrubki.service.FitingDetailService;
import patrubki.service.FitingService;
import patrubki.service.HydrotestService;
import patrubki.service.MakeSubstituteDetailService;
import patrubki.service.MakeSubstituteMainService;
import patrubki.service.NtkService;
import patrubki.service.OperationStructureGroupService;
import patrubki.service.OperationStructureSprService;
import patrubki.service.PartyService;
import patrubki.service.PreformTypService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MainDataController {

    private final MakeSubstituteMainService substituteService;
    private final FitingService fitingService;
    private final HydrotestService hydrotestService;
    private final PreformTypService preformTypService;
    private final PartyService partyService;
    private final OperationStructureGroupService operationStructureGroupService;
    private final OperationStructureSprService operationStructureSprService;
    private final NtkService ntkService;
    private final FitingDetailService fitingDetailService;
    private final MakeSubstituteDetailService makeSubstituteDetailService;
    private final FitingDetailNtkService fitingDetailNtkService;

    public MainDataController(MakeSubstituteMainService substituteService,
                              FitingService fitingService,
                              HydrotestService hydrotestService,
                              PreformTypService preformTypService,
                              PartyService partyService,
                              OperationStructureGroupService operationStructureGroupService,
                              OperationStructureSprService operationStructureSprService,
                              NtkService ntkService,
                              FitingDetailService fitingDetailService,
                              MakeSubstituteDetailService makeSubstituteDetailService,
                              FitingDetailNtkService fitingDetailNtkService) {
        this.substituteService = substituteService;
        this.fitingService = fitingService;
        this.hydrotestService = hydrotestService;
        this.preformTypService = preformTypService;
        this.partyService = partyService;
        this.operationStructureGroupService = operationStructureGroupService;
        this.operationStructureSprService = operationStructureSprService;
        this.ntkService = ntkService;
        this.fitingDetailService = fitingDetailService;
        this.makeSubstituteDetailService = makeSubstituteDetailService;
        this.fitingDetailNtkService = fitingDetailNtkService;
    }

    @GetMapping("/substitutes")
    public ResponseEntity<List<MakeSubstituteMainDto>> getSubstitutes(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer userId) {
        if (userId != null) {
            return ResponseEntity.ok(substituteService.findAllOrderByName(search, userId));
        }
        return ResponseEntity.ok(substituteService.findAllOrderByName(search));
    }

    @GetMapping("/fittings")
    public ResponseEntity<List<FitingDto>> getFittings(
            @RequestParam int tip,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer userId) {
        if (userId != null) {
            return ResponseEntity.ok(fitingService.findByTipOrderByNm(tip, search, userId));
        }
        return ResponseEntity.ok(fitingService.findByTipOrderByNm(tip, search));
    }

    @GetMapping("/hydrotests")
    public ResponseEntity<List<HydrotestDto>> getHydrotests(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer userId) {
        if (userId != null) {
            return ResponseEntity.ok(hydrotestService.findAllOrderByNh(search, userId));
        }
        return ResponseEntity.ok(hydrotestService.findAllOrderByNh(search));
    }

    @GetMapping("/preform-types")
    public ResponseEntity<List<PreformTypDto>> getPreformTypes() {
        return ResponseEntity.ok(preformTypService.findAllOrderByName());
    }

    @GetMapping("/party")
    public ResponseEntity<List<PartyDto>> getParty() {
        return ResponseEntity.ok(partyService.findDistinctColPartyOrdered());
    }

    @GetMapping("/operation-groups")
    public ResponseEntity<List<OperationStructureGroupDto>> getOperationGroups() {
        return ResponseEntity.ok(operationStructureGroupService.findAllOrderByName());
    }

    @GetMapping("/operations")
    public ResponseEntity<List<OperationStructureSprDto>> getOperations(
            @RequestParam(required = false) Integer groupId) {
        if (groupId != null) {
            return ResponseEntity.ok(operationStructureSprService.findByIdGroupOperations(groupId));
        }
        return ResponseEntity.ok(operationStructureSprService.findAllOrderById());
    }

    @PostMapping("/substitutes")
    public ResponseEntity<java.util.Map<String, Integer>> saveSubstitute(@RequestBody SubstituteSaveDto body) {
        Integer id = substituteService.saveSubstitute(body);
        return ResponseEntity.ok(java.util.Map.of("id", id));
    }

    @DeleteMapping("/substitutes/{id}")
    public ResponseEntity<Void> deleteSubstitute(@PathVariable Integer id) {
        substituteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/fittings")
    public ResponseEntity<java.util.Map<String, Integer>> saveFitting(@RequestBody FitingSaveDto body) {
        Integer id = fitingService.saveFitting(body);
        return ResponseEntity.ok(java.util.Map.of("id", id));
    }

    @DeleteMapping("/fittings/{id}")
    public ResponseEntity<Void> deleteFitting(@PathVariable Integer id) {
        fitingService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/hydrotests")
    public ResponseEntity<java.util.Map<String, Integer>> saveHydrotest(@RequestBody HydrotestSaveDto body) {
        Integer id = hydrotestService.saveHydrotest(body);
        return ResponseEntity.ok(java.util.Map.of("id", id));
    }

    @PostMapping("/hydrotests/{id}/calc-time")
    public ResponseEntity<Void> calcHydroTime(@PathVariable Integer id) {
        hydrotestService.calcHydroTime(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/hydrotests/{id}")
    public ResponseEntity<Void> deleteHydrotest(@PathVariable Integer id) {
        hydrotestService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ntk")
    public ResponseEntity<List<NtkDto>> getNtk() {
        return ResponseEntity.ok(ntkService.findAllOrderByIdNtk());
    }

    @GetMapping("/fittings/{idFiting}/details")
    public ResponseEntity<List<FitingDetailDto>> getFittingDetails(@PathVariable("idFiting") Integer idFiting) {
        return ResponseEntity.ok(fitingDetailService.findByIdFitingOrderBySeqNumOper(idFiting));
    }

    @PostMapping("/fitting-details")
    public ResponseEntity<java.util.Map<String, Integer>> saveFittingDetail(@RequestBody FitingDetailSaveDto body) {
        Integer id = fitingDetailService.save(body);
        return ResponseEntity.ok(java.util.Map.of("id", id));
    }

    @PutMapping("/fitting-details/{id}")
    public ResponseEntity<java.util.Map<String, Integer>> updateFittingDetail(@PathVariable Integer id, @RequestBody FitingDetailSaveDto body) {
        body.setId(id);
        Integer savedId = fitingDetailService.save(body);
        return ResponseEntity.ok(java.util.Map.of("id", savedId));
    }

    @DeleteMapping("/fitting-details/{id}")
    public ResponseEntity<Void> deleteFittingDetail(@PathVariable Integer id) {
        fitingDetailService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/substitutes/{idSubstitutePrepared}/details")
    public ResponseEntity<List<MakeSubstituteDetailDto>> getSubstituteDetails(@PathVariable("idSubstitutePrepared") Integer idSubstitutePrepared) {
        return ResponseEntity.ok(makeSubstituteDetailService.findByIdSubstitutePreparedOrderBySeqNumOper(idSubstitutePrepared));
    }

    @PostMapping("/substitute-details")
    public ResponseEntity<java.util.Map<String, Integer>> saveSubstituteDetail(@RequestBody MakeSubstituteDetailSaveDto body) {
        Integer id = makeSubstituteDetailService.save(body);
        return ResponseEntity.ok(java.util.Map.of("id", id));
    }

    @PutMapping("/substitute-details/{id}")
    public ResponseEntity<java.util.Map<String, Integer>> updateSubstituteDetail(@PathVariable Integer id, @RequestBody MakeSubstituteDetailSaveDto body) {
        body.setId(id);
        Integer savedId = makeSubstituteDetailService.save(body);
        return ResponseEntity.ok(java.util.Map.of("id", savedId));
    }

    @DeleteMapping("/substitute-details/{id}")
    public ResponseEntity<Void> deleteSubstituteDetail(@PathVariable Integer id) {
        makeSubstituteDetailService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/fitting-details/{id}/ntk")
    public ResponseEntity<List<FitingDetailNtkDto>> getFittingDetailNtk(@PathVariable("id") Integer idFitingDetail) {
        return ResponseEntity.ok(fitingDetailNtkService.findByIdFitingDetail(idFitingDetail));
    }

    @PostMapping("/fitting-details/{id}/ntk")
    public ResponseEntity<Void> addFittingDetailNtk(@PathVariable("id") Integer idFitingDetail, @RequestBody IdNtkRequestDto body) {
        if (body.getIdNtk() == null) {
            return ResponseEntity.badRequest().build();
        }
        fitingDetailNtkService.addNtk(idFitingDetail, body.getIdNtk());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/fitting-details/{idFitingDetail}/ntk/{idNtk}")
    public ResponseEntity<Void> removeFittingDetailNtk(@PathVariable Integer idFitingDetail, @PathVariable Integer idNtk) {
        fitingDetailNtkService.removeNtk(idFitingDetail, idNtk);
        return ResponseEntity.noContent().build();
    }
}
