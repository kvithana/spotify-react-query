import { until } from "./until"

describe("until", () => {
  it("should resolve immediately if the condition is already true", async () => {
    const condition = jest.fn().mockReturnValue(true)
    await expect(until(condition)).resolves.toBe(true)
    expect(condition).toHaveBeenCalledTimes(1)
  })

  it("should resolve after the condition becomes true", async () => {
    let counter = 0
    const condition = jest.fn(() => {
      counter++
      return counter === 5
    })

    const promise = until(condition, { interval: 10 })
    await expect(promise).resolves.toBe(true)
    expect(condition).toHaveBeenCalledTimes(5)
  })

  it("should reject if the timeout is reached", async () => {
    const condition = jest.fn().mockReturnValue(false)
    const promise = until(condition, { timeout: 500, interval: 100 })
    await expect(promise).rejects.toThrow("Wait until timed out")
    expect(condition).toHaveBeenCalledTimes(5)
  })
})
