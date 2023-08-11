import { decode } from 'html-entities'

const replyMsg = (msg) => {
  if (msg.includes(' (_hr) ')) {
    const replies = []

    msg.split(' (hr_) ').forEach(e => {
      if (e.includes(' (_hr) ')) {
        const tmp = e.split(' (_hr) ')
        const user = tmp[1].split('_')

        replies.unshift({
          message: decode(tmp[0]),
          username: decode(user[0]),
          time: Number(user[1]),
        })

        replies.sort((a, b) => {
          return (a.time - b.time)
        })
      } else {
        // @ts-ignore
        replies.unshift(e)
      }
    })

    return replies
  }

  return null
}

export const publicMessage = (input) => {
  if (input.substring(0, 1) !== '"') return null

  const message = input.substring(1)

  if (message.indexOf('<') === -1) {
    const tmp = message.split('>')
    if (tmp.length === 11) {
      if (/^\d+$/.test(tmp[0])) {
        const reply = replyMsg(tmp[3])
        const message = reply ? String(reply.shift()) : tmp[3]

        const msg = {
          timestamp: Number(tmp[0]),
          avatar: tmp[1],
          username: decode(tmp[2]),
          message: decode(message),
          color: tmp[5],
          uid: tmp[8],
          title: tmp[9] === "'108" ? '花瓣' : tmp[9],
          messageId: Number(tmp[10]),
          replyMessage: reply,
        }
        // PublicMessage
        return msg
      }
    }
  }
}
