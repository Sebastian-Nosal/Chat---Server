import mongoose, {Model} from "mongoose";
import { databaseOperation, ModelInterface } from "./model.js";

const groupSchema = new mongoose.Schema({
    members:Array,
    public:Boolean
});

export type groupType = {
    members:string[],
    public:Boolean
}


class GroupModel implements ModelInterface
{
    model:Model<any>

    @databaseOperation(groupSchema,'group')
    async find(query: any): Promise<groupType[]|null> {
        const result:groupType[] = await this.model.find(query).lean();
        if(result.length>0) return result;
        else return null
    }
    
    @databaseOperation(groupSchema,'group')
    async findById(id: string): Promise<groupType> {
        const result:groupType[] = [await this.model.findById(id).lean()];
        if(result) return result[0];
        else return null
    }

    @databaseOperation(groupSchema,'group')
    async add(value: any): Promise<boolean> {
        const newGroup = new this.model(value);
        await newGroup.save();
        return true
    }

    @databaseOperation(groupSchema,'group')
    async update(id: string, value: any): Promise<boolean> {
        const origal = this.model.findByIdAndUpdate(id,value)
        if(origal) return true;
        else return false;
    }

    @databaseOperation(groupSchema,'group')
    async delete(id: string): Promise<boolean> {
        await this.model.findByIdAndDelete(id);
        return true;
    }

}

export default new GroupModel();