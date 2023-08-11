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

export const manyMessage = (input) => {
  if (input.substring(0, 1) !== '"') return null

  const message = input.substring(1)
  if (message.indexOf('<') !== -1) {
    const tmp1 = message.split('<')
    let output = []

    tmp1.forEach(e => {
      const tmp = e.split('>')
      if (/^\d+$/.test(tmp[0])) {
        if (tmp.length === 11) {
          const reply = replyMsg(tmp[3])
          // PublicMessage
          output.push({
            type: 'publicMessage',
            timestamp: Number(tmp[0]),
            avatar: tmp[1],
            username: decode(tmp[2]),
            message: decode(reply ? String(reply.shift()) : tmp[3]),
            color: tmp[5],
            uid: tmp[8],
            title: tmp[9] === "'108" ? '花瓣' : tmp[9],
            messageId: Number(tmp[10]),
            replyMessage: reply,
          })
        } else if (tmp.length === 12) {
          if (tmp[3] === "'1") {
            const msg = {
              type: 'joinRoom',
              timestamp: Number(tmp[0]),
              avatar: tmp[1],
              username: decode(tmp[2]),
              color: tmp[5],
              uid: tmp[8],
              title: tmp[9] === "'108" ? '花瓣' : tmp[9],
              room: tmp[10],
            }
            // JoinRoom
            output.push(msg)
          } else if (tmp[3].substr(0, 2) === "'2") {
            const msg = {
              type: 'switchRoom',
              timestamp: Number(tmp[0]),
              avatar: tmp[1],
              username: decode(tmp[2]),
              color: tmp[5],
              uid: tmp[8],
              title: tmp[9] === "'108" ? '花瓣' : tmp[9],
              room: tmp[10],
              targetRoom: tmp[3].substr(2),
            }
            // SwitchRoom
            output.push(msg)
          } else if (tmp[3] === "'3") {
            const msg = {
              type: 'leaveRoom',
              timestamp: Number(tmp[0]),
              avatar: tmp[1],
              username: decode(tmp[2]),
              color: tmp[5],
              uid: tmp[8],
              title: tmp[9] === "'108" ? '花瓣' : tmp[9],
              room: tmp[10],
            }
            // LeaveRoom
            output.push(msg)
          }
        }
      }
    })
    return output
  }
}