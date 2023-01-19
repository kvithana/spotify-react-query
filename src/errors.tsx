

export class BadRequestError extends Error {
  constructor(code: number, message: string) {
    super(`[${code}] ` + message)
    this.name = 'BadRequestError'
  }
}

export class UnauthorizedError extends Error {
  constructor(code: number, message: string) {
    super(`[${code}] ` + message)
    this.name = 'UnauthorizedError'
  }
}

export class TooManyRequestsError extends Error {
  constructor(code: number, message: string) {
    super(`[${code}] ` + message)
    this.name = 'TooManyRequestsError'
  }
}

export class NotFoundError extends Error {
  constructor(code: number, message: string) {
    super(`[${code}] ` + message)
    this.name = 'NotFoundError'
  }
}

export function getError(status: number, body: any): Error {
    switch (status) {
        case 400:
        return new BadRequestError(status, body)
        case 401:
        return new UnauthorizedError(status, body)
        case 429:
        return new TooManyRequestsError(status, body)
        case 404:
        return new NotFoundError(status, body)
        default:
        return new Error(`[${status}] ${body}`)
    }
}
