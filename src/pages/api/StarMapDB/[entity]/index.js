import { DB_COLLECTIONS } from "@/modules/starmap_db/utils/ServicesUtilities"

export default async function handler(req, res) { //console.debug("in /api/StarMapDB/[entity]/index.js - query: ", req.query)
    try{
        const Collection = DB_COLLECTIONS[ req.query.entity ]
        const filter = JSON.parse( req.query.filter || '{}' )
        
        res.status(200).json( {
            data: await Collection.findAll( filter )
        } )
    } catch(e){
        console.error("ERROR - in /api/StarMapDB/[entity]/index.js",e)
        res.status(500)
    }
}