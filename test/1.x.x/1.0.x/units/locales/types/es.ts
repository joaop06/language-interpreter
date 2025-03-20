type Es = {
  HELLO: string;
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

export default Es;
