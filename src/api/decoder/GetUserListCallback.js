export const getUserListCallback = (message) => {
  if (message.substr(0, 2) === 'u2') {
    const list = []
    message.substr(2).split('<').forEach(e => {
      const tmp = e.split('>')
      if (tmp.length >= 8) {
        list.push({
          avatar: tmp[0],
          username: tmp[2],
          color: tmp[3],
          room: tmp[4],
          uid: tmp[8],
        })
      }
    })
    // GetUserListCallback
    return list
  }
}
