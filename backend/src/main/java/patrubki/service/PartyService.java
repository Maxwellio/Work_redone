package patrubki.service;

import org.springframework.stereotype.Service;
import patrubki.dto.PartyDto;
import patrubki.entity.Party;
import patrubki.repository.PartyRepository;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class PartyService {

    private static final Pattern RANGE_PATTERN = Pattern.compile("^(\\d+)\\s*-\\s*(\\d+)$");
    private static final Pattern GREATER_PATTERN = Pattern.compile("^>\\s*(\\d+)$");
    private static final Pattern NUMBER_PATTERN = Pattern.compile("^(\\d+)$");

    private final PartyRepository repository;

    public PartyService(PartyRepository repository) {
        this.repository = repository;
    }

    public List<PartyDto> findAllOrderByColParty() {
        return repository.findAllOrderByColParty().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<PartyDto> findDistinctColPartyOrdered() {
        return repository.findDistinctColPartyOrdered().stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .distinct()
                .sorted(Comparator
                        .comparingInt(this::sortBucket)
                        .thenComparingInt(this::sortValue)
                        .thenComparing(s -> s))
                .map(colParty -> {
                    PartyDto dto = new PartyDto();
                    dto.setColParty(colParty);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private PartyDto toDto(Party entity) {
        PartyDto dto = new PartyDto();
        dto.setColParty(entity.getColParty());
        dto.setTsh(entity.getTsh());
        dto.setKtv(entity.getKtv());
        return dto;
    }

    private int sortBucket(String value) {
        if (RANGE_PATTERN.matcher(value).matches() || NUMBER_PATTERN.matcher(value).matches()) {
            return 0;
        }
        if (GREATER_PATTERN.matcher(value).matches()) {
            return 1;
        }
        return 2;
    }

    private int sortValue(String value) {
        return extractStartNumber(value);
    }

    private int extractStartNumber(String value) {
        Matcher range = RANGE_PATTERN.matcher(value);
        if (range.matches()) {
            return safeParseInt(range.group(1));
        }
        Matcher greater = GREATER_PATTERN.matcher(value);
        if (greater.matches()) {
            return safeParseInt(greater.group(1));
        }
        Matcher number = NUMBER_PATTERN.matcher(value);
        if (number.matches()) {
            return safeParseInt(number.group(1));
        }
        return Integer.MAX_VALUE;
    }

    private int safeParseInt(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return Integer.MAX_VALUE;
        }
    }
}
