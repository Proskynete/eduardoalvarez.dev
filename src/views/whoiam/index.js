import React from 'react';
import Header from '../../components/header/';
import Footer from '../../components/footer/';

const WhoIAm = () => (
    <div className="container-fluid">
        <div className="row justify-content-md-center">
            <div className="col-12">
                <Header />
            </div>
            <div className="col col-md-8">
                <h1>Who I am</h1>
            </div>
        </div>
        <div className="row">
            <Footer />
        </div>
    </div>
);

export default WhoIAm;
