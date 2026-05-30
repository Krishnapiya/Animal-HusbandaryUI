package com.example.security;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Aspect
@Component
public class PermissionGuardAspect {

    private final PermissionService permissionService;
    private final SecurityPrincipalService securityPrincipalService;

    public PermissionGuardAspect(
        PermissionService permissionService,
        SecurityPrincipalService securityPrincipalService
    ) {
        this.permissionService = permissionService;
        this.securityPrincipalService = securityPrincipalService;
    }

    @Around("@annotation(requirePermission)")
    public Object enforcePermission(ProceedingJoinPoint pjp, RequirePermission requirePermission) throws Throwable {
        Long userId = securityPrincipalService.currentUserId();
        boolean allowed = permissionService.hasPermission(
            userId,
            requirePermission.menu(),
            requirePermission.action()
        );
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Permission denied");
        }
        return pjp.proceed();
    }
}
