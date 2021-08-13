//import fs from 'fs'

export default async function handler(req, res) { console.debug("in /api/playground.js - query: ", req.query)
    try{
        // const root = process.cwd() + "\\node_modules\\bootstrap\\scss",
        //     rootSassPath = "bootstrap/scss",
        //     printPath = (dir, sassPath) => {
        //         fs.readdir(dir, (err, files) => {
        //             if(err){
        //                 throw err
        //             }

        //             files.forEach( file => {
        //                 const isFolder = file.search(/\./) == -1

        //                 //console.debug(file, isFolder, file.search(/\./) )
        //                 if(isFolder){
        //                     printPath(dir+'\\'+file, sassPath+'/'+file)
        //                 } else {
        //                     const path = sassPath+'/'+file
        //                     console.log("@import \""+path.replace(/_|\.scss/g, '')+"\";")
        //                 }
        //             })
        //         })
        //     }
        
        // console.log(root)
        // printPath(root, rootSassPath)

        console.log("window: ", window)

        res.status(200).send("done")
    } catch(e){
        console.error("ERROR - in /api/playground.js",e)
        res.status(500).send("error")
    }
}