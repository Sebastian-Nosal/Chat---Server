import { query } from "express";
import groupModel from "../models/group.model.js";
import { HttpGet, HttpPost, ResourceController } from "./controllers.js";

class groupController implements ResourceController
{
    @HttpGet
    async get(user: string, id: string, query:any): Promise<object[]> {
        if(user==='') 
        {
            return undefined;
        }

        if(id)
        {
            try
            {
                const result = await groupModel.findById(id);
                const members = result.members;
                if(members.includes(user)) return [result];
                else return undefined;
            }
            catch(err)
            {
                throw "Internal Error";
            }
        }
        else if(query.member)
        {
            try
            {
                const result = await groupModel.find({$and: [{members: {$in: query.member}},{members: {$in: user}}]});
                if(result.length>0) return result;
                else return null;
            }
            catch(err)
            {
                throw "Internal Error";
            }
        }
        
    }

    @HttpPost
    async post(user: string, body: any, file: any): Promise<boolean> 
    {
        if(user==='')
        {
            return undefined;
        }
        
        const {isPublic=true,members} = body;
        
        if(isPublic&&Array.isArray(members)&&members.includes(user))
        {
            try
            {
                const result = await groupModel.add({public:isPublic,members:members})
                return result;
            }
            catch(err)
            {
                throw "Internal Error";
            }
        }
        else
        {
            return false;
        }
    }

    async patch(user: string, id: string, body: any): Promise<boolean> 
    {
        if(user==='')
        {
            return undefined;
        }

        if(id&&body)
        { 
            try
            {
                const query = {};  
                const {isPublic,toAdd,toDelete} = body;
                const origin = await groupModel.findById(id);
                let members:Array<string> = origin.members;
                if(!members.includes(user)) 
                {
                    return undefined
                }

                if(isPublic) 
                {
                    Object.assign(query,{public:isPublic});
                }

                if(toAdd)
                {
                   members.push(...toAdd);   
                }
                if(toDelete)
                {
                    members = members.map(el=>{
                        if(!toDelete.includes(el))
                        {
                            return el;
                        }
                    })
                }
                Object.assign(query,{members:members})
                const result = await groupModel.update(id,query);
                return result
            }
            catch(err)
            {
                throw err;
            }
        }    
}

    async delete(user: string, id: string): Promise<boolean> 
    {
        if(user==='')
        {
            return undefined;
        }

        if(id)
        {
            try
            {
                const original = await groupModel.findById(id);
                if(original.members[0]===user)
                {
                    await groupModel.delete(id);
                    return true;
                }
                else
                {
                    return undefined;
                }
            }
            catch(err)
            {
                throw "Internal Error";
            }
        }
        else
        {

        }
    }
}

export default new groupController();