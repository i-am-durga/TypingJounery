const rateLimitMap = new Map();

export function rateLimit(ip: string, limit: number = 10, windowMs: number = 60000) {
    const now = Date.now();
    const userLimit = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

    if (now > userLimit.resetTime) {
        userLimit.count = 1;
        userLimit.resetTime = now + windowMs;
    } else {
        userLimit.count++;
    }

    rateLimitMap.set(ip, userLimit);

    return {
        success: userLimit.count <= limit,
        remaining: Math.max(0, limit - userLimit.count),
    };
}
