import multer from 'koa-multer'
import compose from 'koa-compose'
import path from 'path'
import { Koa, uuid22 } from '..'

let storage = multer.diskStorage({
  destination: path.join(__dirname, '../../../uploads/temp/'),
  filename: function (req, file, cb) {
    cb(null, uuid22() + path.extname(file.originalname))
  }
})

let upload = multer({
  storage,
  limits: {
    // fieldNameSize:   // field 名字最大长度	100 bytes
    // fieldSize:       // field 值的最大长度	1MB
    // fields: 	        // 非文件 field 的最大数量	无限
    // fileSize:       	// 在 multipart 表单中，文件最大长度 (字节单位)	无限
    // files:           // 在 multipart 表单中，文件最大数量	无限
    // parts:           // 在 multipart 表单中，part 传输的最大数量(fields + files)	无限
    // headerPairs:    	// 在 multipart 表单中，键值对最大组数	2000
  }
})

let koa2fix = async (ctx: Koa.Context, next: Koa.Next) => {
  ctx.request.body  = (ctx.req as any).body
  ctx.request.file  = (ctx.req as any).file
  ctx.request.files = (ctx.req as any).files
  await next()
}


export function uploadSingle(fieldName: string) {
  return compose([upload.single(fieldName), koa2fix])
}

export function uploadArray(fieldName: string, maxCount?: number) {
  return compose([upload.array(fieldName, maxCount), koa2fix])
}

export function uploadFields(fields: multer.Field[]) {
  return compose([upload.fields(fields), koa2fix])
}

export function uploadAny() {
  return compose([upload.any(), koa2fix])
}

