var factorials = [];

function factorial(n) { //console.log("in factorial",arguments);
    if (n == 0 || n == 1) return 1;
    if (factorials[n] > 0) return factorials[n];
    return factorials[n] = factorial(n - 1) * n;
}

function combinations(n, r) { //console.log("in combinations",arguments);
    return factorial(n + r - 1) / (factorial(r) * factorial(n - 1));
}

function toBinary(num, template) { //console.log("in toBinary",arguments);
    var val = num.toString(2),
        lng = template.length;
    return ("" + template + val).substr(-1 * lng, lng);
}

function Die(faces, mod, values) { //console.log("in Die",arguments);
    this.faces = (faces !== undefined ? faces : 1);
    this.modifier = (mod !== undefined ? mod : 0);
    this.values = (values !== undefined ? values : []);

    if (this.values.length > this.faces) {
        var cut = this.values.splice(this.faces - this.values.length,
        this.values.length - this.faces);
        console.warn("More values than # of faces given. Removed values: ", cut);
    } else if (this.values.length < this.faces) {
        for (var i = this.values.length; i < this.faces; i++) {
            this.values.push(i + 1);
        }
    }
    this.values.sort(function (a, b) {
        return a - b;
    });

    this.getMax = function () { //console.log("in Die.getMax",arguments);
        return this.values[this.values.length - 1] + this.modifier;
    }
    this.getMin = function () { //console.log("in Die.getMin",arguments);
        return this.values[0] + this.modifier;
    }
    this.getValue = function (face) {
        console.log("in Die.getValue", arguments);
        return this.values[face] + this.modifier;
    }
    this.toString = function () { //console.log("in Die.toString",arguments);
        return "d" + this.faces + (this.modifier !== 0 ? " + " + this.modifier : "");
    }
}

function Roll(dice, mod) { //console.log("in Roll",arguments);
    this.dice = (dice !== undefined ? dice : []);
    this.modifier = (mod != undefined ? mod : 0);
    this.points = [];
    this.distroCurve = [];
    this.chances = [];

    this.refresh = function (dice, mod) { //console.log("in Roll.refresh",arguments);
        this.dice = (dice !== undefined ? dice : []);
        this.modifier = (mod != undefined ? mod : 0);
        this.points = [];
        this.distroCurve = [];
        this.chances = [];
    }
    this.getTemplate = function () { //console.log("in Roll.getTemplate",arguments);
        var rtn = "";
        for (var i = 0; i < this.dice.length; i++) {
            rtn += "0";
        }
        return rtn;
    }
    this.getPoints = function () { //console.log("in Roll.getPoints",arguments);
        if (this.points === undefined || this.points.length < 1) {
            this.points = [];
            var values = this.dice.map(function (die) {
                return die.faces;
            }),
                tmpl = this.getTemplate(),
                key = tmpl,
                count = 0;
            //console.log("\tvalues: ",values,"\n\ttmpl: ",tmpl)
            do {
                count++;
                key = toBinary(count, tmpl);

                this.points.push(values.reduce(function (p, c, i) {
                    return (parseInt(key[i]) ? (p>=0?-1:1)*(Math.abs(p)+c) : p);
                }, 0));
            }while( !toBinary(count, tmpl).split('').every(function (el) {
                return parseInt(el);
            }) );
            this.points.sort(function (a, b) {
                return Math.abs(a) - Math.abs(b);
            });
        }
        return this.points;
    }
    this.getDistroCurve = function () { //console.log("in Roll.getdistroCurve",arguments);
        if (this.distroCurve === undefined || this.distroCurve.length < 1) {
            this.distroCurve = [];

            var pts = this.getPoints(),
                N = this.dice.length,
                min = this.dice.reduce(function (p, c) {
                    return p + c.getMin();
                }, this.modifier),
                max = this.dice.reduce(function (p, c) {
                    return p + c.getMax();
                }, this.modifier);
            //console.log("\tpts: ",pts,"\n\tN: ",N,"\n\tmin: ",min,"\n\tmax: ",max)
            for (var r = 0; r <= (max - min); r++) {
                var val = combinations(N, r);

                pts.forEach(function (pt) {
                    var diff = r - Math.abs(pt)
                    if (diff >= 0) {
                        val += (pt / Math.abs(pt)) * combinations(N, diff);
                    }
                }, this);
                //console.log("+"+r+":"+val);
                this.distroCurve[r] = Math.round(val);
            }
        }
        return this.distroCurve;
    }

    this.getChances = function () { //console.log("in Roll.getChances",arguments);
        if (this.chances === undefined || this.chances.length < 1) {
            this.chances = [];
            var curve = this.getDistroCurve(),
                sum = curve.reduce(function (p, c) {
                    return p + c;
                }, 0),
                min = this.dice.reduce(function (p, c) {
                    return p + c.getMin();
                }, 0);

            curve.forEach(function (el, i) {
                this.chances.push({
                    roll: i + min,
                    chance: (el / sum) * 100
                });
            }, this);
        }
        //console.log("Roll.chances: ",this.chances);
        return this.chances;
    }

    this.chanceOf = function (val, equal, lesser, greater) { //console.log("in Roll.chanceOf",arguments);
        equal = (equal !== undefined ? equal : true);
        lesser = (lesser !== undefined ? lesser : false);
        greater = (greater !== undefined ? greater : false);
        var chance = 0;
        this.getChances().forEach(function (el) {
            if ((equal && el.roll === val) || (lesser && el.roll < val) || (greater && el.roll > val)) {
                chance += el.chance;
            }
        }, this);
        //console.log("Roll chance: ",chance);
        return chance;
    }

}


function VMDieType(faces) {
    var self = this;
    self.faces = faces;
    self.quantity = ko.observable(0);

    self.plus = function () {
        //console.log("in VMDieType.plus",arguments);
        var was = self.quantity();
        self.quantity(was + 1);
    }
    self.minus = function () {
        //console.log("in VMDieType.minus",arguments);
        var was = self.quantity();
        self.quantity(Math.max(0, was - 1));
    }
}

function KOVM() {
    var self = this;
    self.dieTypes = ko.observableArray([
        new VMDieType(2),
        new VMDieType(4),
        new VMDieType(6),
        new VMDieType(8),
        new VMDieType(10),
        new VMDieType(12) ]);

    self.roll = ko.observable();
    self.chanceOf = ko.observable(0);
    self.equalTo = ko.observable(true);
    self.lessThan = ko.observable(false);
    self.greaterThan = ko.observable(false);
    self.chance = ko.computed(function () {
        //console.log("roll: ",this.roll() );
        var roll = this.roll(),
            val = this.chanceOf(),
            eq = this.equalTo(),
            lt = this.lessThan(),
            gt = this.greaterThan();
        draw( (roll === undefined) );
        if (roll === undefined) {
            return 0;
        }
        return roll.chanceOf(parseInt(val), eq, lt, gt).toPrecision(4);
    }, self);

    self.dieTypes().forEach(function (dieType) {
        dieType.quantity.subscribe(function () {
            var dice = [];
            self.dieTypes().forEach(function (el) {
                for (var i = 0; i < el.quantity(); i++) {
                    dice.push(new Die(el.faces));
                }
            }, self);

            self.roll((dice.length > 0 ? new Roll(dice) : undefined));
            //console.log("roll: ",self.roll() );
            var was = self.chanceOf();
            self.chanceOf(Math.max(dice.length, was));
        });
    }, self);

    self.removeDieType = function (dieType) {
        self.dieTypes.remove(dieType);
    }
    self.plus = function () {
        //console.log("in VMDieType.plus",arguments);
        var was = self.chanceOf();
        self.chanceOf(was + 1);
    }
    self.minus = function () {
        //console.log("in VMDieType.minus",arguments);
        var was = self.chanceOf();
        self.chanceOf(Math.max(0, was - 1));
    }
    
    //console.log("test",window);
    self.graphWidth = ko.observable( document.body.clientWidth );
    self.graphHeight = ko.computed(function(){
        return self.graphWidth() * (9/16);
    });
    self.testHeight = ko.observable( window.innerHeight );

}
var myView = new KOVM();
ko.applyBindings( myView );

window.onresize = function(evt){
    myView.graphWidth( evt.target.document.body.clientWidth );
    myView.testHeight( evt.target.innerHeight )
    draw();
}

function draw(justClear){
    //console.log("in draw",arguments);
    
    var canvas = document.getElementById("myCanvas"),
        ctx = canvas.getContext("2d");
    var width = canvas.width,
        height = canvas.height;
    var roll = (myView ? myView.roll() : undefined);
    
    //console.log("c",width)
    ctx.clearRect(0,0,width,height);
    if(justClear || roll===undefined){ return; }
    
    var val = myView.chanceOf(),
        chances = roll.getChances(),
        eq = myView.equalTo(),
        lt = myView.lessThan(),
        gt = myView.greaterThan();
    
    var bWidth = (width -chances.length)/chances.length;
    var bHeight = chances.reduce(function(p,c){
        return (c.chance>p ? c.chance : p);
    },0)
    
    chances.forEach(function(el,i){
        ctx.fillStyle="#357EBD";
        if ((eq && el.roll===val) || (lt && el.roll<val) || (gt && el.roll>val)) {
            ctx.fillStyle="#ED9C28";
        }
        var h = height * (el.chance/bHeight);
        ctx.fillRect((bWidth*i)+i,height,bWidth,-1*h);
    },this);
    
}