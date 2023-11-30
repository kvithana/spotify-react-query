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
    return new Promise((resolve, reject) => {
      let success = false
      const timer = setInterval(() => {
        if (fn()) {
          success = true
          clearInterval(timer)
          resolve(true)
        }
      }, options?.interval ?? 100)

      setTimeout(() => {
        if (!success) {
          clearInterval(timer)
          reject(new Error("Wait until timed out"))
        }
      }, options?.timeout ?? 10000)
    })
  }
}
