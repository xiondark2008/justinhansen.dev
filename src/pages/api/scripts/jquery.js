import fs from 'fs'

const path = process.cwd() + "\\node_modules\\jquery\\dist\\jquery.js",
    js = fs.readFileSync( path )

export default async function handler(req, res) { console.debug("in /api/scripts/jquery.js - query: ", req.query)
    try{
        res.status(200)
            .setHeader('Content-Type', 'application/javascript')
            .send(js)
    } catch(e){
        console.error("ERROR - in /api/scripts/jquery.js",e)
        res.status(500)
    }
}