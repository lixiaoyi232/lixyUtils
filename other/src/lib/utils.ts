import crypto from 'crypto'
import libUuid from 'uuid'

export function sha256(str: string) {
  return crypto.createHash('sha256').update(str).digest('hex')
}

export function uuid32() {
  return libUuid.v1()
}

const uuidData = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_'
export function uuid22() {
  let uuid = libUuid.v1()
  uuid = uuid.replace(/-/g, '') + '0'
  let uuid22 = ''
  let num = 0
  for (let i = 0; i < uuid.length; i += 3) {
    num = parseInt(uuid[i] + uuid[i + 1] + uuid[i + 2], 16)
    uuid22 += uuidData[Math.floor(num / 64)]
    uuid22 += uuidData[num % 64]
  }
  return uuid22
}

export function kebabCaseToCamelCase(str: string) {
  return str.replace(/-(\w)/g, ($0, $1) => $1.toUpperCase())
}

export function kebabCaseToPascalCase(str: string) {
  return kebabCaseToCamelCase(str).replace(/^(\w)/, ($0, $1) => $1.toUpperCase())
}
