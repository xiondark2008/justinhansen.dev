var Stages = {
    AsyncWaitLock: 0,
    limiter: 1000,
    stages: [],
    current: 0,
    add: function(stageRun) {
        this.stages.push({
            started: false,
            finished: false,
            run: function() {
                this.started = true;
                stageRun();
                this.finished = true;
            }
        });
    },
    getCurrent: function() {
        return this.stages[this.current];
    },
    hasNext: function() {
        return (this.current < this.stages.length - 1);
    },
    next: function() {
        this.current++;
        return this.getCurrent();
    },
    runCurrent: function() {
        this.getCurrent().run();
    },
    runAll: function() {
        var runLoop;
        runLoop = (function() {
            //console.debug("AsyncWaitLock: ", this.AsyncWaitLock, "\tlimiter: ", this.limiter);
            var stage = this.getCurrent()
            if (!stage.started) {
				this.runCurrent();
            } else if (!this.hasNext() || this.limiter <= 0) {
                console.debug("Reached last stage. limiter: ",this.limiter)
                return
            } else if (stage.finished && this.AsyncWaitLock === 0) {
				this.next();
            }
			
            this.limiter--;
            setTimeout(runLoop, 100);
        }).bind(this);

        runLoop();
    }
}
var DataSource = {
    BASE_URL: "https://cors-anywhere.herokuapp.com/https://robertsspaceindustries.com/api/starmap",
	MEDIA_URL: "",
    cache: new Map(),
    getBootup: function(callback) {
        var url = this.BASE_URL + "/bootup";

        var mainCallback = (function() {
            callback(this.cache.get(url));
        }).bind(this)

        if (!this.cache.has(url)) {
            var cacheCB = (function(rawData) {
                //console.log(rawData);
                this.cache.set(url, (rawData ? rawData.data : undefined));
                mainCallback();
            }).bind(this);
            this.getDataFromURL(url, "Bootup", cacheCB);
        } else {
            mainCallback();
        }
    },
    getStarSystemDetails: function(systemCode, callback) {
        var url = this.BASE_URL + "/star-systems/" + systemCode;

        var mainCallback = (function() {
            try{
				callback(this.cache.get(url));
			}
			catch(err){
				console.error("Encountered the following error for url:\n\t"+url, err)
			}
        }).bind(this)

        if (!this.cache.has(url)) {
            var cacheCB = (function(rawData) {
                //console.log(rawData);
                this.cache.set(url, (rawData ? rawData.data : undefined));
                mainCallback();
            }).bind(this);
            this.getDataFromURL(url, systemCode, cacheCB);
        } else {
            mainCallback();
        }
    },
    getCelestialObjectDetails: function(coCode, callback) {
        var url = this.BASE_URL + "/celestial-objects/" + coCode;

        var mainCallback = (function() {
            try{
				callback(this.cache.get(url));
			}
			catch(err){
				console.error("Encountered the following error for url:\n\t"+url, err)
			}
        }).bind(this)

        if (!this.cache.has(url)) {
			//console.log("no cache for: ",coCode)
            var cacheCB = (function(rawData) {
                //console.log(rawData);
                this.cache.set(url, (rawData ? rawData.data : undefined));
                mainCallback();
            }).bind(this);
            this.getDataFromURL(url, coCode, cacheCB);
        } else {
			console.log("found cache for: ",coCode)
			mainCallback();
        }
    },
    getDataFromURL: function(url, forLog, callback) {
        $.ajax(url, {
            method: "POST",
            dataType: "json",
            beforeSend: function(xhr) {
                Stages.AsyncWaitLock++;
            },
            success: function(data, textStatus, jqXHR) {
                console.info(textStatus + " - " + forLog);
                callback(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error(textStatus + " - " + forLog, errorThrown);
                callback(null);
            },
            complete: function(jqXHR, textStatus) {
                Stages.AsyncWaitLock--;
            }
        });
    }
}
var Parser = {
    parseAffiliation: function(data) {
        var records = [];
        for (var i = 0; i < data.affiliations.resultset.length; i++) {
            var result = data.affiliations.resultset[i];
            records.push({
                "aid": result["id"],
                "affiliation_name": result["name"],
                "affiliation_code": result["code"],
                "affiliation_color": result["color"]
            })
        }
        return records
    },
    parseTunnels: function(data) {
        var records = [];
        for (var i = 0; i < data.tunnels.resultset.length; i++) {
            var result = data.tunnels.resultset[i];
            //console.debug("tunnel result: ",result)
            var oneway = {
                "tid": result["id"],
                "name": result["name"],
                "size": result["size"],
				"entry_ssid": result.entry["star_system_id"],
				"exit_ssid": result.exit["star_system_id"],
				"entry_coid": result.entry["id"],
				"exit_coid": result.exit["id"]
            }
            records.push(oneway);

            if (result["direction"] == "B") {
				var otherway = {
					"tid": result["id"]+'R',
					"name": result["name"],
					"size": result["size"],
					"entry_ssid": result.exit["star_system_id"],
					"exit_ssid": result.entry["star_system_id"],
					"entry_coid": result.exit["id"],
					"exit_coid": result.entry["id"]
				}
                records.push(otherway);
            }
        }
        return records
    },
    parseStarSystemsFromBootup: function(data) {
        var records = [];
		var limiter = -1
        for (var i = 0; i < data.systems.resultset.length && (limiter==-1 || i<limiter); i++) {
            var result = data.systems.resultset[i];
            records.push({
                "ssid": result["id"],
                "name": result["name"],
                "code": result["code"],
                "type": (result["type"] ? result["type"].replace(/_/g,' ') : ''),
                "affiliation_id": result.affiliation[0]["id"],
                "aggregated_size": parseFloat(result["aggregated_size"]),
				"aggregated_population": parseFloat(result["aggregated_population"]),
                "aggregated_economy": parseFloat(result["aggregated_economy"]),
                "aggregated_danger": parseFloat(result["aggregated_danger"]),
                "description": result["description"],
				"habitable_zone_inner": null,
				"habitable_zone_outer": null,
                "frost_line": null,
                "position_x": parseFloat(result["position_x"]),
                "position_y": parseFloat(result["position_y"]),
                "position_z": parseFloat(result["position_z"]),
                "status": result["status"],
                "time_modified": new Date(result["time_modified"]),
                "thumbnail_info": result["thumbnail"],
                "info_url": result["info_url"]
            })
        }
        return records;
    },
    parseStarSystemDetails: function(data) {
		var result = data.resultset[0];
		if( !result ){
			throw new Error("Missing data from RESTful api call.")
		}
		
		return {
			"habitable_zone_inner": parseFloat( result["habitable_zone_inner"] ),
			"habitable_zone_outer": parseFloat( result["habitable_zone_outer"] ),
			"frost_line": parseFloat( result["frost_line"] )
		}
    },
    parseCelestialObjectsFromStarSystemDetials: function(data, ssid) {
        var records = [];
        for (var i = 0; i < data.resultset[0].celestial_objects.length; i++) {
            var result = data.resultset[0].celestial_objects[i];
            records.push( new this.CelestialObject(result, ssid) );
        }
        return records;
    },
    parseCelestialObjectDetials: function(data, ssid) {
        var result = data.resultset[0];
		if( !result ){
			throw new Error("Missing data from RESTful api call.")
		}
		return new this.CelestialObject(result, ssid)
    },
	CelestialObject: function(opts, ssid){
		this.ssid = ssid;
		this.coid = opts["id"];
		this.code = opts["code"];
		this.fairchanceact = opts["fairchanceact"];
		this.parent_id = opts["parent_id"];
		this.parent_name = null;
		this.type = (opts["type"] ? opts["type"].replace(/_/g,' ') : '');
		this.subtype = (opts["subtype"] ? opts["subtype"]["name"] : null);
		this.affiliation_id = (opts.affiliation[0] ? opts.affiliation[0]["id"] : null);
		this.affiliation_name = null;
		this.designation = opts["designation"];
		this.name = opts["name"];
		this.designation_name = ( opts["name"] ? opts["name"]+' ('+opts["designation"]+')' : opts["designation"] );
		this.habitable = !!opts["habitable"];
		this.sensor_population = parseInt(opts["sensor_population"]);
		this.sensor_economy = parseInt(opts["sensor_economy"]);
		this.sensor_danger = parseInt(opts["sensor_danger"]);
		this.description = opts["description"];
		this.size = parseFloat(opts["size"]);
		this.distance = parseFloat(opts["distance"]);
		this.latitude = parseFloat(opts["latitude"]);
		this.longitude = parseFloat(opts["longitude"]);
		this.axial_tilt = parseFloat(opts["axial_tilt"]);
		this.orbit_period = parseFloat(opts["orbit_period"]);
		this.age = (opts["age"] ? parseFloat(opts["age"]) : null);
		this.texture_data = opts["texture"];
		this.shader_data = opts["shader_data"];
		this.thumbnail_info = opts["thumbnail"];
		this.time_modified = new Date(opts["time_modified"]);
		this.info_url = opts["info_url"];
	}
}


function DTView(label, columns, context){
	this.label = label;
	this.logic = (function(cols){
		console.log('enter logic')
		var self = this
		try {
			if(!cols){
				self.dataTable.columns().visible(true, false)
			} else {
				self.dataTable.columns().visible(false, false)
				self.dataTable.columns( cols ).visible(true, false)
			}
		} catch(e) {
			console.error("Encountered unexpected error.", "\ncols: ", cols, e)
		}
		self.dataTable.responsive.rebuild()
			.responsive.recalc()
			.columns.adjust();
		
	}).bind(context, columns)
}
function VM(){
	this.db = null;
	this.dbStats = {};
	this.dataTable = null;
	this.buildDataTable = function(){};
}

var KOVM = {
	BASE_URL: "https://robertsspaceindustries.com/starmap",
	AffiliationVM: new VM(),
	TunnelVM: new VM(),
	StarSystemVM: new VM(),
	CelestialObjectVM: new VM(),
	selectedRecord: ko.observable(),
	selectedRecordType: "star_system",
	selectNextRecord: function(){
		var vm
		var idName
		var type = this.selectedRecordType
		console.log("type: ", type)
		switch(type){
			case "star_system":
				vm = this.StarSystemVM;
				idName = 'ssid'
				break;
			case "celestial_object":
				vm = this.CelestialObjectVM
				idName = 'coid'
				break;
			case "tunnel":
				vm = this.TunnelVM
				idName = 'tid'
				break;
			case "affiliation":
				vm = this.AffiliationVM
				idName = 'aid'
				break;
			default:
				console.warn("Could not find type: ",type)
				return
		}
		console.log("vm: ",vm)
		var pageInfo = vm.dataTable.page.info()
		var rows = vm.dataTable.rows().$('tr').get()
		var nextIdx = rows.findIndex(function(it,idx,ary){
			return $(it).hasClass('selected')
		}) + 1
		nextIdx = (nextIdx < rows.length ? nextIdx : 0)
		
		console.log("nextIdx: ",nextIdx,"\npageInfo: ",pageInfo)
		if(nextIdx < pageInfo.start) {
			console.log("in else")
			vm.dataTable.page(0).draw(false)
		} else if(pageInfo.end <= nextIdx){
			console.log("in if")
			vm.dataTable.page(pageInfo.page + 1).draw(false)
		}
		var $next = $( rows[nextIdx] )
		console.log("next: ", $next)
		$next.children().get(0).click()
	},
	selectPrevRecord: function(){
		var vm
		var idName
		var type = this.selectedRecordType
		console.log("type: ", type)
		switch(type){
			case "star_system":
				vm = this.StarSystemVM;
				idName = 'ssid'
				break;
			case "celestial_object":
				vm = this.CelestialObjectVM
				idName = 'coid'
				break;
			case "tunnel":
				vm = this.TunnelVM
				idName = 'tid'
				break;
			case "affiliation":
				vm = this.AffiliationVM
				idName = 'aid'
				break;
			default:
				console.warn("Could not find type: ",type)
				return
		}
		console.log("vm: ",vm)
		var pageInfo = vm.dataTable.page.info()
		var rows = vm.dataTable.rows().$('tr').get()
		var prevIdx = rows.findIndex(function(it,idx,ary){
			return $(it).hasClass('selected')
		}) - 1
		prevIdx = (prevIdx < 0 ? rows.length-1 : prevIdx)
		
		console.log("prevIdx: ",prevIdx,"\npageInfo: ",pageInfo)
		if(prevIdx > pageInfo.end) {
			console.log("in else")
			vm.dataTable.page(pageInfo.pages-1).draw(false)
		} else if(prevIdx < pageInfo.start){
			console.log("in if")
			vm.dataTable.page(pageInfo.page - 1).draw(false)
		}
		var $prev = $( rows[prevIdx] )
		console.log("prev: ", $prev)
		$prev.children().get(0).click()
	},
	afterTabpanelRender: function(contents, vm){
		//console.log("enter afterTabpanelRender.", "\ncontents: ", contents, "\nvm: ", vm)
		vm.buildDataTable( $(".mainDataTable", contents) )
	},
	afterDetailsRender: function(contents, data){
		$("table.dataTables-mini", contents).DataTable({ dom: "tp" })
	},
	formatNumber: function(nStr){
		if( isNaN(nStr) ){
			return '-.--'
		}
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		return x1 + x2;
	},
	showModal: function(){
		$("#detailsModal").modal("show")
	}
};
KOVM.selectedTemplate = (function(){
	//console.log("enter selectTemplate.")
	var type = this.selectedRecordType;
	//console.log("in selectTemplate.\n\ttype: ",type)
	switch( type ){
		case "star_system":
			return "star_system_details_template";
		case "celestial_object":
			return "celestial_object_details_template";
		case "affiliation":
			return "affiliation_details_template";
		case "tunnel":
			return "tunnel_details_template";
		default:
			console.warn("Could not find matching type for: ", type)
	}
}).bind(KOVM);
KOVM.setSelectedRecord = (function(type, id, keepSelected){
	//console.log("enter setSelectedRecord.")
	if(type){
		this.selectedRecordType = type
	}
	var table = null;
	var type = this.selectedRecordType;
	//console.log("in setSelectedRecord.\n\ttype: ", type, "\n\tid: ",id)
	switch(type){
		case "star_system":
			this.selectedRecord( this.StarSystemVM.db({ ssid: id }).first() );
			table = this.StarSystemVM.dataTable;
			break;
		case "celestial_object":
			this.selectedRecord( this.CelestialObjectVM.db({ coid: id }).first() );
			table = this.CelestialObjectVM.dataTable;
			break;
		case "affiliation":
			this.selectedRecord( this.AffiliationVM.db({ aid: id }).first() );
			table = this.AffiliationVM.dataTable;
			break;
		case "tunnel":
			this.selectedRecord( this.TunnelVM.db({ tid: id }).first() );
			table = this.TunnelVM.dataTable;
			break;
		default:
			console.warn("Could not find matching type for: ", type)
	}
	if(!keepSelected && table){
		table.row( {selected: true} ).deselect();
	}
	console.debug("Selected: ", this.selectedRecord())
}).bind(KOVM);
KOVM.setSelectedRecordEvt = (function(dtData, $evt){
	//console.log("enter setSelectedRecordEvt.")
	var $target = $( $evt.target )
	var $data = $target.data()
	if( $data.hasOwnProperty('ssid') ){
		this.setSelectedRecord("star_system", ''+$data.ssid)
	} else if( $data.hasOwnProperty('coid') ){
		this.setSelectedRecord("celestial_object", ''+$data.coid)
	} else if( $data.hasOwnProperty('aid') ){
		this.setSelectedRecord("affiliation", ''+$data.aid)
	} else if( $data.hasOwnProperty('tid') ){
		this.setSelectedRecord("tunnel", ''+$data.tid)
	} else {
		console.warn("Could not find matching type for: ", $data)
	}
}).bind(KOVM);
KOVM.getBackgroundImage = ko.computed(function(){
	var record = this.selectedRecord();
	if(!record){ return {}; }
	
	var style = {}
	var imageSizeSelector = function(data){
		if(!data){ return 'none'; }
		return 'url(' + (window.innerWidth<1200 || !data.images.post ? data.source : data.images.post) + ')';
	}
	
	var type = this.selectedRecordType;
	switch(type){
		case "star_system":
			if( !record.thumbnail_info ){ break; }
			style.backgroundImage = imageSizeSelector( record.thumbnail_info )
			break;
		case "celestial_object":
			try {
				if( record.thumbnail_info ){
					style.backgroundImage = imageSizeSelector( record.thumbnail_info );
				} else {
					switch(record.type){
						case "PLANET":
							style.backgroundImage = imageSizeSelector( record.texture_data );
							break;
						case "STAR":
							if(record.shader_data){
								var sun = record.shader_data.sun
								
								var texture = ( parseInt(sun.map) || 0 ) + 1
								var c1 = sun.color1;
								var c2 = sun.color2;
								var bgImage = "url('https://robertsspaceindustries.com/rsi/static/js/starmap/sourceimages/suns/0" + texture  + "_Texture.jpg')";
								/**/
								bgImage += ", radial-gradient(" + c1 + " 50%, " + c2 + " 90%, black)";
								bgImage += ", radial-gradient(#555555 40%, #aaaaaa 80%, black 95%)";
								/*/
								bgImage += ", radial-gradient(" + c1 + " 45%, " + c2 + " 80%, " + c1 + " 90%, black 95%)";
								bgImage += ", radial-gradient(#555555 55%, #aaaaaa %)";
								//*/
								
								style.backgroundColor = "initial"
								style.backgroundImage = bgImage
								style.backgroundBlendMode = "color-dodge, overlay"
							}
							break;
						default:
							console.warn("Could not find matching record type for: ", record.type)
							break;
					}
				}
				break;
			} catch(e){
				console.error(e,"Selected Record: ",this.selectedRecord())
			}
		default:
			console.warn("Could not find matching type for: ", type)
		case "affiliation":
		case "tunnel":
			break;
	}
	return style;
}, KOVM);


KOVM.StarSystemVM.dtViews = [
	new DTView("Default", null, KOVM.StarSystemVM),
	new DTView("Tunnels", [0,8,9,10,11], KOVM.StarSystemVM),
	new DTView("Affiliations", [0,2,3,5,6,7], KOVM.StarSystemVM),
	new DTView("Sensors", [0,4,5,6,7], KOVM.StarSystemVM),
	new DTView("Metrics", [0,1,4,12,13,14], KOVM.StarSystemVM),
	new DTView("Meta", [0,15], KOVM.StarSystemVM)
]
KOVM.StarSystemVM.buildDataTable = function($table){
	//console.log("StarSystemVM $table: ", $table)
	var self = this;
	self.dataTable = $table.DataTable({
		select: { style: 'single' },
		responsive: { details: false },
		dom: "ftip",
		data: self.db().get(),
		columns: [
			{ title: "name",
			  data: "name",
			  responsivePriority: 1,
			  createdCell: function(td, cellData, rowData, row, col){
				  $(td).css("min-width", "4.65em")
			  } },
			{ title: "type", 
			  data: "type",
			  responsivePriority: 4,
			  createdCell: function(td, cellData, rowData, row, col){
				  $(td).css("min-width", "6.58em")
			  } },
			{ title: "affiliation", 
			  data: "affiliation_name",
			  responsivePriority: 2,
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  return '<span class="affiliation" affiliation="'+value+'">'+value+'</span>'; }
				  return value
			  } },
			{ title: "celestial objects",
			  className: "text-right",
			  data: "celestial_object_count",
			  responsivePriority: 7,
			  orderSequence: [ "desc", "asc" ],
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#d9d2e9", "#8e7cc3"]
				  var vals = KOVM.StarSystemVM.db().order("celestial_object_count asec").select("celestial_object_count")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
			  } },
			{ title: "size",
			  className: "text-right",
			  data: "aggregated_size", 
			  responsivePriority: 5,
			  orderSequence: [ "desc", "asc" ],
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  if(value == null){ value=0 }
					return KOVM.formatNumber(value.toFixed(2)) + "au"
				  }
				  return value
			  },
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#9fc5e8", "#4a86e8"]
				  var vals = KOVM.StarSystemVM.db().order("aggregated_size asec").select("aggregated_size")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
			  } },
			{ title: "population",
			  className: "text-right", 
			  data: "aggregated_population", 
			  responsivePriority: 3,
			  orderSequence: [ "desc", "asc" ],
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  if(value == null){ value=0 }
					return KOVM.formatNumber(value.toFixed(2))
				  }
				  return value
			  },
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#abddc5", "#57bb8a"]
				  var vals = KOVM.StarSystemVM.db().order("aggregated_population asec").select("aggregated_population")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
			  } },
			{ title: "economy",
			  className: "text-right", 
			  data: "aggregated_economy", 
			  responsivePriority: 3,
			  orderSequence: [ "desc", "asc" ],
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  if(value == null){ value=0 }
					return KOVM.formatNumber(value.toFixed(2))
				  }
				  return value
			  },
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#ffd966", "#f1c232"]
				  var vals = KOVM.StarSystemVM.db().order("aggregated_economy asec").select("aggregated_economy")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
			  } },
			{ title: "danger",
			  className: "text-right", 
			  data: "aggregated_danger", 
			  responsivePriority: 3,
			  orderSequence: [ "desc", "asc" ],
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  if(value == null){ value=0 }
					return KOVM.formatNumber(value.toFixed(2))
				  }
				  return value
			  },
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#f3beb9", "#e67c73"]
				  var vals = KOVM.StarSystemVM.db().order("aggregated_danger asec").select("aggregated_danger")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
			  } },
			{ title: "tunnels",
			  className: "text-right", 
			  data: "tunnel_departure_count", 
			  responsivePriority: 6,
			  orderSequence: [ "desc", "asc" ],
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#d9d2e9", "#8e7cc3"]
				  var vals = KOVM.StarSystemVM.db().order("tunnel_departure_count asec").select("tunnel_departure_count")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
				  $(td).css("width", "4em")
			  } },
			{ title: "large tunnels",
			  className: "text-right", 
			  data: "tunnel_departure_count_large", 
			  responsivePriority: 8,
			  orderSequence: [ "desc", "asc" ],
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#ffebb3", "#ffd666"]
				  var vals = KOVM.StarSystemVM.db().order("tunnel_departure_count_large asec").select("tunnel_departure_count_large")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
				  $(td).css("max-width", "8em")
			  } },
			{ title: "medium tunnels",
			  className: "text-right", 
			  data: "tunnel_departure_count_medium", 
			  responsivePriority: 8,
			  orderSequence: [ "desc", "asc" ],
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#fce5cd", "#f6b26b"]
				  var vals = KOVM.StarSystemVM.db().order("tunnel_departure_count_medium asec").select("tunnel_departure_count_medium")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
			  } },
			{ title: "small tunnels",
			  className: "text-right", 
			  data: "tunnel_departure_count_small", 
			  responsivePriority: 8,
			  orderSequence: [ "desc", "asc" ],
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#f3beb9", "#e67c73"]
				  var vals = KOVM.StarSystemVM.db().order("tunnel_departure_count_small asec").select("tunnel_departure_count_small")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
			  } },
			{ title: "habitable zone inner",
			  className: "text-right", 
			  data: "habitable_zone_inner", 
			  responsivePriority: 9,
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  if(value == null){ value=0 }
					return KOVM.formatNumber(value.toFixed(2)) + "au"
				  }
				  return value
			  } },
			{ title: "habitable zone outer",
			  className: "text-right", 
			  data: "habitable_zone_outer", 
			  responsivePriority: 9,
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  if(value == null){ value=0 }
					return KOVM.formatNumber(value.toFixed(2)) + "au"
				  }
				  return value
			  } },
			{ title: "frost line",
			  className: "text-right", 
			  data: "frost_line", 
			  responsivePriority: 9,
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  if(value == null){ value=0 }
					return KOVM.formatNumber(value.toFixed(2)) + "au"
				  }
				  return value
			  } },
			{ title: "last modified",
			  className: "text-right", 
			  data: "time_modified",
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  if(value == null){ value='' }
					return value.toLocaleString()
				  }
				  return value
			  } }
		]
	});
	self.dataTable.on('select', function ( $evt, dataTable, type, indexes ) {
		var dtData = dataTable.rows( indexes ).data().toArray()[0]
		KOVM.setSelectedRecord("star_system", dtData.ssid, true)
	})
}

KOVM.TunnelVM.dtViews = [
	new DTView("Default", null, KOVM.TunnelVM)
]
KOVM.TunnelVM.buildDataTable = function($table){
	//console.log("TunnelVM $table: ", $table)
	var self = this;
	self.dataTable = $table.DataTable({
		select: { style: 'single' },
		responsive: { details: false },
		dom: "ftip",
		data: self.db().get(),
		columns: [
			{ title: "id",
			  data: "tid" },
			{ title: "depature star system",
			  data: "entry_ss_name",
			  responsivePriority: 1 },
			{ title: "departure affiliation",
			  data: "entry_ss_affiliation_name",
			  responsivePriority: 3,
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  return '<span class="affiliation" affiliation="'+value+'">'+value+'</span>'; }
				  return value
			  } },
			{ title: "arrival star system",
			  data: "exit_ss_name",
			  responsivePriority: 1 },
			{ title: "arrival affiliation",
			  data: "exit_ss_affiliation_name",
			  responsivePriority: 3,
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  return '<span class="affiliation" affiliation="'+value+'">'+value+'</span>'; }
				  return value
			  } },
			{ title: "size",
			  data: "size",
			  responsivePriority: 2,
			  createdCell: function(td, cellData, rowData, row, col){
				  var c = new RGB("#ffffff")
				  switch(cellData){
					  case "L": c = new RGB("#ffd666"); break;
					  case "M": c = new RGB("#f6b26b"); break;
					  case "S": c = new RGB("#e67c73"); break;
					  default: console.warn("Unknown tunnel size.")
				  }
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
			  } }
		]
	});
	self.dataTable.on('select', function ( $evt, dataTable, type, indexes ) {
		var dtData = dataTable.rows( indexes ).data().toArray()[0]
		KOVM.setSelectedRecord("tunnel", dtData.tid, true)
	})
}

KOVM.CelestialObjectVM.dtViews = [
	new DTView("Default", null, KOVM.CelestialObjectVM),
	new DTView("Affiliations", [0,1,2,5,6,14], KOVM.CelestialObjectVM),
	new DTView("Sensor", [1,3,4,7,8,9,10], KOVM.CelestialObjectVM),
	new DTView("Stats", [0,1,10,11,12,13], KOVM.CelestialObjectVM),
	new DTView("Meta", [0,1,15], KOVM.CelestialObjectVM)
]
KOVM.CelestialObjectVM.buildDataTable = function($table){
	//console.log("CelestialObjectVM $table: ", $table)
	var self = this;
	var dbQuery = { type: {'!is': 'JUMPPOINT'} }
	self.dataTable = $table.DataTable({
		select: { style: 'single' },
		responsive: { details: false },
		dom: "ftip",
		data: self.db(dbQuery).get(),
		columns: [
			{ title: "system",
			  data: "star_system_name",
			  responsivePriority: 2,
			  createdCell: function(td, cellData, rowData, row, col){
				  $(td).css("min-width", "4.65em")
			  } },
			{ title: "name",
			  data: "designation_name",
			  responsivePriority: 1,
			  render: function(value, type, full, meta){
				  if(type == "display")
					return '<span class="ellipsis" title="'+value+'">' + value + '</span>'
				  return value
			  },
			  createdCell: function(td, cellData, rowData, row, col){
				  $(td).css("width", "10em")
			  } },
			{ title: "affiliation",
			  data: "affiliation_name",
			  responsivePriority: 5,
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  if(value == null){
						  return '-'
					  }
					  return '<span class="affiliation" affiliation="'+value+'">'+value+'</span>';
				  }
				  return value
			  } },
			{ title: "type",
			  data: "type",
			  responsivePriority: 3,
			  createdCell: function(td, cellData, rowData, row, col){
				  $(td).css("min-width", "9.15em")
			  } },
			{ title: "subtype",
			  data: "subtype",
			  responsivePriority: 6,
			  render: function(value, type, full, meta){
				  if(type == "display")
					return value ? '<span class="ellipsis" title="'+value+'">' + value + '</span>' : ''
				  return value
			  },
			  createdCell: function(td, cellData, rowData, row, col){
				  $(td).css("width", "10em")
			  } },
			{ title: "satelites",
			  className: "text-right",
			  data: "child_count",
			  responsivePriority: 9,
			  orderSequence: [ "desc", "asc" ],
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#abddc5", "#57bb8a"]
				  var vals = KOVM.CelestialObjectVM.db().order("child_count asec").select("child_count")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
			  } },
			{ title: "habitable",
			  className: "text-center",
			  data: "habitable",
			  responsivePriority: 8,
			  orderSequence: [ "desc", "asc" ],
			  render: function(value, type, full, meta){
				  if(type == "display")
					return (value ? 'Yes' : 'No')
				  return value
			  },
			  createdCell: function(td, cellData, rowData, row, col){
				  if( cellData ) {
					  $(td).css("background-color", "#75a6e8"); }
			  } },
			{ title: "population",
			  className: "text-right",
			  data: "sensor_population",
			  responsivePriority: 4,
			  orderSequence: [ "desc", "asc" ],
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#abddc5", "#57bb8a"]
				  var vals = KOVM.CelestialObjectVM.db().order("sensor_population asec").select("sensor_population")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
			  } },
			{ title: "economy",
			  className: "text-right",
			  data: "sensor_economy",
			  responsivePriority: 4,
			  orderSequence: [ "desc", "asc" ],
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#ffd966", "#f1c232"]
				  var vals = KOVM.CelestialObjectVM.db().order("sensor_economy asec").select("sensor_economy")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
			  } },
			{ title: "danger",
			  className: "text-right",
			  data: "sensor_danger",
			  responsivePriority: 4,
			  orderSequence: [ "desc", "asc" ],
			  createdCell: function(td, cellData, rowData, row, col){
				  var colorAry = ["#ffffff", "#f3beb9", "#e67c73"]
				  var vals = KOVM.CelestialObjectVM.db().order("sensor_danger asec").select("sensor_danger")
				  var pct = calcPercent(cellData, vals)
				  var c = colorBlender(colorAry, pct)
				  $(td).css("background-color", c)
				  applyBlackText(c, $(td))
			  } },
			{ title: "size",
			  className: "text-right",
			  data: "size",
			  responsivePriority: 10,
			  orderSequence: [ "desc", "asc" ],
			  render: function(value, type, full, meta){
				  if(type == "display")
					  if(value == null){ value=0 }
					return KOVM.formatNumber(value.toFixed(2)) + "km"
				  return value
			  },
			  createdCell: function(td, cellData, rowData, row, col){
				  try{
					  var colorAry = ["#ffffff", "#9fc5e8", "#4a86e8"]
					  var vals = KOVM.CelestialObjectVM.db().order("size asec").select("size")
					  var pct = calcPercent(cellData, vals)
					  var c = colorBlender(colorAry, pct)
					  //console.log("cellData: ",cellData,"\npct: ",pct, "\nc: ",c)
					  $(td).css("background-color", c)
					  applyBlackText(c, $(td))
				  } catch(e){
					  console.error(e,"\nrowData: ",rowData,"\npercent: ",pct)
				  }
			  } },
			{ title: "distance",
			  className: "text-right",
			  data: "distance",
			  responsivePriority: 11,
			  orderSequence: [ "desc", "asc" ],
			  render: function(value, type, full, meta){
				  if(type == "display")
					  if(value == null){ value=0 }
					return KOVM.formatNumber(value.toFixed(2)) + "au"
				  return value
			  } },
			{ title: "orbital period",
			  className: "text-right",
			  data: "orbit_period",
			  responsivePriority: 12,
			  orderSequence: [ "desc", "asc" ],
			  render: function(value, type, full, meta){
				  if(type == "display")
					  if(value == null){ value=0 }
					return KOVM.formatNumber(value.toFixed(2)) + " days"
				  return value
			  } },
			{ title: "axial tilt",
			  className: "text-right",
			  data: "axial_tilt",
			  responsivePriority: 12,
			  orderSequence: [ "desc", "asc" ],
			  render: function(value, type, full, meta){
				  if(type == "display")
					  if(value == null){ value=0 }
					return KOVM.formatNumber(value.toFixed(2)) + "&deg;"
				  return value
			  } },
			{ title: "fair chance act",
			  className: "text-right",
			  data: "fairchanceact",
			  responsivePriority: 12,
			  orderSequence: [ "desc", "asc" ],
			  render: function(value, type, full, meta){
				  if(type == "display")
					return (parseInt(value) ? 'Protected' : '-')
				  return value
			  } },
			{ title: "last modified",
			  className: "text-right", 
			  data: "time_modified",
			  render: function(value, type, full, meta){
				  if(type == "display")
					  if(value == null){ value='' }
					return value.toLocaleString()
				  return value
			  } }
		]
	});
	self.dataTable.on('select', function ( $evt, dataTable, type, indexes ) {
		var dtData = dataTable.rows( indexes ).data().toArray()[0]
		KOVM.setSelectedRecord("celestial_object", dtData.coid, true)
	})
}

KOVM.AffiliationVM.dtViews = [
	new DTView("Default", null, KOVM.AffiliationVM)
]
KOVM.AffiliationVM.buildDataTable = function($table){
	//console.log("AffiliationVM $table: ", $table)
	var self = this;
	self.dataTable = $table.DataTable({
		select: { style: 'single' },
		responsive: { details: false },
		dom: "ftip",
		data: self.db().get(),
		columns: [
			{ title: "id",
			  data: "aid" },
			{ title: "name",
			  data: "affiliation_name",
			  responsivePriority: 1,
			  render: function(value, type, full, meta){
				  if(type == "display"){
					  return '<span class="affiliation" affiliation="'+value+'">'+value+'</span>'; }
				  return value
			  } },
			{ title: "star systems",
			  className: "text-right",
			  data: "star_system_count",
			  responsivePriority: 2 ,
			  orderSequence: [ "desc", "asc" ] },
			{ title: "celestial objects",
			  className: "text-right",
			  data: "celestial_object_count",
			  responsivePriority: 2,
			  orderSequence: [ "desc", "asc" ] }
		]
	});
	self.dataTable.on('select', function ( $evt, dataTable, type, indexes ) {
		var dtData = dataTable.rows( indexes ).data().toArray()[0]
		KOVM.setSelectedRecord("affiliation", dtData.aid, true)
	})
}

//Stage 1 - Load and create TaffyDBs
Stages.add(function() {
    console.log("enter stage 1");
    var loadTaffyDB = $.ajax("https://raw.githubusercontent.com/typicaljoe/taffydb/master/taffy.js", {
        beforeSend: function() {
            Stages.AsyncWaitLock++;
        },
        complete: function() {
            Stages.AsyncWaitLock--;
        }
    });
    loadTaffyDB.fail(function(jqXHR, textStatus, errorThrown) {
        console.error(textStatus, errorThrown);
    });
    loadTaffyDB.done(function(data, textStatus, jqXHR) {
        console.info(textStatus + " - TaffyDB");
        eval.call(window, data);

        KOVM.AffiliationVM.db = new TAFFY();
        KOVM.StarSystemVM.db = new TAFFY();
        KOVM.CelestialObjectVM.db = new TAFFY();
        KOVM.TunnelVM.db = new TAFFY();
    });
});

//Stage 2 - Read in and create Affiliations, Tunnels, and Star Systems
Stages.add(function() {
    console.log("enter stage 2");
    DataSource.getBootup(function(data) {
        KOVM.AffiliationVM.db.insert(Parser.parseAffiliation(data));
        console.debug("Got affiliations", KOVM.AffiliationVM.db().count());

        KOVM.TunnelVM.db.insert(Parser.parseTunnels(data));
        console.debug("Got tunnels", KOVM.TunnelVM.db().count());

        KOVM.StarSystemVM.db.insert(Parser.parseStarSystemsFromBootup(data));
        console.debug("Got star systems", KOVM.StarSystemVM.db().count());

        KOVM.StarSystemVM.db().each(function(ss, ssNum) {
            DataSource.getStarSystemDetails(ss.code, function(data) {
				KOVM.StarSystemVM.db({ code: ss.code }).update(Parser.parseStarSystemDetails(data));

                KOVM.CelestialObjectVM.db.insert(Parser.parseCelestialObjectsFromStarSystemDetials(data, ss.ssid));
            });
        });
    });
});

/**/
//Stage 3 - Read in Celestial Object Details and update records
Stages.add(function() {
    console.log("enter stage 3");
    KOVM.CelestialObjectVM.db().each(function(co, coNum) {
		var ssid = co.ssid
        var recursive = function(data) {
            if (KOVM.CelestialObjectVM.db({ code: data.resultset[0].code }).count() === 0) {
                KOVM.CelestialObjectVM.db.insert(Parser.parseCelestialObjectDetials(data, ssid));
            } else {
				KOVM.CelestialObjectVM.db({ code: data.resultset[0].code }).update(Parser.parseCelestialObjectDetials(data, ssid));
			}
            
			var children = data.resultset[0].children;
            for (var i = 0; i < children.length; i++) {
				if (KOVM.CelestialObjectVM.db({ code: children[i].code }).count() === 0) {
					DataSource.getCelestialObjectDetails(children[i].code, recursive);
				}
            }
        }

        DataSource.getCelestialObjectDetails(co.code, recursive);
    });
	console.debug("Got celestial objects", KOVM.CelestialObjectVM.db().count());
});
//*/

//Stage 4 - merge databases
Stages.add(function() {
	console.log("enter stage 4");
	
	KOVM.AffiliationVM.db().update(function(){
		var ssQuery = KOVM.StarSystemVM.db({ affiliation_id: this.aid })
		ssQuery.update({ affiliation_name: this.affiliation_name });
		this.star_system_count = ssQuery.count();
		
		var coQuery = KOVM.CelestialObjectVM.db({ affiliation_id: this.aid })
		coQuery.update({ affiliation_name: this.affiliation_name })
		this.celestial_object_count = coQuery.count();
		
		return this;
	})
	
	KOVM.StarSystemVM.db().update(function(){
		var arrivalTunnels = KOVM.TunnelVM.db({ exit_ssid: this.ssid });
		arrivalTunnels.update({ exit_ss_name: this.name, exit_ss_affiliation_name: this.affiliation_name });
		this.tunnel_arrival_count = arrivalTunnels.count();
		this.tunnel_arrival_count_large = arrivalTunnels.filter({ size: "L" }).count();
		this.tunnel_arrival_count_medium = arrivalTunnels.filter({ size: "M" }).count();
		this.tunnel_arrival_count_small = arrivalTunnels.filter({ size: "S" }).count();
		
		var departureTunnels = KOVM.TunnelVM.db({ entry_ssid: this.ssid });
		departureTunnels.update({ entry_ss_name: this.name, entry_ss_affiliation_name: this.affiliation_name });
		this.tunnel_departure_count = departureTunnels.count();
		this.tunnel_departure_count_large = departureTunnels.filter({ size: "L" }).count();
		this.tunnel_departure_count_medium = departureTunnels.filter({ size: "M" }).count();
		this.tunnel_departure_count_small = departureTunnels.filter({ size: "S" }).count();
		
		var coQuery = KOVM.CelestialObjectVM.db({ ssid: this.ssid });
		this.celestial_object_count = coQuery.count();
		coQuery.update({ star_system_name: this.name });
		
		return this;
	});
	
	KOVM.CelestialObjectVM.db().update(function(){
		
		this.child_count = KOVM.CelestialObjectVM.db({ parent_id: this.coid }).count();
		if(this.parent_id){
			this.parent_name = KOVM.CelestialObjectVM.db({ coid: this.parent_id }).first().designation_name
		}
		
		return this;
	});
});

//Stage 5 - Build Datatables
Stages.add(function() {
    console.log("enter stage 5");
	
	KOVM.setSelectedRecord("star_system", '314')
	ko.applyBindings(KOVM, $("body").get(0))
	
	$("#star_system_tab").on("shown.bs.tab",function(e){
		var vm = KOVM.StarSystemVM
		var selected
		while(!selected){
			selected = vm.dataTable.row( {selected: true} ).data()
			if(!selected){
				var pageInfo = vm.dataTable.page.info()
				var rows = vm.dataTable.rows().$('tr').get()
				$( rows[pageInfo.start] ).children().get(0).click()
			}
		}
	}).trigger("shown.bs.tab")
	$("#tunnel_tab").on("shown.bs.tab",function(e){
		var vm = KOVM.TunnelVM
		var selected
		while(!selected){
			selected = vm.dataTable.row( {selected: true} ).data()
			if(!selected){
				var pageInfo = vm.dataTable.page.info()
				var rows = vm.dataTable.rows().$('tr').get()
				$( rows[pageInfo.start] ).children().get(0).click()
			}
		}
	})
	$("#celestial_object_tab").on("shown.bs.tab",function(e){
		var vm = KOVM.CelestialObjectVM
		var selected
		while(!selected){
			selected = vm.dataTable.row( {selected: true} ).data()
			if(!selected){
				var pageInfo = vm.dataTable.page.info()
				var rows = vm.dataTable.rows().$('tr').get()
				$( rows[pageInfo.start] ).children().get(0).click()
			}
		}
	})
	$("#affiliation_tab").on("shown.bs.tab",function(e){
		var vm = KOVM.AffiliationVMA
		var selected
		while(!selected){
			selected = vm.dataTable.row( {selected: true} ).data()
			if(!selected){
				var pageInfo = vm.dataTable.page.info()
				var rows = vm.dataTable.rows().$('tr').get()
				$( rows[pageInfo.start] ).children().get(0).click()
			}
		}
	})
	
	$('body').on("onkeypress",function(e){
		console.log("on keypress: ",e)
	})
});



function CollapsibleNav($elem){
	$elem.each(function(idx, el){
		var $el = $(el)
		var $head = $(".collapsible-head", $el)
		var $body = $(".collapsible-body", $el)
		
		var expand = $("<button></button>", {
			type: "button",
			"class": "btn pull-right collapsible-control expand",
			click: function(){
				console.log("$el: ",$el)
				$el.addClass("expanded")
			}
		});
		expand.append($("<span></span>", {
			"class": "glyphicon glyphicon-chevron-down"
		}));
		$head.append(expand);
		
		var collapse = $("<button></button>", {
			type: "button",
			"class": "btn pull-right collapsible-control collapse",
			click: function(){
				console.log("$el: ",$el)
				$el.removeClass("expanded")
			}
		});
		collapse.append($("<span></span>", {
			"class": "glyphicon glyphicon-chevron-up"
		}));
		$head.append(collapse);
	})
}
CollapsibleNav( $(".collapsible-nav") );

function buildOtherTables(e) {
	var $tab = $(e.target)
	var $tabpane = $( $tab.attr("href") )
	var $table = $("table.dataTable", $tabpane)
	//console.log("tab: ", $tab.get(0), "\ntabpane: ", $tabpane.get(0), "\ntable: ", $table.get(0))
	$table.DataTable().responsive.rebuild()
		.responsive.recalc()
		.columns.adjust();
}

$('nav.navbar ul.navbar-nav > li > a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
	var $tab = $(e.target)
	var $tabpane = $( $tab.attr("href") )
	var $table = $("table.dataTable", $tabpane)
	//console.log("tab: ", $tab.get(0), "\ntabpane: ", $tabpane.get(0), "\ntable: ", $table.get(0))
	$table.DataTable().responsive.rebuild()
		.responsive.recalc()
		.columns.adjust();
})
/** /
$('#detailsModal').one('shown.bs.modal', function(e) {
	var $modal = $(e.target)
	var $table = $("table.dataTable", $modal)
	console.log("modal: ", $modal.get(0), "\ntable: ", $table.get(0))
	$table.DataTable({ dom: "tp" })
})
//*/




Stages.runAll();




/* Utility */
function applyBlackText(c, $td){
	if(c.sum() > 670){
		$td.addClass("black-text")
	}
}
function calcPercent(val, range){
	range = range.filter(function(val){ return !isNaN(val); }).sort(function(a,b){ return a-b; })
	var avg = range.reduce(function(sum, val){ return val + sum; }) / range.length
	var calc = function(val, max, min){
		var rtn = (val - min) / (max - min) / 2 || 0
		if(rtn < 0 ) {
			console.warn("Calculated a negative percent.\nval: ",val,"\navg: ",avg,"\nmax: ",max,"\nmin: ",min,"\nrtn: ",rtn); }
		return rtn
	}
	
	if(val > avg){
		return calc(val, range[range.length - 1], avg) + 0.5
	} else {
		return calc(val, avg, range[0])
	}
}
function colorBlender(colorAry, pct){
	var p =(colorAry.length - 1) * pct
	var c1 = new RGB( colorAry[Math.floor(p)] ).toObject()
	var c2 = new RGB( colorAry[Math.ceil(p)] ).toObject()
	var subPct = p % 1
	var rgb = {}
	for(var i in c1){
		rgb[i] = subPct * (c2[i] - c1[i]) + c1[i]
	}
	return (new RGB(rgb))
}
function RGB(val){
	var rgb = { r: 0, g: 0, b: 0 }
	switch(typeof val){
		case "string":
			var ary = (val.indexOf('#') > -1 ? val.substring(1) : val).split('');
			for(var i in rgb){
				rgb[i] = parseInt(ary.splice(0,2).join(''), 16);
			}
			break;
		case "object":
			for(var i in rgb){
				rgb[i] = val[i];
			}
			break;
		default:
			throw new Error("Argument is of unsupported type: "+(typeof val));
	}
	for(var i in rgb){
		this[i] = rgb[i];
	}
}
RGB.prototype.sum = function(){
	return this.r + this.g + this.b
}
RGB.prototype.toString = function(){
	var ary = [this.r, this.g, this.b]
	var str = '#'
	for(var i=0; i<ary.length; i++){
		str += Math.round(ary[i]).toString(16)
	}
	return str
}
RGB.prototype.toObject = function(){
	return { r: this.r, g: this.g, b: this.b }
}
//colorBlender(["#ffffff", "#9fc5e8", "#4a86e8"], 0.5)


