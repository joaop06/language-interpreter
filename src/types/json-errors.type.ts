export type ErrorsType = {
    COMMON: {
        CONFLICT: string;
        NOT_FOUND: string;
        BAD_REQUEST: string;
        ALREADY_EXISTS: string;
        INTERNAL_SERVER_ERROR: string;
        INVALID_TRANSLATE_CODE: string;
    };
    MODULES: {
        APPOINTMENTS: {
            CREATE: {
                OVER_LAPPING: string;
            };
        };
    };
};