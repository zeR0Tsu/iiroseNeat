import { decode } from 'html-entities'

export const mediaListCallback = (message) => {
  if (message.substr(0, 1) === '~') {
    const result  = message.substr(1).split('<').map((e, i) => {
      const tmp = e.split('>')
      return {
        id: `${i}_${tmp[0]}`,
        length: Number(tmp[0]),
        title: decode(tmp[1]),
        color: tmp[2].substr(0, 6),
        name: tmp[2].substr(6),
        type: Number(tmp[3]),
        avatar: tmp[4],
        cover: `http${tmp[5]}`,
      }
    })
    // MediaListCallback
    return result
  }
}
