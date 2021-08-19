//console.debug("DEBUG - in Utilities before toHTMLName")
export function toHTMLName(val='') {
    return (val+'').toLowerCase().replace(/\s/g, '_')
}
//console.debug("DEBUG - in Utilities before hasElapsedSince")
export function hasElapsedSince(interval, start, end=new Date(), isInclusive=true ){
    const diff = end - start
    return isInclusive ? diff>=interval : diff>interval
}
//console.debug("DEBUG - in Utilities before originalOrParseInt")
export function originalOrParseInt(val){
    return !isNaN(val) && val !== null ? parseInt(val) : val 
}
//console.debug("DEBUG - in Utilities before originalOrParseFloat")
export function originalOrParseFloat(val){
    return !isNaN(val) && val !== null ? parseFloat(val) : val
}
//console.debug("DEBUG - in Utilities before toUTF16Codes")
export function toUTF16Codes(val){
    return Array.prototype.map.call( val, (c) => {
        return c.charCodeAt().toString(16)
    } )
}
//console.debug("DEBUG - in Utilities before toUnicodeCodes")
export function toUnicodeCodes(val){
    return Array.prototype.map.call( val, (c) => {
        return c.charCodeAt().toString()
    } )
}
//console.debug("DEBUG - in Utilities before propertyToLabel")
export function propertyToLabel(prop){
    let label = '',
        isFirstLetter = true
    
    for( let char of prop.split('') ){
        if( char === '_' ){
            label += ' '
            isFirstLetter = true
        } else if( isFirstLetter ){
            label += char.toUpperCase()
            isFirstLetter = false
        } else if( char.search(/[A-Z]/) > -1 ){
            label += ' '+char.toUpperCase()
        } else {
            if( char.search(/\W/) > -1 ){
                isFirstLetter = true
            }
            label += char
        }
    }

    return label
}
//console.debug("DEBUG - in Utilities before concatStringList")
export function concatStringList(additionStrList, currentStrList='', deliminator=',', prepend=false){
    const additionList = Array.from( new Set( (additionStrList).trim().split(deliminator) ) ),
        currentList = currentStrList.split(deliminator),
        start = prepend ? additionList.length-1 : 0,
        continueCheck = prepend ? (i) => i>-1 : (i) => i<additionList.length,
        step = prepend ? (i) => i-1 : (i) => i+1
    

    for( let i=start; continueCheck(i); i=step(i) ){
        if( !currentList.includes(additionList[i]) ){
            currentStrList = additionList[i] + deliminator + currentStrList
        }
    }
    return currentStrList
}
//console.debug("DEBUG - in Utilities before addClassNames")
export function addClassNames(toAddStr, classNames='', prepend=true){
    if( toAddStr instanceof Array ){
        toAddStr = toAddStr.join(' ')
    }
    
    return concatStringList(toAddStr, classNames, ' ', prepend)
}
//console.debug("DEBUG - in Utilities before mergeObjects")
export function mergeObjects(a={}, b, overwrite=false){
    if( b instanceof Object ){
        b = Object.assign({}, b)
    } else {
        b = {}
    }

    if( overwrite ){
        return Object.assign(b, a)
    } else {
        return Object.assign(a, b)
    }
    
}
//console.debug("DEBUG - in Utilities before addStyle")
export function addStyle(toAddObj, styleObj){
    return mergeObjects(toAddObj, styleObj, true)
}
//console.debug("DEBUG - in Utilities before cleanAttributesObject")
export function cleanAttributesObject(attr, warn=(val)=>{
    console.warn("WARN - Attributes need to be an Object. Ignoring value and using "
                +"an empty object instead. Found type: "+(typeof val), val )
}){ //console.debug("DEBUG - in Utilities > cleanAttributesObject. attr: ",attr)
    if( !(attr instanceof Object) ){
        if( attr ){
            warn( attr )
        }
        return {}
    }

    return Object.assign({}, attr)
}
//console.debug("DEBUG - in Utilities before cleanAttributesObjectArray")
export function cleanAttributesObjectArray(attrs, warn=(val)=>{
    console.warn("WARN - Attributes need to be an Object or Array of Objects. Ignoring value and using "
                +"an array with empty object instead. Found type: "+(typeof val), val )
}){
    if( !(attrs instanceof Array) && attrs instanceof Object ){
        return [Object.assign(attrs)]
    } else if( !attrs
            || !(attrs instanceof Array)
            || !attrs.every( it => it instanceof Object ) ){
        if( attrs ){
            warn( attrs )
        }
        return [{}]
    }

    return Object.assign([], attrs)
}
//console.debug("DEBUG - in Utilities before ListEditor")
export const ListEditor = (()=>{
    const PRIVATE = Symbol("Private")
    
    class ListEditor {
        static ACTION_TYPE = {
            INSERT: (val) => { return ++val },
            REMOVE: (val) => { return --val }
        }
    
        constructor(list){
            this[PRIVATE] = {
                list: list
            }
            this.actions = []
        }
    
        get list(){
            let list = this[PRIVATE].list,
                shiftList = []
            for(let i=0; i<=list.length; i++){  //NOTE: the '<=' this allows items to be added to the end of the list
                shiftList.push(0)
            }
    
            for(let action of this.actions){
                const index = action.index + shiftList[action.index]
    
                if(action.type === ListEditor.ACTION_TYPE.INSERT){
                    list.splice(index, 0, action.item)
                } else if(action.type === ListEditor.ACTION_TYPE.REMOVE){
                    list.splice(index, 1)
                } else {
                    throw new Error("Unhandled action type found: ", action.type)
                }
                
                for(let idx=action.index; idx<shiftList.length; idx++){
                    shiftList[idx] = action.type( shiftList[idx] )
                }
            }
    
            return list
        }
    
        insertAt(index, item){
            this.actions.push(
                ListEditor[PRIVATE].createActionLog(ListEditor.ACTION_TYPE.INSERT, index, item)
            )
        }
    
        removeAt(index){
            this.actions.push(
                ListEditor[PRIVATE].createActionLog(ListEditor.ACTION_TYPE.REMOVE, index, null)
            )
        }
    }
    ListEditor[PRIVATE] = {
        createActionLog: (type, index, item) => {
            return {
                type: type,
                index: index,
                item: item
            }
        }
    }
    
    return ListEditor
})()
//console.debug("DEBUG - in Utilities before isEmpty")
export function isEmpty(val){
    if( typeof val === 'string' || val instanceof Array ){
        return val.length < 1
    } else if( val instanceof Set || val instanceof Map ){
        return val.size < 1
    } else if( val instanceof Object ){
        return Object.entries(val).length < 1
    }

    return false
}
//console.debug("DEBUG - in Utilities before getUniqueId")
export function getUniqueId(instanceIdList, base=getRandomString(4), warning=(instanceIdList)=>{
    console.warn("WARN - was not able to generate unique id for instance id list: ",instanceIdList)
}){
    let count = -1

    do{
        const id = base + (count < 0 ? '' : '_'+count),
            isUniqueId = instanceIdList.every( it => it !== id )
        
        if( isUniqueId ){
            return id
        }
    }while(count++ <= instanceIdList.length)

    warning( instanceIdList )
}
//console.debug("DEBUG - in Utilities before getRandomString")
export function getRandomString(length){
    let str = ''
    
    for(let c=0; c<length; c++){
        const rand = Math.floor( 52 * Math.random() )
        str += String.fromCharCode( 65 + (rand < 26 ? rand : rand + 6) )
    }

    return str
}
//console.debug("DEBUG - in Utilities before tryFor")
export function tryFor(func, timeout=500, limit=100){
    const recursive = (attempts=0) => {
        try{
            return func()
        } catch( err ){
            if(attempts < limit){
                setTimeout( ()=>{ recursive(attempts+1) }, timeout)
            } else {
                throw err
            }
        }
    }

    return recursive()
}

export function cssTransformScaleToCenter(targetSize, spaceAvailable, originalSize){
    return (((spaceAvailable - targetSize) / (2 * (originalSize - targetSize))) * 100)+'%'
}

export function urlQueryFromString(str){
    const parts = str.split('?'),
        query = {}

    if( parts[1] ){
        const keyValPairs = parts[1].split('&')

        for(let i=0; i<keyValPairs.length; i++){
            const keyVal = keyValPairs[i].split('=')

            query[ keyVal[0] ] = keyVal[1] !== undefined ? keyVal[1] : null
        }
    }

    return query
}