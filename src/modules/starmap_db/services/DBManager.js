import { connectToDatabase } from "@/utils/mongodb.js";

export default class DBManager {
    static async connect(){ //console.debug("in DBManager.connect")
        try{
            return await connectToDatabase()
        } catch(e) {
            console.error("ERROR - in DBManager.connect",e,"\n")
        }
    }

    static async getDB(){ //console.debug("in DBManager.getDB")
        try{
            const { db } = await this.connect()
            return db
        } catch(e) {
            console.error("ERROR - in DBManager.getDB",e,"\n")
        }
    }
}