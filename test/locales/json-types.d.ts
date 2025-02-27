/**
 * Types to represent the JSON structures of the files
 */
export type JsonTypes = A | B | En | Es | Pt_Br;

export type JsonFilesType = "a" | "b" | "en" | "es" | "pt-br";

/**
 * Structures of each JSON file represented in a specific type
 * @see A
 * @see B
 * @see En
 * @see Es
 * @see Pt_Br
 */

export type A = {
  COMMON: {
    NOT_FOUND: string;
    BAD_REQUEST: string;
    CONFLICT: string;
    ALREADY_EXISTS: string;
    INTERNAL_SERVER_ERROR: string;
    INVALID_TRANSLATE_CODE: string;
  };
};
export type B = {
  KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK: string;
  CREATED: string;
  DELETED: string;
  UPDATED: string;
};
export type En = {
  BACANA: string;
  ERRORS: {
    MODULES: {
      APPOINTMENTS: {
        CREATE: {
          OVER_LAPPING: string;
        };
      };
    };
    VALIDATION: {
      REQUIRED: string;
      STRING: {
        MIN: string;
        MAX: string;
        EMAIL: string;
      };
      NUMBER: {
        MIN: string;
        MAX: string;
        INTEGER: string;
      };
      DATE: {
        INVALID: string;
        FUTURE: string;
        PAST: string;
      };
    };
    AUTH: {
      INVALID_CREDENTIALS: string;
      UNAUTHORIZED: string;
      TOKEN_EXPIRED: string;
      TOKEN_INVALID: string;
    };
    RESOURCE: {
      CREATE: string;
      DELETE: string;
      FIND: string;
      UPDATE: string;
    };
    DATABASE: {
      CONNECTION: string;
      QUERY: string;
      CONSTRAINT: string;
    };
  };
  NOTIFICATIONS: {
    EMAIL: {
      SENT: string;
      FAILED: string;
    };
    PUSH: {
      SENT: string;
      FAILED: string;
    };
  };
  COMMON: {
    LOADING: string;
    PROCESSING: string;
    NO_RESULTS: string;
    WELCOME: string;
    GOODBYE: string;
  };
};
export type Es = {
  ERRORS: {
    MODULES: {
      APPOINTMENTS: {
        CREATE: {
          OVER_LAPPING: string;
        };
      };
    };
    VALIDATION: {
      REQUIRED: string;
      STRING: {
        MIN: string;
        EMAIL: string;
        MAX: string;
      };
      NUMBER: {
        INTEGER: string;
        MAX: string;
        MIN: string;
      };
      DATE: {
        INVALID: string;
        FUTURE: string;
        PAST: string;
      };
    };
    AUTH: {
      TOKEN_INVALID: string;
      TOKEN_EXPIRED: string;
      UNAUTHORIZED: string;
      INVALID_CREDENTIALS: string;
    };
    RESOURCE: {
      CREATE: string;
      FIND: string;
      DELETE: string;
      UPDATE: string;
    };
    DATABASE: {
      CONNECTION: string;
      QUERY: string;
      CONSTRAINT: string;
    };
  };
  NOTIFICATIONS: {
    EMAIL: {
      SENT: string;
      FAILED: string;
    };
    PUSH: {
      SENT: string;
      FAILED: string;
    };
  };
  COMMON: {
    LOADING: string;
    PROCESSING: string;
    NO_RESULTS: string;
    WELCOME: string;
    GOODBYE: string;
  };
};
export type Pt_Br = {
  SUCCESS: {
    RESOURCE: {
      CREATED: string;
      DELETED: string;
      FOUND: string;
      UPDATED: string;
    };
  };
  ERRORS: {
    MODULES: {
      APPOINTMENTS: {
        CREATE: {
          OVER_LAPPING: string;
        };
      };
    };
    COMMON: {
      NOT_FOUND: string;
      ALREADY_EXISTS: string;
      CONFLICT: string;
      BAD_REQUEST: string;
      INTERNAL_SERVER_ERROR: string;
      INVALID_TRANSLATE_CODE: string;
    };
    VALIDATION: {
      REQUIRED: string;
      STRING: {
        MIN: string;
        MAX: string;
        EMAIL: string;
      };
      NUMBER: {
        MIN: string;
        MAX: string;
        INTEGER: string;
      };
      DATE: {
        INVALID: string;
        FUTURE: string;
        PAST: string;
      };
    };
    AUTH: {
      INVALID_CREDENTIALS: string;
      UNAUTHORIZED: string;
      TOKEN_EXPIRED: string;
      TOKEN_INVALID: string;
    };
    RESOURCE: {
      CREATE: string;
      DELETE: string;
      FIND: string;
      UPDATE: string;
    };
    DATABASE: {
      CONNECTION: string;
      QUERY: string;
      CONSTRAINT: string;
    };
  };
  NOTIFICATIONS: {
    EMAIL: {
      SENT: string;
      FAILED: string;
    };
    PUSH: {
      SENT: string;
      FAILED: string;
    };
  };
  COMMON: {
    LOADING: string;
    PROCESSING: string;
    NO_RESULTS: string;
    WELCOME: string;
    GOODBYE: string;
  };
};
