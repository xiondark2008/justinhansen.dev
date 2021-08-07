import StarSystem from "@/starmap_db/types/entities/StarSystem"
import DBCollection from "@/modules/starmap_db/types/services/DBCollection"

export default class StarSystemCollection extends DBCollection {
    static COLLECTION_NAME = 'Star_System'
    static #_RECORD_TYPE = StarSystem

    static async findAll(query, opts, db){ 
        return super.findAll(this.#_RECORD_TYPE, query, opts, db)
    }
    static async findOne(query, opts, db){
        return super.findOne(this.#_RECORD_TYPE, query, opts, db)
    }
}