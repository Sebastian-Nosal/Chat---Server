import mongoose, { Model } from "mongoose";
import { databaseOperation, ModelInterface } from "./model.js";

const messageSchema = new mongoose.Schema({
    content:String,
    target:String,
    received:Array,
    //group:Boolean,
    author:String,
    attachmets: {type: String, default: ''},
    date: {type:Date,default:Date.now}
})

type messageType = {
    author:string,
    content:string,
    targets:string,
    received:string[],
    attachmets:string,
    date:Date
}

class MessageModel implements ModelInterface
{
    model:Model<any>

    @databaseOperation(messageSchema,'message')
    async find(query: any): Promise<messageType[]|null> {
        const result:messageType[] = await this.model.find(query).lean();
        if(result.length>0) return result
        else return null
    }

    @databaseOperation(messageSchema,'message')
    async findById(id: string): Promise<messageType> {
        const result = await this.model.findById(id).lean();
        if(result) return result
        else return null
    }

    @databaseOperation(messageSchema,'message')
    async add(value: any): Promise<boolean> {
        const newMessage = new this.model(value);
        await newMessage.save();
        return true;
    }

    @databaseOperation(messageSchema,'message')
    async update(id: string, value: any): Promise<boolean> {
        const original = await this.model.findByIdAndUpdate(id,value);
        if(original) return true;
        else return false;
    }

    @databaseOperation(messageSchema,'message')
    async delete(id: string): Promise<boolean> {
        await this.model.findByIdAndDelete(id)
        return true;
    }
}

export default new MessageModel();