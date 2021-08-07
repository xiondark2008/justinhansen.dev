import fs from 'fs'

const path = process.cwd() + "\\node_modules\\bootstrap\\dist\\js\\bootstrap.bundle.js",
    js = fs.readFileSync( path )

//TODO: use this to build custom 
export default async function handler(req, res) { console.debug("in /api/css/bootstrap.js - query: ", req.query)
    try{
        res.status(200)
            .setHeader('Content-Type', 'text/css')
            .send(js)
    } catch(e){
        console.error("ERROR - in /api/css/bootstrap.js",e)
        res.status(500)
    }
}