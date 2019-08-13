import { redis } from '../../lib'
import { Member } from '../entities/member'
import { Admin } from '../entities/admin'
import { config } from '../../config/config'
import { getRepository } from 'typeorm'
import { MemberNotification } from '../entities/member-notification'
import { ANotRead } from '../entities/a-not-read'

let memberRepo = getRepository(Member)
let adminRepo = getRepository(Admin)
const notificationRepo = getRepository(MemberNotification)
const aNotReadRepo = getRepository(ANotRead)

export async function sessionGetMember(id: number) {
  let key = 'auth_member:' + id
  let str = await redis.get(key)
  if (str == null) {
    return null
  }
  let member = JSON.parse(str) as Member
  return member
}

export async function sessionUpdateMember(id: number) {
  let key = 'auth_member:' + id
  if (await redis.get(key) == null) {
    return
  }
  let member = await memberRepo.findOne({
    where: {id},
    relations: [
      'country', 'county', 'county.city', 'county.city.province',
      'student', 'student.school', 'student.school.member',
      'student.aidApplies', 'student.applySchool', 'student.applySchool.member',
      'teacher', 'teacher.school', 'teacher.school.member',
      'school',
      'whPerson', 'whPerson.whGroup', 'whPerson.whGroup.member',
      'whGroup',
    ]
  })

  if (!member) {
    return
  }
  delete member['password']
  let notifications = await notificationRepo.find({select: ['id'], where: {member, isRead: false}})
  ; (member as any).notReadNoti = notifications.length
  let chatSumArr = await aNotReadRepo.createQueryBuilder('own').select(['own.id id', 'sum(own."mNumber") sum']).groupBy('own.id').where(`own."memberId"=${member.id}`).getRawMany()
  ; (member as any).notReadChat = chatSumArr.length !== 0 ? chatSumArr[0].sum : 0

  let str = JSON.stringify(member)
  await redis.set(key, str, 'PX', config.session.maxAge)
}

export async function sessionDelMember(id: number) {
  let key = 'auth_member:' + id
  await redis.del(key)
}

export async function sessionGetAdmin(id: number) {
  let key = 'auth_admin:' + id
  let str = await redis.get(key)
  if (str == null) {
    return null
  }
  let admin = JSON.parse(str) as Admin
  return admin
}

export async function sessionUpdateAdmin(id: number) {
  let key = 'auth_admin:' + id
  if (await redis.get(key) == null) {
    return
  }

  let admin = await adminRepo.findOne({id})
  if (!admin) {
    return
  }
  delete admin.password
  admin.permissions = JSON.parse(admin.permissions)

  let str = JSON.stringify(admin)
  await redis.set(key, str, 'PX', config.session.maxAge)
}

export async function sessionDelAdmin(id: number) {
  let key = 'auth_admin:' + id
  await redis.del(key)
}

