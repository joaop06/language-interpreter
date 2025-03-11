type En = {
  HELLO: string;
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

export default En;
