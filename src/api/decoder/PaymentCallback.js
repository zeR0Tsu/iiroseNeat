export const paymentCallback = (message) => {
  if (message.substr(0, 2) === '|$') {
    // paymentCallback
    return {
      money: Number(message.substr(2)),
    }
  }
}
