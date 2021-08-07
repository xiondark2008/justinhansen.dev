import UpdateError from "@/starmap_db/types/entities/UpdateError"
import DBCollection from "@/modules/starmap_db/types/services/DBCollection"
import DBManager from "@/starmap_db/services/DBManager"

export default class UpdateErrorsCollection extends DBCollection {
    static COLLECTION_NAME = 'Update Errors'
    static #_RECORD_TYPE = UpdateError

    static async findAll(query, opts, db){ 
        return super.findAll(this.#_RECORD_TYPE, query, opts, db)
    }
    static async findOne(query, opts, db){
        return super.findOne(this.#_RECORD_TYPE, query, opts, db)
    }

    static async deleteMany( query, opts={}, db=DBManager.getDB() ){ //console.debug("in "+this.name+".deleteMany", query, update, opts)
        db = await db
        const collection = db.collection( this.COLLECTION_NAME )

        return collection.deleteMany( query, opts )
    }
}