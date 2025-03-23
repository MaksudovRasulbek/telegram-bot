import rateLimit from "telegraf-ratelimit"

const rateLimitConfig = {
    window: 200,    // 1 second window
    limit: 1,        // limit to 1 message per window
    onLimitExceeded: () => {
      return
    }
  };

  const limitMiddleware = rateLimit(rateLimitConfig);
  export default limitMiddleware