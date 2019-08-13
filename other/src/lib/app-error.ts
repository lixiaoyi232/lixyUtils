export class AppError extends Error {
  [key: string]: any
  constructor(arg: string | {message: string, [key: string]: any}) {
    if (typeof arg === 'string') {
      super(arg)
    } else {
      super(arg.message)
      for (const key in arg) {
        if (key === 'message') continue
        this[key] = arg[key]
      }
    }
  }
}
