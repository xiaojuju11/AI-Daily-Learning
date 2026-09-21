// 判断是否需要重试
export function isRetryable(error: unknown) {
    if (!(error instanceof Error)) {
        return false
    }

    const message = error.message || ''

    //HTTP 状态码判断
    const statusMatch = message.match(/(\d{3})/)
    if (statusMatch) {
        const status = parseInt(statusMatch[1])
        if ([429, 529, 408].includes(status)) return true
        if (status >= 500 && status < 600) return true  // 服务器错误  LLM的问题
        if (status >= 403 && status < 500) return true  //客户端错误
    }

    // 网络错误
    if (message.includes('ECONNRESET') || message.includes('EPIPE')) return true;
    if (message.includes('ETIMEDOUT') || message.includes('timeout')) return true;
    if (message.includes('fetch failed') || message.includes('network')) return true;
    // AI SDK 会把流式错误包装成 NoOutputGeneratedError
    if (message.includes('No output generated')) return true;

    return false;

}

// 指数退避 + 随机抖动
//重试次数越多，等待时间指数翻倍；设置最大等待时间封顶。
//在计算出的延迟基础上，增加 ±25% 随机抖动，避免多个请求同时重试引发惊群效应。最后取整，并保证延迟不会小于 0。
export function calculateDelay(attemp:number,baseMs = 500,maxMs = 30000){
    const exponential = baseMs * Math.pow(2, attemp - 1)
    const capped = Math.min(exponential, maxMs)
    const jitterRange = capped * 0.25
    const jittered = capped + (Math.random() * 2 - 1) * jitterRange
    return Math.max(0,Math.round(jittered))
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}