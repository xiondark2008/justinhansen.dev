import DBManager from "@/starmap_db/services/DBManager"

export default class DBCollection {
    static async findAll( recordType, query, opts, db ){ //console.debug("in "+this.name+".findAll", query, opts)
        const docs = await this.findAllRaw(query, opts, db)
            
        return docs.map( doc => { return new recordType(doc) } )
    }
    static async findAllRaw( query={}, opts={}, db=DBManager.getDB() ){ //console.debug("in "+this.name+".findAllRaw", query, opts)
        db = await db
        const collection = db.collection( this.COLLECTION_NAME )
        
        return await collection.find(query, opts).toArray()
    }

    static async findOne( recordType, query, opts, db ){ //console.debug("in "+this.name+".findOne", query, opts)
        const doc = await this.findOneRaw(query, opts, db)
        
        return new recordType(doc)
    }
    static async findOneRaw( query={}, opts={}, db=DBManager.getDB() ){ //console.debug("in "+this.name+".findOneRaw", query, opts)
        db = await db
        const collection = db.collection( this.COLLECTION_NAME )
        
        return await collection.findOne(query, opts)
    }

    static async updateOne( query={}, update={}, opts={}, db=DBManager.getDB() ){ //console.debug("in "+this.name+".updateOne", query, update, opts)
        db = await db
        const collection = db.collection( this.COLLECTION_NAME )

        if(!update.$set || Object.keys(update.$set).length == 0){
            console.warn("WARNING - in "+this.name+".updateOne. missing $set for ",query,update)
        }
        
        return collection.updateOne( query, update, opts )
    }

    static async countDocuments( query={}, opts={}, db=DBManager.getDB() ){ //console.debug("in "+this.name+".countDocuments", query, opts)
        db = await db
        const collection = db.collection( this.COLLECTION_NAME )
        
        return collection.countDocuments( query, opts )
    }
}