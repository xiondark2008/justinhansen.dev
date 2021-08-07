import Affiliation from "@/starmap_db/types/entities/Affiliation"
import DBCollection from "@/modules/starmap_db/types/services/DBCollection"

export default class AffiliationCollection extends DBCollection {
    static COLLECTION_NAME = 'Affiliation'
    static #_RECORD_TYPE = Affiliation

    static async findAll(query, opts, db){ 
        return super.findAll(this.#_RECORD_TYPE, query, opts, db)
    }
    static async findOne(query, opts, db){
        return super.findOne(this.#_RECORD_TYPE, query, opts, db)
    }
}