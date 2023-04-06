import { NextFunction, Request, Response } from "express";
import AuthController from './auth.controller.js';

export interface ResourceController
{
    get(user:string,string,query:Request['query']):Promise<object[]|null|undefined>
    post(user:string,body:Request['body'], file:any):Promise<boolean|null>
    patch(user:string,id:string,body:Request['body']):Promise<boolean|null>
    delete(user:string,id:string):Promise<boolean|null>
}

export function HttpGet(target,key,descriptor)
{
    const original = descriptor.value;

    descriptor.value = async function(req:Request,res:Response,next:NextFunction)
    {
        const token:string = req.headers.authorization;
        let user;
        const id = req.params.id;
        const query = req.query;
        if(token)  
        {
            user = AuthController.checkToken(token)
        }
        else
        {
            user = '';
        }
        
        try
        {
            const result = await original.apply(this,[user,id,query]);
            if(Array.isArray(result))
            {
                res.status(200).json(result);
                next();
            }
            else if(result===null)
            {
                res.status(404).send('Nothing found');
                next();
            }
            else
            {
                res.status(401).send('Access denied');
                next();
            }
        }
        catch(err)
        {
            //console.log(err);
            res.status(500).send('Internal error')
            next();
        }
    }

    return descriptor;
}

export function HttpPost(target,key,descriptor)
{
    const original = descriptor.value;

    descriptor.value = async function(req:Request,res:Response,next:NextFunction)
    {
        const token:string = req.headers.authorization;
        let user;
        const body = req.body;
        if(token)  
        {
            user = AuthController.checkToken(token)
        }
        else
        {
            user = '';
        }
        let result;
        try 
        {
            result= await original.apply(this,[user,body,req.files]);
            if(result===true)
            {
                res.status(200).send('Resource created');
                next();
                return;
            }
            else if(result === false)
            {
                res.status(400).send('Missing or incorrect data');
                next();
                return;
            }
            else
            {
                res.status(401).send('Access denied'); 
                return;
                next();
            }
        }
        catch(err)
        {
            console.log(err)
            res.status(500).send('Internal error');
            next();
            return;
        }
        
    }

    return descriptor;
}

export function HttpPatch(target,key,descriptor)
{
    const original = descriptor.value;
    descriptor.value = async function(req:Request,res:Response,next:NextFunction)
    {
        const token:string = req.headers.authorization;
        //console.log(req.headers.authorization);
        
        const id = req.params.id
        let user;
        const body = req.body;
        if(token)  
        {
            user = AuthController.checkToken(token)
            //console.log(user);
        }
        else
        {
            user = '';
        }

        try 
        {
            const result = await original.apply(this,[user,id,body]);
            if(result===true)
            {
                res.status(200).send('Resource updated');
                next();
            }
            else if(result === false)
            {
                res.status(400).send('Missing or incorrect data');
                next();
            }
            else if(result===undefined)
            {
                //console.log(result);
                res.status(401).send('Access denied'); 
                next();
            }
        }
        catch(err)
        {
            res.status(500).send('Internal error');
            next();
        }
    }
    
    return descriptor;
}

export function HttpDelete(target,key,descriptor)
{
    const original = descriptor.value;
    descriptor.value = async function(req:Request,res:Response,next:NextFunction)
    {
        const token:string = req.headers.authorization;
        let user;
        const id = req.params.id;
        if(token)  
        {
            user = AuthController.checkToken(token)
        }
        else
        {
            user = '';
        }

        try 
        {
            const result = await original.apply(this,[user,id]);
            if(result===true)
            {
                res.status(200).send('Resource deleted');
                next();
            }
            else if(result === false)
            {
                res.status(401).send('Missing or incorrect data');
                next();
            }
            else
            {
                res.status(401).send('Access denied'); 
                next();
            }
        }
        catch(err)
        {
            res.status(500).send('Internal error');
            next();
        }
    }
    return descriptor;
}

export default {
    HttpGet:HttpGet,
    HttpPost:HttpPost,
    HttpPatch:HttpPatch,
    HttpDelete:HttpDelete
}