import DBUpdater from "@/starmap_db/services/DBUpdater"

export default async function handler(req, res) { console.debug("in /api/StarMapDB/update/index.js - query: ", req.query)
    try{
        res.status(200).json({ updateStarted: DBUpdater.update() })
    } catch(e){
        console.error("ERROR - in /api/StarMapDB/update/index.js",e)
        res.status(500)
    }
}