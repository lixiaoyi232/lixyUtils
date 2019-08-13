import { redis, AppError } from '../../lib'
import axios from 'axios'
import { date } from '../nunjucks-filters'
import { Member } from '../entities/member'


export async function getAccessToken() {
  let accessToken = await redis.get('weixin_access_token')
  if (accessToken == null) {
    let appid = 'wx24bb29c94cee6ead'
    let secret = '201f98744b0b5f37c43a86aa170c1d92'
    let res = await axios.post(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`)
    await redis.set('weixin_access_token', (accessToken = res.data['access_token'], accessToken), 'EX', res.data['expires_in'] - 60)
  }
  return accessToken
}

export async function getAccessTokenByCode(code: string) {
  let appid = 'wx24bb29c94cee6ead'
  let secret = '201f98744b0b5f37c43a86aa170c1d92'
  let res = await axios.post(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`)
  if (res.data['errcode'] != null) throw new AppError(res.data.errmsg)
  return res.data['openid']
}

export async function getTemplateId(template_id_short: string) {
  let accessToken = await getAccessToken()
  let res = await axios.post(`https://api.weixin.qq.com/cgi-bin/template/api_add_template?access_token=${accessToken}`, {template_id_short})
  if (res.data.errcode !== 0) throw new AppError(res.data.errmsg)
  return res.data.template_id
}

export async function sendWeixinMessage(obj: {touser: string, template_id: string, data: {[propName: string]: {value: string, color?: string}}, url?: string, miniprogram?: string, appid?: string, pagepath?: string}) {
  let accessToken = await getAccessToken()
  let res = await axios.post(`https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`, obj)
  if (res.data.errcode !== 0) throw new AppError(res.data.errmsg)
  return res.data.msgid
}

export async function weixinPush(member: Member, subject = '', text = '') {
  await sendWeixinMessage({
    touser: member.openid,
    template_id: 'd7orpT0eN6XdeVGZ5eZt8nXI9OwvubcaX76-UZTY3xA',
    data: {
      first: {
        value: '尊敬的用户，您有一条新消息',
        color: '#999999'
      },
      keyword1: {
        value: member.name,
        color: '#999999'
      },
      keyword2: {
        value: date(new Date, 'YYYY-MM-DD HH:mm:ss'),
        color: '#999999'
      },
      keyword3: {
        value: 'https://www.westchinastory.cn/',
        color: '#999999'
      },
      remark: {
        value: `主题：${subject}\n内容：${text}`,
        color: '#999999'
      },
    }
  })
}

export async function bandWeixin(openid: string, account: string, password: string) {

}

