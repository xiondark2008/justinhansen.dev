export function toHTMLName(val='') {
    return (val+'').toLowerCase().replace(/\s/g, '_')
}

export function hasElapsedSince(interval, start, end=new Date(), isInclusive=true ){
    const diff = end - start
    return isInclusive ? diff>=interval : diff>interval
}

export function originalOrParseInt(val){
    return !isNaN(val) && val !== null ? parseInt(val) : val 
}

export function originalOrParseFloat(val){
    return !isNaN(val) && val !== null ? parseFloat(val) : val
}

export function toUTF16Codes(val){
    return Array.prototype.map.call( val, (c) => {
        return c.charCodeAt().toString(16)
    } )
}

export function toUnicodeCodes(val){
    return Array.prototype.map.call( val, (c) => {
        return c.charCodeAt().toString()
    } )
}

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
export function prependToStringList(newValStrList, strList='', deliminator=','){
    const valList = Array.from( new Set( (newValStrList).trim().split(deliminator) ) ),
        nameList = strList.split(deliminator)
    for(let i=valList.length-1; i>-1; i--){
        if( !nameList.includes(valList[i]) ){
            strList = valList[i] + deliminator + strList
        }
    }
    return strList
}
export function addClassNames(toAddStr, classNames=''){
    return prependToStringList(toAddStr, classNames, ' ')
}
export function mergeObjects(victim={}, survivor, overwrite=false){
    if( !(survivor instanceof Object) ){
        survivor = {}
    } else {
        survivor = Object.assign({}, survivor)
    }

    if( overwrite ){
        return Object.assign(survivor, victim)
    } else {
        return Object.assign(victim, survivor)
    }
    
}
export function addStyle(toAddObj, styleObj){
    return mergeObjects(toAddObj, styleObj, true)
}

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

export function isEmpty(val){
    if( typeof val === 'string' || val instanceof Array ){
        return val.length < 1
    } else if( val instanceof Object ){
        return Object.entries(val).length < 1
    }

    return false
}

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
export function getRandomString(length){
    let str = ''
    
    for(let c=0; c<length; c++){
        const rand = Math.floor( 52 * Math.random() )
        str += String.fromCharCode( 65 + (rand < 26 ? rand : rand + 6) )
    }

    return str
}