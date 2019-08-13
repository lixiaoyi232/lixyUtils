import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm'
import { MemberSchool } from './member-school'
import { Chat } from './chat'
import { AChat } from './a-chat'
import { ANotRead } from './a-not-read'

@Entity()
export class Admin {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  createdTime!: Date

  @Column()
  updatedTime!: Date



  @Column({
    unique: true
  })
  account!: string

  @Column()
  password!: string

  @Column({
    default: false
  })
  isSuperUser!: boolean

  @Column()
  permissions!: string

  // 该用户管辖的学校
  @OneToMany(type => MemberSchool, school => school.admin)
  schools!: MemberSchool[]

  // 群聊记录
  @OneToMany(type => Chat, chat => chat.belong)
  chats!: Chat[]

  // 群聊记录（我说的）
  @OneToMany(type => Chat, chat => chat.senderA)
  myChats!: Chat[]

  // 单聊记录（我说的）
  @OneToMany(type => AChat, aChat => aChat.admin)
  aChats!: AChat[]

  // 单聊未读
  @OneToMany(type => ANotRead, aNotRead => aNotRead.admin)
  aNotReads!: ANotRead[]

  @Column({
    default: 0
  })
  notRead!: number

  @Column({
    default: 0
  })
  notReadSU!: number


  @BeforeInsert()
  beforeInsert() {
    let date = this.createdTime || new Date()
    this.createdTime = date
    this.updatedTime = date
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedTime = new Date()
  }
}
