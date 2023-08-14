import WS from 'ws'
import send from './send.js'
import pako from 'pako'
import { decoder } from './decoder/index.js'
import { EventEmitter } from 'events'

import PublicMessage from './encoder/messages/PublicMessage.js'
import PrivateMessage from './encoder/messages/PrivateMessage.js'
import UserProfile from './encoder/user/UserProfile.js'


export const botEvent = new EventEmitter()

export class BOT {
    constructor(userName, userPasswd, userRoomId, userId, color) {
        this.userName = userName
        this.userPasswd = userPasswd
        this.userRoomId = userRoomId
        this.userId = userId
        this.reConnectCount = 5
        this.count = 0
        this.color = color
        this.login(userRoomId)
    }
    /**
     * - 登录对应的账户
     * @param {*} roomId -
     */
    login (roomId) {
        this.count++
        if (this.count > this.reConnectCount) { return }

        // 这一行是禁止检测的
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
        this.ws = new WS('wss://m2.iirose.com:8778')
        this.ws.onopen = () => {
            const loginPack = '*' + JSON.stringify({
                r: roomId,
                n: this.userName,
                p: this.userPasswd,
                st: 'n',
                mo: '',
                mb: '',
                mu: '01'
            })
            send(this.ws, loginPack)
            this.status = 'online'
            setInterval(() => { send(this.ws, '') }, 50000)
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

        this.ws.onclose = (e) => {
            e.target.close()
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
                this.switchType(test)
            }
        } else {
            this.switchType(funcObj)
        }
    }

    switchType (msg) {
        if (msg.hasOwnProperty('userlist')) {
            const data = {}
            msg.userlist.forEach(element => {
                data[element.uid] = element
            });

            return botEvent.emit('botEvent', this.userId, data)
        }
        return botEvent.emit('botEvent', this.userId, msg)
    }
    /**
     * 发送公屏消息
     * @param {string} msg 
     * @param {string} color - <66ccff> 
     */
    sendPublic (msg, color) {
            send(this.ws, PublicMessage(msg, color))
        
    }

    /**
     * 发送私聊消息
     * @param {*} userId 
     * @param {*} msg 
     * @param {*} color 
     */
    sendPrivate(userId,msg,color){
        send(this.ws,PrivateMessage(userId,msg,color))
    }

    UserProfile(username){
        send(this.ws,'r2')
    }
}