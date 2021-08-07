export default class Target {
    constructor(val, equal = true, lesser = false, greater = false) { //console.debug("in Target.constructor", arguments);
        this.value = Math.max(val, 0)
        this.equal = equal
        this.lesser = lesser
        this.greater = greater
    }

    isMatch(val) { //console.debug("in Target.isMatch()", arguments);
        const isEqual = (this.equal && val === this.value),
            isLessThan = (this.lesser && val < this.value),
            isGreaterThan = (this.greater && val > this.value)
        
        return (isEqual || isLessThan || isGreaterThan)
    }

    copy(val = this.value, equal = this.equal, lesser = this.lesser, greater = this.greater) { //console.debug("in Target.copy()", arguments);
        return new Target(val||0, equal, lesser, greater)
    }
}