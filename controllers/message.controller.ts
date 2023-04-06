import { ParsedQs } from "qs";
import { HttpDelete, HttpGet, HttpPatch, HttpPost, ResourceController } from "./controllers.js";
import messageModel from "../models/message.model.js";
import {v1 as uuid} from 'uuid';
import groupModel from "../models/group.model.js";

class MessageController implements ResourceController
{
    /*
    content:String,
    target:String,
    received:Array,
    group:Boolean,
    author:String,
    attachmets:{type:String,default:'''},
    date: {type:Date,default:Date.now}
    */

    @HttpGet
    async get(user: string, id: any, query: ParsedQs): Promise<object[]> {
        if(user==='') 
        {
            return undefined;
        }
        else
        {
            if(id) 
            {
                try
                {
                    const result = [await messageModel.findById(id)];
                    if(result[0].author===user)
                    {
                        return result
                    }
                    else {
                        return result;
                    }
                }
                catch(err)
                {
                    throw "Internal Error";
                }
            }
            else if(query.target)
            {
                try
                {
                    const result = await messageModel.find({target: query.target});
                    console.log(result);
                    const group = await groupModel.findById(query.target.toString());
                    console.log(group)
                    if(group.members.includes(user)) return result;
                    else return undefined;
                }
                catch(err)
                {
                    throw "Internal Error";
                }    
            }
            else 
            {
                return null;
            }
        }
    }

    @HttpPost
    async post(user: string, body: any,file:any): Promise<boolean> {
        if(user==='')
        {
            return undefined;
        }
        
        const isFile = Boolean(file);
        let attachmets;
        const {content,target} = body;
        const values = {}
        if(target)
        { 
            Object.assign(values,{target:target})
        } 
        else
        {
            return false;
        }
        if(content===undefined||content===null)
        {
            Object.assign(values,{content:''})
        }
        else
        {
            Object.assign(values,{content:content})
        }
        /*if(group)
        {
            Object.assign(values,{group:Boolean(group)});
        }*/
        if(isFile)
        {
            const dirId = uuid();
            for(var f of file)
            {
                f.mv(__dirname+'/uploads/'+dirId+f.name);
                attachmets = dirId;
            }
        }
        Object.assign(values,{received:[]})
        Object.assign(values,{attachmets:attachmets})
        Object.assign(values,{author:user})
        const result = await messageModel.add(values);
        return result;
    }

    @HttpPatch
    async patch(user: string, id: string, body: any): Promise<boolean> {
        throw "Internal Error";
        return false;
    }
    
    @HttpDelete
    async delete(user: string, id: string): Promise<boolean> {
        if(user==='')
        {
            return undefined;
        }
        if(id)
        {
            let origin;
            try
            {
                 origin = await messageModel.findById(id);
            }
            catch(e)
            {
                throw "Internal Error";
            }
            
            if(origin.author===user)
            {
                try
                {
                    const result = await messageModel.delete(id);
                    return result;
                }
                catch(e)
                {
                    throw "Internal Error";
                }
            }
            else
            {
                return false;
            }
        }
        else 
        {
            return null;
        }
    }
}

export default new MessageController();