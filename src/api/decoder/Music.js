export const music = (message) => {
  if (message.substr(0, 2) === '&1') {
    const tmp = message.substr(2).split('>')
    if (tmp.length === 7) {
      const msg = {
        url: `http${tmp[0].split(' ')[0]}`,
        link: `http${tmp[0].split(' ')[1]}`,
        duration: Number(tmp[1]),
        title: tmp[2],
        singer: tmp[3].substr(2),
        owner: tmp[4],
        pic: `http${tmp[6]}`,
      }

      // music
      return msg
    }
  }
}
