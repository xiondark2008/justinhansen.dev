import Tunnel from "@/starmap_db/types/entities/Tunnel"
import DBCollection from "@/modules/starmap_db/types/services/DBCollection"

export default class TunnelCollection extends DBCollection {
    static COLLECTION_NAME = 'Tunnel'
    static #_RECORD_TYPE = Tunnel

    static async findAll(query, opts, db){ 
        return super.findAll(this.#_RECORD_TYPE, query, opts, db)
    }
    static async findOne(query, opts, db){
        return super.findOne(this.#_RECORD_TYPE, query, opts, db)
    }
}