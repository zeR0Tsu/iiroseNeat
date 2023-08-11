import { decode } from 'html-entities'
// import * as api from '../api'
// import config from '../../config'

export const privateMessage = (message) => {
  if (message.substr(0, 2) === '""') {
    const item = message.substr(2).split('<')

    for (const msg of item) {
      const tmp = msg.split('>')

      if (tmp.length === 11) {
        if (/^\d+$/.test(tmp[0])) {
          const msg = {
            timestamp: Number(tmp[0]),
            uid: tmp[1],
            username: decode(tmp[2]),
            avatar: tmp[3],
            message: decode(tmp[4]),
            color: tmp[5],
            messageId: Number(tmp[10]),
          }
          // PrivateMessage
          return msg
        }
      }
    }

    return null
  }
}
