import { Component } from "react";
import DetailsHeader from "@/starmap_db/components/elements/DetailsHeader";

export default class SpeciesDetails extends Component {
    constructor(props){
        super(props)
    }

    render(){
        const record = this.props.record

        return(<>
        <div className="row">
            {/* Header & Name */}
            <DetailsHeader
                title={ record.name }
                sectionAttr={ {
                   //style: {'backgroundImage': 'url('+record.thumbnail_info.images.post+')'} 
                } } //TODO: find way to change source based on size
            />
        </div>
        <div className="row">
            <p className="col-12">
                *Note From Developer: Although this information is included in the data returned
                from RSI, it is never used in the data that I have found currently. I was excited
                to see this addition to the data too. Hopefully in the future it will be utilized.
            </p>
        </div>
        </>)
    }
}