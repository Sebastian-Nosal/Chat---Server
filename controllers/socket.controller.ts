import { Request } from 'express';
import WebSocket, { WebSocketServer } from 'ws';
//import {wss} from '../bin/www.js';
import groupModel from "../models/group.model.js";
import messageModel from '../models/message.model.js';
import authController from "./auth.controller.js";

const UNALLOWED = '{"message": "Not allowed"}';
const ALLOWED = '{"message": "Allowed"}';
const ERROR = '{"message": "Internal error"}';
const GROUP_NOT_EXIST = '{"message": "Group not exist"}';   

type dataType = {
    token:string,
    content:string|boolean,
    groupId:string,

}

export default function handle(wss:WebSocketServer) {
    wss.on('connection',(ws:WebSocket,req:Request)=>{
        Object.assign(ws,{room:new Set()});
        //console.log('WS connected');
        ws.on('message',async (msg:Buffer)=>{
            try
            {
                const data:dataType = JSON.parse(msg.toString());
                const user = authController.checkToken(data.token);
                const group = await groupModel.findById(data.groupId);
                delete data.token;
                if(user&&group&&group.members.includes(user))
                {
                    //@ts-ignore
                    ws.room.add(data.groupId);
                    if(data.content===false)
                    {
                        const resp = {code:200,description:"Verified"}
                        ws.send(JSON.stringify(resp));
                    }
                    else
                    {
                        const messageToStore = {target:data.groupId,content: data.content,author:user,received:[],attachments:''};
                        await messageModel.add(messageToStore);
                        for(const client of wss.clients)
                        {
                            //@ts-ignore
                            if(client.room.has(data.groupId))
                            {
                                const resp = {
                                    code: 200,
                                    groupId: data.groupId,
                                    content: data.content,
                                }
                                client.send(JSON.stringify(resp))
                            }
                        }
                    }
                }
                else
                {
                    ws.send(JSON.stringify({code: 400,description: "incorrect data"}))
                }
            }
            catch(err)
            {
                ws.send(JSON.stringify({code: 500,description: "internal problem"}))
            }

        });

        ws.on('close',(msg)=>{
            //@ts-ignore
            delete ws.room;
            ws.close();
        })
    })
}

