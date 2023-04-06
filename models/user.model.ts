import mongoose, { Model, Mongoose, ObjectId, Schema } from 'mongoose'
import {databaseOperation, ModelInterface} from './model.js'

const userSchema = new mongoose.Schema({
    username: {type:String,unique:true},
    password: String,
    verified: Boolean,
    joined: {type:Date,default: Date.now},
})

export type UserType = {
    id: ObjectId,
    username:String,
    password:String,
    verified:Boolean,
    joined: Date,
}

class UserModel implements ModelInterface
{
    model:Model<Schema>

    @databaseOperation(userSchema,'user')
    async find(query: object): Promise<UserType[]|null> 
    {
        const result:UserType[] = await this.model.find(query).lean();
        if(result.length>0) return result;
        else return null;
    }

    @databaseOperation(userSchema,'user')
    async findByUsername(username:string): Promise<UserType|null>
    {
        const result:UserType = await this.model.find({username:username}).lean();
        if(result) return result;
        else return null;
    }

    @databaseOperation(userSchema,'user')
    async findById(id): Promise<UserType>
    {
        const result:UserType = await this.model.findById(id).lean();
        if(result) return result;
        else return null;
    }

    @databaseOperation(userSchema,'user')
    async add(value: any): Promise<boolean> {
        const newUser = new this.model(value);
        await newUser.save();
        return true;
    }

    @databaseOperation(userSchema,'user')
    async update(id: any, value: any): Promise<boolean> {
        const origin = await this.model.findByIdAndUpdate(id,value);
        if(origin) return true;
        else return false;
    }

    @databaseOperation(userSchema,'user')
    async delete(id: any): Promise<boolean> {
        await this.model.findByIdAndDelete(id);
        return true;
    }
}

export default new UserModel();