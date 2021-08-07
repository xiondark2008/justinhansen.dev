import { Component } from "react";
import DetailsHeader from "@/starmap_db/components/elements/DetailsHeader";
import StarSystemStub from "@/starmap_db/components/entities/star_system/StarSystemStub";
import { tunnelSizeToLabel } from "@/modules/starmap_db/utils/Utilities";

export default class TunnelDetails extends Component {
    constructor(props){
        super(props)
    }

    render(){
        const record = this.props.record

        return(<>
        <div className="row">
            {/* Header & Name */}
            <DetailsHeader
                title={ record.entry_ss_name + ' - ' + record.exit_ss_name}
                subtitle={ tunnelSizeToLabel( record.size ) }
            />
        </div>
        <div className="row">
            {/* Entry Star System Details */}
            <section className="col-md-6 col-lg-12 mb-3">
                <h4 className="border-bottom">Origin Star System</h4>
                <StarSystemStub
                    key={ record.entry_ssid }
                    ssid={ record.entry_ssid }/>
            </section>
            
            {/* Exit Star System Details */}
            <section className="col-md-6 col-lg-12 mb-3">
                <h4 className="border-bottom">Destination Star System</h4>
                <StarSystemStub
                    key={ record.exit_ssid }
                    ssid={ record.exit_ssid }/>
            </section>
        </div>
        </>)
    }
}