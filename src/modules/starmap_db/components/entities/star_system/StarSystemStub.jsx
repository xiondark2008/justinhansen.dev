import { Component } from "react";
import BootstrapProgressBar from "@/common/components/elements/BootstrapProgressBar";
import NumberCallout from "@/common/components/elements/NumberCallout"

import { ENTITY_PATHS, UI_ENTITY_STUBS } from "@/modules/starmap_db/utils/Utilities";
import { isEmpty } from "@/common/utils/Utilities";

export default class StarSystemStub extends Component {
    constructor(props){
        super(props)

        this.state = {
            record: {}
        }
    }

    componentDidMount(){
        const self = this,
            filter = JSON.stringify( { ssid: this.props.ssid } ),
            dataUrl = UI_ENTITY_STUBS[ ENTITY_PATHS.starSystem ].dataUrl+"?filter="+encodeURIComponent( filter )
        
        fetch( dataUrl )
            .then( response => response.json() )
            .then( json => { //console.log("json: ", json)
                if( json.data && json.data.length > 0){
                    const data = json.data[0]
                    console.info("INFO - in StarSystemStub.componentDidMount > fetched: ",json)
                    self.setState( prevState => {
                        return {
                            record: data
                        }
                    })
                }
            })
    }

    render(){
        const record = this.state.record

        if( !record || isEmpty(record) ){
            return <span>Loading...</span>
        }

        return(<>
        <div className="row ms-sm-3">
            <h4 className="border-bottom"><a>{ record.name }</a> <small className="text-muted">{ record.affiliation_name }</small></h4>
            <div className="row">
                <div className="col-6 col-sm-3">
                    <h5 className="text-sm-end">Departure</h5>
                </div>
                <div className="col-6 col-sm-3">
                    <NumberCallout
                        value={ ([record.tid_departure_large.length,
                                record.tid_departure_medium.length,
                                record.tid_departure_small.length]).reduce( (prev,val)=>prev+val, 0) }
                        label='Tunnels'
                    />
                </div>
                <div className="col-6 col-sm-3">
                    <h5 className="text-sm-end">Arrival</h5>
                </div>
                <div className="col-6 col-sm-3">
                    <NumberCallout
                        value={ ([record.tid_arrival_large.length,
                                record.tid_arrival_medium.length,
                                record.tid_arrival_small.length]).reduce( (prev,val)=>prev+val, 0) }
                        label='Tunnels'
                    />
                </div>
            </div>
            <dl className="row font-normal">
                <dt className="col-12 col-sm-4 text-sm-end">Popuation</dt>
                <dd className="col-12 col-sm-8">
                    <BootstrapProgressBar
                        barsAttr={ {
                            text: record.population,
                            className:"bg-success",
                            style: {width: (record.population / 10 * 100)+'%'}
                        } }
                    />
                </dd>
                <dt className="col-12 col-sm-4 text-sm-end">Economy</dt>
                <dd className="col-12 col-sm-8">
                    <BootstrapProgressBar
                        barsAttr={ {
                            text: record.economy,
                            className:"bg-warning",
                            style: {width: (record.economy / 10 * 100)+'%'}
                        } }
                    />
                </dd>
                <dt className="col-12 col-sm-4 text-sm-end">Danger</dt>
                <dd className="col-12 col-sm-8">
                    <BootstrapProgressBar
                        barsAttr={ {
                            text: record.danger,
                            className:"bg-danger",
                            style: {width: (record.danger / 10 * 100)+'%'}
                        } }
                    />
                </dd>
            </dl>
        </div>
        </>)
    }
}