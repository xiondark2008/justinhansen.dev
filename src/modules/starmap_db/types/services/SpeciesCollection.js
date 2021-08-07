import Species from "@/starmap_db/types/entities/Species"
import DBCollection from "@/modules/starmap_db/types/services/DBCollection"

export default class SpeciesCollection extends DBCollection {
    static COLLECTION_NAME = 'Species'
    static #_RECORD_TYPE = Species

    static async findAll(query, opts, db){ 
        return super.findAll(this.#_RECORD_TYPE, query, opts, db)
    }
    static async findOne(query, opts, db){
        return super.findOne(this.#_RECORD_TYPE, query, opts, db)
    }
}