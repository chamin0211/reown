package com.reown.backend.global.security;

import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserRole;
import com.reown.backend.auth.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.EnumSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class ApiAuthorizationInterceptor implements HandlerInterceptor {

    private static final Set<UserRole> ADMIN_ROLES = EnumSet.of(UserRole.ADMIN, UserRole.MASTER);
    private static final Set<UserRole> SELLER_ROLES = EnumSet.of(UserRole.SELLER, UserRole.DESIGNER);
    private static final Set<UserRole> SELLER_OR_ADMIN_ROLES = EnumSet.of(
            UserRole.SELLER,
            UserRole.DESIGNER,
            UserRole.ADMIN,
            UserRole.MASTER
    );

    private final UserRepository userRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String path = normalizePath(request.getRequestURI());
        String method = request.getMethod();

        if (!path.startsWith("/api/")) {
            return true;
        }

        if (isPublicApi(path, method)) {
            return true;
        }

        if (isMasterOnlyApi(path, method)) {
            requireAnyRole(request, Set.of(UserRole.MASTER), "MASTER 권한이 필요한 기능입니다.");
            return true;
        }

        if (isAdminApi(path, method)) {
            requireAnyRole(request, ADMIN_ROLES, "관리자 권한이 필요한 기능입니다.");
            return true;
        }

        if (isSellerApi(path, method)) {
            requireAnyRole(request, SELLER_ROLES, "셀러 권한이 필요한 기능입니다.");
            return true;
        }

        if (isSellerOrAdminApi(path, method)) {
            requireAnyRole(request, SELLER_OR_ADMIN_ROLES, "셀러 또는 관리자 권한이 필요한 기능입니다.");
            return true;
        }

        return true;
    }

    private boolean isPublicApi(String path, String method) {
        if (path.startsWith("/api/auth/")) return true;
        if (path.startsWith("/api/uploads/")) return true;

        // 소비자에게 공개되는 조회 API입니다.
        if ("GET".equalsIgnoreCase(method)) {
            if (path.equals("/api/catalog/products")) return true;
            if (path.startsWith("/api/catalog/products/")) return true;
            if (path.equals("/api/catalog/categories")) return true;
            if (path.equals("/api/fundings")) return true;
            if (path.matches("^/api/fundings/\\d+$")) return true;
            if (path.matches("^/api/fundings/\\d+/updates$")) return true;
            if (path.equals("/api/resells")) return true;
            if (path.matches("^/api/resells/\\d+$")) return true;
            if (path.matches("^/api/resells/\\d+/offers$")) return true;
        }

        return false;
    }

    private boolean isMasterOnlyApi(String path, String method) {
        if (!path.startsWith("/api/admin/users")) {
            return false;
        }

        if (path.equals("/api/admin/users/admin-applications")) return true;
        if (path.matches("^/api/admin/users/\\d+/approve-admin$")) return true;
        if (path.matches("^/api/admin/users/\\d+/reject-admin$")) return true;
        if (path.matches("^/api/admin/users/\\d+/grant-master$")) return true;
        if (path.matches("^/api/admin/users/\\d+/revoke-master$")) return true;

        return false;
    }

    private boolean isAdminApi(String path, String method) {
        if (path.startsWith("/api/admin/")) return true;
        if (path.startsWith("/api/fundings/admin")) return true;
        if (path.startsWith("/api/resells/admin")) return true;
        if (path.matches("^/api/resells/\\d+/(approve|reject)$")) return true;
        if (path.matches("^/api/resells/\\d+/close$")) return true;
        return false;
    }

    private boolean isSellerApi(String path, String method) {
        if (path.startsWith("/api/seller/")) return true;
        if (path.startsWith("/api/fundings/seller")) return true;

        // 리셀 상품 등록/수정/판매자용 처리 API입니다.
        if ("POST".equalsIgnoreCase(method) && path.equals("/api/resells")) return true;
        if ("PATCH".equalsIgnoreCase(method) && path.matches("^/api/resells/\\d+$")) return true;
        if (path.matches("^/api/resells/\\d+/cancel$")) return true;
        if (path.matches("^/api/resells/offers/\\d+/accept$")) return true;
        if (path.matches("^/api/resells/transactions/\\d+/(prepare-shipment|ship|settle)$")) return true;
        if (path.matches("^/api/resells/sellers/\\d+.*$")) return true;

        return false;
    }

    private boolean isSellerOrAdminApi(String path, String method) {
        return path.matches("^/api/brands/\\d+/settlements$");
    }

    private void requireAnyRole(HttpServletRequest request, Set<UserRole> allowedRoles, String message) {
        User actor = resolveActor(request);
        if (!allowedRoles.contains(actor.getRole())) {
            throw new AccessDeniedException(message + " 현재 권한: " + actor.getRole());
        }
    }

    private User resolveActor(HttpServletRequest request) {
        Long actorUserId = resolveActorUserId(request);
        if (actorUserId == null) {
            throw new AccessDeniedException("로그인한 사용자 정보가 없습니다. 다시 로그인해주세요.");
        }

        return userRepository.findById(actorUserId)
                .orElseThrow(() -> new AccessDeniedException("로그인 사용자를 찾을 수 없습니다. userId=" + actorUserId));
    }

    private Long resolveActorUserId(HttpServletRequest request) {
        String rawUserId = firstNotBlank(
                request.getHeader("X-Actor-User-Id"),
                request.getHeader("X-User-Id"),
                request.getParameter("actorUserId")
        );

        if (rawUserId == null) {
            return null;
        }

        try {
            return Long.parseLong(rawUserId.trim());
        } catch (NumberFormatException e) {
            throw new AccessDeniedException("사용자 식별값이 올바르지 않습니다: " + rawUserId);
        }
    }

    private String firstNotBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.trim().isEmpty()) {
                return value;
            }
        }
        return null;
    }

    private String normalizePath(String path) {
        if (path == null || path.isBlank()) {
            return "/";
        }
        return path.replaceAll("/+$", "");
    }
}
