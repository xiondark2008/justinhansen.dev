import CelestialObject from "@/starmap_db/types/entities/CelestialObject"
import DBCollection from "@/modules/starmap_db/types/services/DBCollection"

export default class CelestialObjectCollection extends DBCollection {
    static COLLECTION_NAME = 'Celestial_Object'
    static #_RECORD_TYPE = CelestialObject

    static async findAll(query, opts, db){ 
        return super.findAll(this.#_RECORD_TYPE, query, opts, db)
    }
    static async findOne(query, opts, db){
        return super.findOne(this.#_RECORD_TYPE, query, opts, db)
    }
}