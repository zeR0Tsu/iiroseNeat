export const bankCallback = (message) => {
  if (message.substr(0, 2) === '>$') {
    const tmp = message.substr(2).split('"')
    const data = {
      total: Number(tmp[0]),
      income: Number(tmp[1]),
      deposit: Number(tmp[3].split(' ')[0]),
      interestRate: [Number(tmp[5].split(' ')[0]), Number(tmp[5].split(' ')[1])],
      balance: Number(tmp[4])
    }

    // BankCallback
    return data
  }
}
