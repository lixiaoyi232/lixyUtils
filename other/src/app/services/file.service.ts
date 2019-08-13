import path from 'path'
import fs from 'fs-extra'

const rootDir = path.join(__dirname, '../../../')

export async function moveFile(tempFilePath: string, newFilePath: string) {
  // await deleteFile(newFilePath)
  await fs.ensureDir(path.join(rootDir, path.dirname(newFilePath)))
  await fs.move(path.join(rootDir, tempFilePath), path.join(rootDir, newFilePath))
}

export async function copyFile(tempFilePath: string, newFilePath: string) {
  // await deleteFile(newFilePath)
  await fs.ensureDir(path.join(rootDir, path.dirname(newFilePath)))
  await fs.copy(path.join(rootDir, tempFilePath), path.join(rootDir, newFilePath))
}

export async function deleteFile(filePath: string | null) {
  if (filePath != null && filePath !== '') {
    let p = path.join(rootDir, filePath)
    if (await fs.pathExists(p)) {
      await fs.remove(p)
    }
  }
}

