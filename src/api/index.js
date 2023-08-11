import WS from 'ws'
import send from './send.js'
import pako from 'pako'
import { decoder } from './decoder/index.js'
import { EventEmitter } from 'events'

export const botEvent = new EventEmitter()

export class BOT {
    constructor(userName, userPasswd, userRoomId, userId) {
        this.userName = userName
        this.userPasswd = userPasswd
        this.userRoomId = userRoomId
        this.userId = userId
        this.reConnectCount = 5
        this.count = 0
        this.login()
    }

    login () {
        this.count++
        if (this.count > this.reConnectCount) {  return }

        // 这一行是禁止检测的
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
        this.ws = new WS('wss://m2.iirose.com:8778')
        this.ws.onopen = () => {
            const loginPack = '*' + JSON.stringify({
                r: this.userRoomId,
                n: this.userName,
                p: this.userPasswd,
                st: 'n',
                mo: '',
                mb: '',
                mu: '01'
            })
            send(this.ws, loginPack)
            this.status = 'online'
            setInterval(() => { send(this.ws, '') }, 60000)
        }


        this.ws.onmessage = (event) => {
            // @ts-ignore
            const array = new Uint8Array(event.data)

            let message
            if (array[0] === 1) {
                message = pako.inflate(array.slice(1), {
                    to: 'string'
                })
            } else {
                message = Buffer.from(array).toString('utf8')
            }
            this.getMessage(message)
        }

        this.ws.onerror = (error) => {

            console.log(error);
            this.ws.close()
            this.ws = null;

            this.login();
        }

        this.ws.onclose = () => {
            this.ws.close()
            this.ws = null;

            this.login();
        }
    }

    getMessage (msg) {
        const funcObj = decoder(msg, this.userId)
        // 将会话上报
        if (funcObj.hasOwnProperty('manyMessage')) {
            for (let element of funcObj.manyMessage) {
                const test = {}
                test[element.type] = element
                botEvent.emit('botEvent', this.userId, test)
            }
        } else {
            botEvent.emit('botEvent', this.userId, funcObj)
        }
    }

    /**
     * 发送消息
     * @param {string} msg 
     * @param {string} color - <66ccff> 
     */
    sendMessage (msg, color) {
        let data = ''
        if (msg === 'cut') {
            data = `{0${JSON.stringify({
                m: msg,
                mc: color,
                i: Math.random().toString().substr(2, 12),
            })}`
        } else {
            data = JSON.stringify({
                m: msg,
                mc: color,
                i: Math.random().toString().substr(2, 12),
            })
        }

        send(this.ws, data)
    }
}