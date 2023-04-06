import mongoose from "mongoose";
import {uri} from '../config/database.js';

export function databaseOperation(schema,name)
{
    return function(target,key,descriptor)
    {
        const original = descriptor.value;
       
        descriptor.value = async function(...args)
        {
            try
            {
                await mongoose.connect(uri);
                this.model = await mongoose.model(name,schema);
                const result = await original.apply(this,args);
                await mongoose.disconnect();
                await mongoose.connection.close();
                return result;
            }
            catch(err)
            {
                throw err;
            }
        }

        return descriptor;
    }
}

export interface ModelInterface
{
    model: any;

    find(query):Promise<object[]|null>
    findById(id:string):Promise<object|null>
    add(value):Promise<boolean>
    update(id:string, value):Promise<boolean>
    delete(id:string):Promise<boolean>

}