import Head from 'next/head'
import Footer from '@/portfolio/components/Footer';

import { Component } from "react";
import Navbar from "@/starmap_db/components/Navbar.jsx";
import ListView from "@/starmap_db/components/ListView.jsx";
import DetailsView from "@/modules/starmap_db/components/DetailsView.jsx";
import { ENTITY_PATHS, UI_ENTITY_STUBS } from "@/starmap_db/utils/Utilities";

//import style from "@/starmap_db/styles/StarMapDB.module.scss"

export default class StarMapDB extends Component {
    constructor(props) { //console.debug("in StarMapDB.constructor", arguements)
        super(props)

        this.state = {
            record: null,
            recordEntityStub: null,
            tableEntityStub: UI_ENTITY_STUBS[ ENTITY_PATHS.starSystem ]
        }

        this.setRecord = this.setRecord.bind(this)
        this.setTableEntityStub = this.setTableEntityStub.bind(this)
        this.setContentHeight = this.setContentHeight.bind(this)
    }

    componentDidMount(){
        $(window).on('resize', this.setContentHeight)
        $(window).trigger('resize')
    }

    setRecord(record, entityStub){
        this.setState( prevState => {
            const obj = {
                record: record
            }

            if( entityStub ){
                obj.recordEntityStub = entityStub
            }

            return obj
        })
    }
    setTableEntityStub( entityStub ){
        this.setState({
            tableEntityStub: entityStub
        })
    }

    setContentHeight(){
        const vh = $(window).height()
        const navBar = $('nav.navbar').outerHeight()

        $('main').height( Math.floor(vh - navBar) )
    }

    render(){ //console.debug("in StarMapDB.render", arguements)
        const title = "StarMapDB"

        return(<>
        <Head>
            <title>{title}</title>
            <meta name="description" content={title} />
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <Navbar
            currentEntityStub={ this.state.tableEntityStub }
            setEntityStub={ this.setTableEntityStub }
            theme='light'
        />
        <main className='navbar-spacer'>
            {/* <div className="container-fluid h-100"> */}
                <div className="h-100 d-flex align-items-stretch">
                    <ListView
                        entityStub={ this.state.tableEntityStub }
                        setRecord={ this.setRecord }
                        record={ this.state.record }
                    />
                    <DetailsView
                        record={ this.state.record }
                        entityStub={ this.state.recordEntityStub }
                        setRecord={ this.setRecord }
                    />
                </div>
            {/* </div> */}
        </main>
        <Footer/>
        </>);
    }
}
