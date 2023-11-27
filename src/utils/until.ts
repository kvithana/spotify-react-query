/**
 * Utility function to wait until a condition is met
 * @param fn - function to check
 * @param time - time to wait between checks
 */
export const until = async (
  fn: () => boolean,
  options?: {
    interval?: number
    timeout?: number
  }
) => {
  if (fn()) {
    return Promise.resolve(true)
  } else {
    const p1 = new Promise((resolve) => {
      const timer = setInterval(() => {
        if (fn()) {
          clearInterval(timer)
          resolve(true)
        }
      }, options?.interval ?? 100)
    })
    let p2: Promise<never> | undefined
    if (options?.timeout) {
      p2 = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error("Wait until timed out"))
        }, options.timeout)
      })
    }
    await Promise.race([p1, p2])
  }
}
