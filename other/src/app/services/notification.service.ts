import path from 'path'
import { Member } from '../entities/member'
import { getRepository } from 'typeorm'
import { MemberNotification } from '../entities/member-notification'
let nodemailer = require('nodemailer')

const memberNotificationRepo = getRepository(MemberNotification)

export async function memberNotify(arg: number | Member | Member[], content: string) {
  let notifications: MemberNotification[] = []
  if (typeof arg === 'number') {
    let member = new Member()
    member.id = arg
    notifications.push(new MemberNotification({member, content}))
  } else if (arg instanceof Member) {
    notifications.push(new MemberNotification({member: arg, content}))
  } else if (Array.isArray(arg)) {
    for (let member of arg) {
      notifications.push(new MemberNotification({member, content}))
    }
  }

  await memberNotificationRepo.save(notifications)
}

export async function memberMail(members: Member[], subject = '', text = '', html = '', fileArr: string[] = []) {
  let emails: string[] = []
  members.map(item => {
    if (/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(item.email)) emails.push(item.email)
  })
  let smtpConfig = {
    host: 'smtp.163.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'westchinastory@163.com',
      pass: 'ysriver123456'
    }
  }
  let attachments = []
  for (let i of fileArr) if (i !== '') attachments.push({filename : path.basename(i), path: `.${i}`})
  nodemailer.createTransport(smtpConfig).sendMail({
    from: smtpConfig.auth.user,
    to: emails.join(','),
    subject,
    text,
    html,
    attachments
  })
}

