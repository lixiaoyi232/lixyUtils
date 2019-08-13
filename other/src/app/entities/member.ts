import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToOne, OneToMany, ManyToMany, ManyToOne, JoinTable } from 'typeorm'
import { MemberType, Gender } from './enum'
import { MemberStudent } from './member-student'
import { MemberTeacher } from './member-teacher'
import { MemberSchool } from './member-school'
import { MemberWHPerson } from './member-whperson'
import { MemberWHGroup } from './member-whgroup'
import { Story } from './story'
import { StoryComment } from './story-comment'
import { Country } from './country'
import { County } from './county'
import { Aid } from './aid'
import { MemberMessage } from './member-message'
import { AidMessage } from './aid-message'
import { SurveyAnswer } from './survey-answer'
import { Chat } from './chat'
import { AChat } from './a-chat'
import { ANotRead } from './a-not-read'
import { MemberNotification } from './member-notification'



@Entity()
export class Member {

  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  createdTime!: Date

  @Column()
  updatedTime!: Date



  // 学生相关信息，用户类型若是学生，则不为空
  @OneToOne(type => MemberStudent, student => student.member)
  student!: MemberStudent

  // 老师相关信息，用户类型若是老师，则不为空
  @OneToOne(type => MemberTeacher, teacher => teacher.member)
  teacher!: MemberTeacher

  // 学校相关信息，用户类型若是学校，则不为空
  @OneToOne(type => MemberSchool, school => school.member)
  school!: MemberSchool

  // 爱心人士相关信息，用户类型若是爱心人士，则不为空
  @OneToOne(type => MemberWHPerson, whPerson => whPerson.member)
  whPerson!: MemberWHPerson

  // 爱心团体相关信息，用户类型若是爱心团体，则不为空
  @OneToOne(type => MemberWHGroup, whGroup => whGroup.member)
  whGroup!: MemberWHGroup


  // 用户名
  @Column({
    unique: true
  })
  account!: string

  // 密码
  @Column()
  password!: string

  // 用户类型
  @Column({
    type: 'enum',
    enum: MemberType
  })
  type!: string

  // 删除标记
  @Column({
    default: false
  })
  del!: boolean

  // 名称
  @Column({
    nullable: true
  })
  name!: string

  // 昵称
  @Column()
  nickName!: string

  // 性别
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true
  })
  gender!: string

  // 民族
  @Column({
    nullable: true
  })
  nation!: string

  // 身份证号
  @Column({
    nullable: true
  })
  idCard!: string

  // 联系人姓名（只有学校和爱心团体才有）
  @Column({
    nullable: true
  })
  contactName!: string

  // 电话号码
  @Column()
  phoneNumber!: string

  // Email
  @Column({
    nullable: true
  })
  email!: string

  // 微信号
  @Column({
    nullable: true
  })
  wechat!: string

  // qq
  @Column({
    nullable: true
  })
  qq!: string

  // 头像
  @Column({
    nullable: true
  })
  avatar!: string

  // 简介
  @Column({
    nullable: true
  })
  intro!: string

  // 国家及地区
  @ManyToOne(type => Country)
  country!: Country

  // 地区（市县）（外国没有该字段）
  @ManyToOne(type => County, county => county.members, {
    onDelete: 'SET NULL'
  })
  county!: County

  // 详细地址
  @Column({
    nullable: true
  })
  areaDetail!: string

  // 是否已经完成信息
  @Column({
    default: false
  })
  isComplemented!: boolean

  // 该用户所写的所有故事
  @OneToMany(type => Story, story => story.author)
  stories!: Story[]

  // 该用户点赞的所有故事
  @ManyToMany(type => Story, story => story.praiseMembers)
  praiseStories!: Story[]

  // 该用户收藏的所有故事
  @ManyToMany(type => Story, story => story.favoriteMembers)
  favoriteStories!: Story[]

  // 该用户举报的所有故事
  @ManyToMany(type => Story, story => story.reportMembers)
  reportStories!: Story[]

  // 该用户所写的所有评论
  @OneToMany(type => StoryComment, comment => comment.author)
  storyComments!: StoryComment[]

  @OneToMany(type => Aid, aid => aid.member)
  aids!: Aid[]

  @OneToMany(type => AidMessage, aidMessage => aidMessage.member)
  aidMessages!: AidMessage[]

  @OneToMany(type => SurveyAnswer, surveyAnswer => surveyAnswer.member)
  surveyAnswers!: SurveyAnswer[]

  // 关注该用户的用户们
  @ManyToMany(type => Member, member => member.followedMembers)
  @JoinTable()
  followers!: Member[]

  // 该用户关注的用户们
  @ManyToMany(type => Member, member => member.followers)
  followedMembers!: Member[]

  // 该用户发送的私信
  @OneToMany(type => MemberMessage, message => message.sender)
  sentMessages!: MemberMessage[]

  // 该用户收到的私信
  @OneToMany(type => MemberMessage, message => message.receiver)
  receivedMessages!: MemberMessage[]

  // 该用户收到的系统通知
  @OneToMany(type => MemberNotification, notification => notification.member)
  notifications!: MemberNotification[]

  // 群聊记录（我说的）
  @OneToMany(type => Chat, chat => chat.senderM)
  myChats!: Chat[]

  // 单聊记录
  @OneToMany(type => AChat, aChat => aChat.member)
  aChats!: AChat[]

  // 单聊未读
  @OneToMany(type => ANotRead, aNotRead => aNotRead.member)
  aNotReads!: ANotRead[]

  @Column({
    default: 0
  })
  notRead!: number

  // 成员
  @OneToMany(type => Member, member => member.group)
  members!: Member[]

  // 所在组
  @ManyToOne(type => Member, member => member.members)
  group!: Member

  // 公众号id
  @Column({
    nullable: true
  })
  openid!: string


  // 数据对接专用
  @Column({
    nullable: true
  })
  dd!: string

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
