import { ParsedQs } from "qs";
import { HttpDelete, HttpGet, HttpPatch, HttpPost, ResourceController } from "./controllers.js";
import userModel, { UserType } from "../models/user.model.js";
import authController from "./auth.controller.js";

/*
    User:
    id: ObjectId,
    username:String,
    password:String,
    verified:Boolean,
    joined: Date,

*/ 

class UserController implements ResourceController
{
    @HttpGet
    async get(user: string, id:string, query: ParsedQs): Promise<UserType[]|null|undefined> 
    {
        let searchQuery = {};
        const isId = Boolean(id);
        const isQuery = Boolean(query.username||query.id);

        if(isId&&isQuery===false)
        {
            const result = [];
            result.push(await userModel.findById(id));
            delete result[0].password;
            return result;    
        }
        else if(isId&&isQuery)
        {
            Object.assign(searchQuery,{_id:id});
            if(query.username)
            {
                Object.assign(searchQuery,{username: query.username})
            }
            let result = await userModel.find(searchQuery);

            if(result!==null)
            {
                result = result.map(el=>{
                    delete el.password;
                    return el;
                })
            }
            return result;
        }
        else if(isId===false&&isQuery)
        {
            if(query.username)
            {
                Object.assign(searchQuery, {username:query.username});
            }
            if(query.id)
            {
                Object.assign(searchQuery,{_id:query.id});
            }
            let result = await userModel.find(searchQuery);
            if(result!==null)
            {
                result = result.map(el=>{
                    delete el.password;
                    return el;
                })
            }
            return result;
        }
        else
        {
            return null;
        }
    }

    @HttpPost
    async post(user: string, body: any): Promise<boolean> {
        if(user!=='')
        {
            return undefined;
        }
        const {username,password} = body;
        if(password&&username)
        {
            const isUsernameCorrect = authController.checkUsername(username);
            const isPasswordCorrect = authController.checkPassword(password);
            if(isPasswordCorrect&&isUsernameCorrect)
            {
                const hash = authController.hash(password)
                try
                {
                    const result = await userModel.add({
                        username:username,
                        password:hash,
                        verified:false,
                    });
                    return result;
                }
                catch(err)
                {
                    console.log('err');
                    console.log(err);
                    throw 'Internal Problem';
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    @HttpPatch
    async patch(user: string, id: string, body: any): Promise<boolean> {

        if(!id)
        {
            return false;
        }

        const edited:UserType = await userModel.findById(id);
        if(edited===undefined||edited.username!==user)
        {
            return undefined;
        }
        let query = {};
        const {username,password,verified} = body;
        if(username)
        {
            const isUsernameCorrect = authController.checkUsername(username);
            if(isUsernameCorrect)
            {
                Object.assign(query,{username:username});
            }
            else
            {
                return false;
            }
        }

        if(password)
        {
            const isPasswordCorrect = authController.checkPassword(password);
            if(isPasswordCorrect)
            {
                const hash = authController.hash(password);
                Object.assign(query,{password:hash});
            }
            else
            {
                return false;
            }
        }

        if(verified==='true'||verified==='false')
        {
            if(verified==='true') Object.assign(query,{verified:true});
            else  Object.assign(query,{verified:false});
        }

        try
        {
            console.log(query)
            const result = await userModel.update(id,query);
            console.log(result);
            if(result) return result
            else return false;
        }
        catch(e)
        {
            throw "Internal Problem";
        }
    }

    @HttpDelete
    async delete(user: string, id: string): Promise<boolean> 
    {
        try
        {
            const userToDelete = await userModel.findById(id);
            if(user!==userToDelete.username)
            {
                return undefined;
            }

                const result = await userModel.delete(id);
                return result;
        }
        catch(e)
        {
            console.log(e);
            throw 'Internal problem';
        }
    }
}

const userController = new UserController();
export default userController;