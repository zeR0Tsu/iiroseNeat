import { decode } from 'html-entities'

export const joinRoom = (message) => {
  const tmp = message.split('>')
  if (tmp.length === 12) {
    if (/\d+/.test(tmp[0])) {
      if (tmp[3] === "'1") {
        const msg = {
          timestamp: Number(tmp[0]),
          avatar: tmp[1],
          username: decode(tmp[2]),
          color: tmp[5],
          uid: tmp[8],
          title: tmp[9] === "'108" ? '花瓣' : tmp[9],
          room: tmp[10],
        }
        // JoinRoom
        return msg
      }
    }
  }
}
