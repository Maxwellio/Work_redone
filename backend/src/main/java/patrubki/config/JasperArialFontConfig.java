package patrubki.config;

import net.sf.jasperreports.engine.DefaultJasperReportsContext;
import net.sf.jasperreports.engine.fonts.FontFamily;
import net.sf.jasperreports.engine.fonts.SimpleFontFamily;
import net.sf.jasperreports.extensions.ExtensionsEnvironment;
import net.sf.jasperreports.extensions.ExtensionsRegistry;
import net.sf.jasperreports.extensions.ListExtensionsRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

/**
 * Registers Arial from classpath {@code fonts/arial/*.ttf} for Jasper PDF embed.
 */
@Configuration
public class JasperArialFontConfig {

    private static final Logger log = LoggerFactory.getLogger(JasperArialFontConfig.class);
    private static final String CLASSPATH_DIR = "fonts/arial/";

    @PostConstruct
    public void registerArial() throws IOException {
        Path normal = requireFont("arial.ttf");
        Path bold = optionalFont("arialbd.ttf", normal);
        Path italic = optionalFont("ariali.ttf", normal);
        Path boldItalic = optionalFont("arialbi.ttf", bold);

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
        log.info("Jasper Arial registered from classpath:{}", CLASSPATH_DIR + "arial.ttf");
    }

    private static String absolutePath(Path path) {
        return path.toAbsolutePath().normalize().toString();
    }

    private Path requireFont(String name) throws IOException {
        Path path = loadClasspathFont(name);
        if (path == null) {
            throw new IllegalStateException(
                    "Arial TTF not found: classpath:" + CLASSPATH_DIR + name
                            + ". Place the file under src/main/resources/fonts/arial/");
        }
        return path;
    }

    private Path optionalFont(String name, Path fallback) throws IOException {
        Path path = loadClasspathFont(name);
        return path != null ? path : fallback;
    }

    private Path loadClasspathFont(String name) throws IOException {
        Resource resource = new ClassPathResource(CLASSPATH_DIR + name);
        if (!resource.exists()) {
            return null;
        }
        Path temp = Files.createTempFile("jasper-" + name.replace('.', '-') + "-", ".ttf");
        temp.toFile().deleteOnExit();
        try (InputStream in = resource.getInputStream()) {
            Files.copy(in, temp, StandardCopyOption.REPLACE_EXISTING);
        }
        return temp;
    }
}
