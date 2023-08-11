import { botList, nameList, BOT, botEvent } from './src/index.js'
import { WebSocketServer } from 'ws'
// 前端
const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
console.log("LINK OK!");
console.log(botList);
    ws.send(JSON.stringify({
        msg:{
            config:{
                bot:botList
            }
        }
    }))

    ws.on('error', console.error);

    ws.on('message', (data) => {
        const {userId,msg,color}=JSON.parse(data)
        console.log('received: %s', data);
        botList[userId].sendMessage(msg,color)
    });

    botEvent.on('botEvent', (userId, msg) => {
        console.log(msg)
        if (msg) {
            const data = {
                userId: userId,
                msg: msg
            }
            console.log(data);
            ws.send(JSON.stringify(data))
        }
    })
});

// /public