export const APP_ERROR_CODE = {
    Validation: 'VALIDATION_ERROR',
    NotFound: 'NOT_FOUND_ERROR',
    Auth: 'AUTH_ERROR',
    Conflict: 'CONFLICT_ERROR',
    ExternalService: 'EXTERNAL_SERVICE_ERROR',
    Internal: 'INTERNAL_ERROR',
} as const;

export type AppErrorCode = (typeof APP_ERROR_CODE)[keyof typeof APP_ERROR_CODE];
