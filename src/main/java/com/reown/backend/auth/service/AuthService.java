package com.reown.backend.auth.service;

import com.reown.backend.auth.dto.AuthResponse;
import com.reown.backend.auth.dto.LoginRequest;
import com.reown.backend.auth.dto.SignupRequest;
import com.reown.backend.auth.entity.User;
import com.reown.backend.auth.entity.UserRole;
import com.reown.backend.auth.repository.UserRepository;
import com.reown.backend.brand.entity.Brand;
import com.reown.backend.brand.repository.BrandRepository;
import com.reown.backend.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AuthService {

    private static final int MAX_FAILED_LOGIN_COUNT = 5;
    private static final int LOCK_MINUTES = 10;
    private static final Pattern LOGIN_ID_PATTERN = Pattern.compile("^[a-z0-9_]{4,20}$");

    private final UserRepository userRepository;
    private final BrandRepository brandRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    @Value("${reown.admin.invite-code:${REOWN_ADMIN_INVITE_CODE:REOWN_ADMIN_2026}}")
    private String adminInviteCode;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        String loginId = normalizeLoginId(request.loginId());
        validateLoginId(loginId);
        validatePassword(request.password());

        if (userRepository.existsByLoginId(loginId)) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }

        String email = resolveEmail(request, loginId);
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("이미 가입된 계정 정보입니다.");
        }

        UserRole signupRole = resolveSignupRole(request);
        User user = userRepository.save(new User(
                loginId,
                email,
                passwordEncoder.encode(request.password()),
                request.nickname().trim(),
                signupRole
        ));

        if (signupRole == UserRole.SELLER_PENDING) {
            Brand brand = createPendingBrandApplication(user.getUserId(), request);
            brandRepository.save(brand);
            notificationService.notifyAdmins(
                    "새 셀러 입점 신청",
                    brand.getBrandName() + " 브랜드의 셀러 입점 신청이 접수되었습니다.",
                    "SELLER_APPLICATION",
                    "/admin/seller/onboarding"
            );
            return AuthResponse.from(user, brand.getBrandId(), brand.getBrandName());
        }

        if (signupRole == UserRole.ADMIN_PENDING) {
            notificationService.notifyMasters(
                    "새 관리자 승인 요청",
                    user.getNickname() + "님의 관리자 신청이 접수되었습니다.",
                    "ADMIN_APPLICATION",
                    "/admin/settings/admins"
            );
        }

        return toAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String loginId = resolveLoginIdentifier(request);
        User user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다."));

        LocalDateTime now = LocalDateTime.now();
        if (user.isLocked(now)) {
            throw new IllegalArgumentException("로그인 실패가 반복되어 계정이 잠겼습니다. " + LOCK_MINUTES + "분 후 다시 시도해주세요.");
        }

        if (!matchesPasswordAndUpgradeIfNeeded(user, request.password())) {
            recordLoginFailure(user, now);
            throw new IllegalArgumentException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        user.markLoginSuccess();
        return toAuthResponse(user);
    }

    public boolean isLoginIdAvailable(String rawLoginId) {
        String loginId = normalizeLoginId(rawLoginId);
        validateLoginId(loginId);
        return !userRepository.existsByLoginId(loginId);
    }

    private String resolveLoginIdentifier(LoginRequest request) {
        String loginId = normalizeLoginId(request.loginId());
        if (!isBlank(loginId)) {
            return loginId;
        }

        // 이전 프론트/HTTP 테스트 요청이 email을 보내는 경우를 위한 호환 처리입니다.
        if (!isBlank(request.email())) {
            String email = request.email().trim();
            return userRepository.findByEmail(email)
                    .map(User::getLoginId)
                    .orElse(normalizeLoginId(email.contains("@") ? email.substring(0, email.indexOf('@')) : email));
        }

        throw new IllegalArgumentException("아이디를 입력해주세요.");
    }

    private boolean matchesPasswordAndUpgradeIfNeeded(User user, String rawPassword) {
        String storedPassword = user.getPassword();

        if (passwordEncoder.matches(rawPassword, storedPassword)) {
            return true;
        }

        // 기존 DB에 평문 비밀번호가 들어있던 계정은 첫 로그인 성공 시 BCrypt로 자동 전환합니다.
        if (storedPassword != null && storedPassword.equals(rawPassword)) {
            user.changePassword(passwordEncoder.encode(rawPassword));
            return true;
        }

        return false;
    }

    private void recordLoginFailure(User user, LocalDateTime now) {
        int nextFailedCount = user.getFailedLoginCount() + 1;
        LocalDateTime lockedUntil = nextFailedCount >= MAX_FAILED_LOGIN_COUNT
                ? now.plusMinutes(LOCK_MINUTES)
                : null;

        user.recordLoginFailure(lockedUntil);
    }

    private String resolveEmail(SignupRequest request, String loginId) {
        if (!isBlank(request.email())) {
            return request.email().trim();
        }
        // 이메일 입력을 받지 않는 일반 가입 계정은 내부용 가상 이메일을 저장합니다.
        // 기존 email NOT NULL/UNIQUE 제약을 유지하기 위한 값이며, 로그인에는 사용하지 않습니다.
        return loginId + "@local.reown";
    }

    private void validateLoginId(String loginId) {
        if (isBlank(loginId)) {
            throw new IllegalArgumentException("아이디를 입력해주세요.");
        }
        if (!LOGIN_ID_PATTERN.matcher(loginId).matches()) {
            throw new IllegalArgumentException("아이디는 4~20자의 영문 소문자, 숫자, 밑줄(_)만 사용할 수 있습니다.");
        }
    }

    private void validatePassword(String password) {
        if (isBlank(password)) {
            throw new IllegalArgumentException("비밀번호를 입력해주세요.");
        }
        if (password.length() < 8) {
            throw new IllegalArgumentException("비밀번호는 8자 이상이어야 합니다.");
        }
        if (password.chars().anyMatch(Character::isWhitespace)) {
            throw new IllegalArgumentException("비밀번호에는 공백을 사용할 수 없습니다.");
        }
        boolean hasLetter = password.chars().anyMatch(Character::isLetter);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        if (!hasLetter || !hasDigit) {
            throw new IllegalArgumentException("비밀번호는 영문과 숫자를 모두 포함해야 합니다.");
        }
    }

    private UserRole resolveSignupRole(SignupRequest request) {
        String requestedType = normalizeAccountType(request.accountType());

        // 신규 프론트가 accountType을 보내지 않는 경우 기존 role 값과 호환합니다.
        if (requestedType == null && request.role() != null) {
            requestedType = request.role().name();
        }

        if (requestedType == null || requestedType.isBlank() || "USER".equals(requestedType)) {
            return UserRole.USER;
        }

        if ("SELLER".equals(requestedType) || "BRAND_SELLER".equals(requestedType)) {
            validateSellerSignup(request);
            return UserRole.SELLER_PENDING;
        }

        if ("ADMIN".equals(requestedType)) {
            validateAdminSignup(request);
            return UserRole.ADMIN_PENDING;
        }

        if ("DESIGNER".equals(requestedType)) {
            throw new IllegalArgumentException("디자이너 권한은 회원가입으로 직접 선택할 수 없습니다. 관리자 승인 후 부여됩니다.");
        }

        if ("SELLER_PENDING".equals(requestedType)) {
            validateSellerSignup(request);
            return UserRole.SELLER_PENDING;
        }

        if ("ADMIN_PENDING".equals(requestedType)) {
            validateAdminSignup(request);
            return UserRole.ADMIN_PENDING;
        }

        if ("MASTER".equals(requestedType)) {
            throw new IllegalArgumentException("MASTER 권한은 회원가입으로 직접 부여할 수 없습니다.");
        }

        throw new IllegalArgumentException("지원하지 않는 회원가입 유형입니다: " + requestedType);
    }

    private String normalizeAccountType(String accountType) {
        if (accountType == null) {
            return null;
        }
        return accountType.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeLoginId(String loginId) {
        return loginId == null ? null : loginId.trim().toLowerCase(Locale.ROOT);
    }

    private void validateSellerSignup(SignupRequest request) {
        if (isBlank(request.brandName())) {
            throw new IllegalArgumentException("셀러 회원가입은 브랜드명이 필요합니다.");
        }
    }

    private void validateAdminSignup(SignupRequest request) {
        if (isBlank(request.adminCode())) {
            throw new IllegalArgumentException("관리자 신청 코드를 입력해주세요.");
        }

        String expectedCode = adminInviteCode == null ? "REOWN_ADMIN_2026" : adminInviteCode.trim();
        String submittedCode = request.adminCode().trim();

        if (!expectedCode.equals(submittedCode)) {
            throw new IllegalArgumentException("관리자 신청 코드가 올바르지 않습니다.");
        }
    }

    private Brand createPendingBrandApplication(Long ownerUserId, SignupRequest request) {
        return new Brand(
                ownerUserId,
                request.brandName().trim(),
                blankToNull(request.brandLogoUrl()),
                blankToNull(request.businessNumber()),
                isBlank(request.settlementCycle()) ? "MONTHLY" : request.settlementCycle().trim().toUpperCase(Locale.ROOT)
        );
    }

    private String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private AuthResponse toAuthResponse(User user) {
        if (!isBrandAccount(user.getRole())) {
            return AuthResponse.from(user);
        }

        Optional<Brand> brand = findRepresentativeBrand(user.getUserId());

        return brand
                .map(item -> AuthResponse.from(user, item.getBrandId(), item.getBrandName()))
                .orElseGet(() -> AuthResponse.from(user));
    }

    private boolean isBrandAccount(UserRole role) {
        return role == UserRole.SELLER_PENDING || role == UserRole.SELLER || role == UserRole.DESIGNER;
    }

    private Optional<Brand> findRepresentativeBrand(Long ownerUserId) {
        List<Brand> brands = brandRepository.findByOwnerUserId(ownerUserId);

        return brands.stream()
                .filter(brand -> "APPROVED".equalsIgnoreCase(brand.getStatus()))
                .min(Comparator.comparing(Brand::getBrandId))
                .or(() -> brands.stream().min(Comparator.comparing(Brand::getBrandId)));
    }
}
