import { damaku } from './Damaku.js'
import { joinRoom } from './JoinRoom.js'
import { leaveRoom } from './LeaveRoom.js'
import { switchRoom } from './SwitchRoom.js'
import { music } from './Music.js'
import { paymentCallback } from './PaymentCallback.js'
import { privateMessage } from './PrivateMessage.js'
import { publicMessage } from './PublicMessage.js'
import { manyMessage } from './ManyMessage.js'
import { userList } from './Userlist.js'
import { getUserListCallback } from './GetUserListCallback.js'
import { userProfileCallback } from './UserProfileCallback.js'
import { bankCallback } from './BankCallback.js'
import { mediaListCallback } from './MediaListCallback.js'
import { selfMove } from './SelfMove.js'
import { mailboxMessage } from './MailboxMessage.js'


export const decoder = (msg, botId) => {
  const len = {}

  len.manyMessage = manyMessage(msg)
  len.userlist = userList(msg)
  len.publicMessage = publicMessage(msg)
  len.leaveRoom = leaveRoom(msg)
  len.joinRoom = joinRoom(msg)
  len.privateMessage = privateMessage(msg)
  len.damaku = damaku(msg)
  len.switchRoom = switchRoom(msg)
  len.music = music(msg)
  len.paymentCallback = paymentCallback(msg)
  len.getUserListCallback = getUserListCallback(msg)
  len.userProfileCallback = userProfileCallback(msg)
  len.bankCallback = bankCallback(msg)
  len.mediaListCallback = mediaListCallback(msg)
  len.selfMove = selfMove(msg)
  len.mailboxMessage = mailboxMessage(msg)

  const newObj = {}
  for (const key in len) {
    // 如果对象属性的值不为空，就保存该属性（如果属性的值为0 false，保存该属性。如果属性的值全部是空格，属于为空。）
    if ((len[key] === 0 || len[key] === false || len[key]) && len[key].toString().replace(/(^\s*)|(\s*$)/g, '') !== '') {
      if (key === 'manyMessage') {
        newObj[key] = len[key]
      }

    //   if (len[key].uid) {
    //     if (len[key].uid !== botId) { newObj[key] = len[key] }
    //   }
      newObj[key] = len[key]// 我感觉是这个，因为这个是不等于botid
    }
  }

  return newObj
}
