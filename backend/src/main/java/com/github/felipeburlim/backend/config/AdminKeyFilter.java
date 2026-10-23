package com.github.felipeburlim.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;

/**
 * Protege a API de administração.
 *
 * - Toda requisição que altera dados (POST, PUT, PATCH, DELETE) exige o header X-Admin-Key.
 * - Qualquer rota de /admin exige o header, inclusive GET.
 * - Leituras públicas (catálogo, categorias, imagens) continuam abertas.
 *
 * A chave vem da variável de ambiente ADMIN_API_KEY. Se ela estiver ausente ou curta
 * (menos de 24 caracteres), TODAS as rotas protegidas ficam bloqueadas (falha fechada).
 */
@Component
public class AdminKeyFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AdminKeyFilter.class);
    private static final String HEADER = "X-Admin-Key";
    private static final int MIN_KEY_LENGTH = 24;

    private final byte[] expectedKey;
    private final boolean configured;

    public AdminKeyFilter(@Value("${admin.api-key:}") String apiKey) {
        String key = apiKey == null ? "" : apiKey.trim();
        this.configured = key.length() >= MIN_KEY_LENGTH;
        this.expectedKey = key.getBytes(StandardCharsets.UTF_8);

        if (!configured) {
            log.warn("ADMIN_API_KEY ausente ou com menos de {} caracteres: "
                    + "rotas de escrita e /admin ficarão BLOQUEADAS.", MIN_KEY_LENGTH);
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String method = request.getMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) {
            return true;
        }

        boolean readOnly = "GET".equalsIgnoreCase(method) || "HEAD".equalsIgnoreCase(method);
        // getServletPath() já vem decodificado e normalizado pelo servidor
        String path = request.getServletPath().toLowerCase(Locale.ROOT);
        boolean adminArea = path.contains("admin");

        return readOnly && !adminArea;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String provided = request.getHeader(HEADER);

        if (configured && provided != null
                && MessageDigest.isEqual(provided.getBytes(StandardCharsets.UTF_8), expectedKey)) {
            chain.doFilter(request, response);
            return;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(
                "{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Acesso restrito ao administrador.\"}");
    }
}
