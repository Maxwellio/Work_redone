package patrubki.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Отдаёт SPA для client-side маршрутов: без forward GET /login и /admin дают 404 в монолите
 * (в dev Vite подставляет index.html; Spring раздаёт только реальные файлы из static/).
 */
@Controller
public class SpaForwardController {

    @GetMapping("/login")
    public String loginSpa() {
        return "forward:/index.html";
    }

    @GetMapping({ "/admin", "/admin/**" })
    public String adminSpa() {
        return "forward:/index.html";
    }
}
