package patrubki.config;

import net.sf.jasperreports.engine.DefaultJasperReportsContext;
import net.sf.jasperreports.engine.fonts.FontFamily;
import net.sf.jasperreports.engine.fonts.SimpleFontFamily;
import net.sf.jasperreports.extensions.ExtensionsEnvironment;
import net.sf.jasperreports.extensions.ExtensionsRegistry;
import net.sf.jasperreports.extensions.ListExtensionsRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

/**
 * Registers Arial TTF for Jasper PDF (Identity-H + embed).
 * Looks up files in: configured dir → classpath fonts/arial → Windows/Linux system fonts.
 */
@Configuration
public class JasperArialFontConfig {

    private static final Logger log = LoggerFactory.getLogger(JasperArialFontConfig.class);

    @Value("${jasper.fonts.arial-dir:}")
    private String arialDir;

    @PostConstruct
    public void registerArial() throws IOException {
        Path normal = resolveFont("arial.ttf", "Arial.ttf");
        Path bold = resolveFont("arialbd.ttf", "Arialbd.ttf", "arialbd.ttf");
        Path italic = resolveFont("ariali.ttf", "Ariali.ttf", "ariali.ttf");
        Path boldItalic = resolveFont("arialbi.ttf", "Arialbi.ttf", "arialbi.ttf");

        if (normal == null) {
            throw new IllegalStateException(
                    "Arial TTF not found. Put arial.ttf (and arialbd/ariali/arialbi) into "
                            + "classpath:fonts/arial/ or set jasper.fonts.arial-dir to a folder "
                            + "with those files (e.g. C:/Windows/Fonts).");
        }
        if (bold == null) {
            bold = normal;
        }
        if (italic == null) {
            italic = normal;
        }
        if (boldItalic == null) {
            boldItalic = bold;
        }

        SimpleFontFamily family = new SimpleFontFamily(DefaultJasperReportsContext.getInstance());
        family.setName("Arial");
        family.setPdfEncoding("Identity-H");
        family.setPdfEmbedded(Boolean.TRUE);
        family.setNormal(absolutePath(normal));
        family.setBold(absolutePath(bold));
        family.setItalic(absolutePath(italic));
        family.setBoldItalic(absolutePath(boldItalic));

        ListExtensionsRegistry added = new ListExtensionsRegistry();
        added.add(FontFamily.class, family);

        ExtensionsRegistry current = ExtensionsEnvironment.getExtensionsRegistry();
        ExtensionsRegistry combined = new ExtensionsRegistry() {
            @Override
            public <T> List<T> getExtensions(Class<T> extensionType) {
                List<T> result = new ArrayList<>();
                if (current != null) {
                    List<T> fromCurrent = current.getExtensions(extensionType);
                    if (fromCurrent != null) {
                        result.addAll(fromCurrent);
                    }
                }
                List<T> fromAdded = added.getExtensions(extensionType);
                if (fromAdded != null) {
                    result.addAll(fromAdded);
                }
                return result;
            }
        };
        ExtensionsEnvironment.setSystemExtensionsRegistry(combined);
        log.info("Jasper Arial font registered from {}", normal);
    }

    private static String absolutePath(Path path) {
        return path.toAbsolutePath().normalize().toString();
    }

    private Path resolveFont(String... names) throws IOException {
        if (arialDir != null && !arialDir.isBlank()) {
            Path dir = Paths.get(arialDir);
            for (String name : names) {
                Path candidate = dir.resolve(name);
                if (Files.isRegularFile(candidate)) {
                    return candidate;
                }
            }
        }

        for (String name : names) {
            Resource resource = new ClassPathResource("fonts/arial/" + name);
            if (resource.exists()) {
                return copyToTemp(resource, name);
            }
        }

        String[] systemDirs = {
                "C:/Windows/Fonts",
                "C:\\Windows\\Fonts",
                "/usr/share/fonts/truetype/msttcorefonts",
                "/usr/share/fonts/truetype/liberation"
        };
        for (String dir : systemDirs) {
            for (String name : names) {
                Path candidate = Paths.get(dir, name);
                if (Files.isRegularFile(candidate)) {
                    return candidate;
                }
            }
        }
        return null;
    }

    private static Path copyToTemp(Resource resource, String name) throws IOException {
        Path temp = Files.createTempFile("jasper-" + name.replace('.', '-') + "-", ".ttf");
        temp.toFile().deleteOnExit();
        try (InputStream in = resource.getInputStream()) {
            Files.copy(in, temp, StandardCopyOption.REPLACE_EXISTING);
        }
        return temp;
    }
}
