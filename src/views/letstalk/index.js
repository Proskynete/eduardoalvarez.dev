import React from 'react';
import Header from '../../components/header/';
import Footer from '../../components/footer/';

const LetsTalk = () => (
    <div className="container-fluid">
        <div className="row justify-content-md-center">
            <div className="col-12">
                <Header />
            </div>
            <div className="col col-md-8">
                <h1>Let`s Talk</h1>
            </div>
        </div>
        <div className="row">
            <Footer />
        </div>
    </div>
);

export default LetsTalk;
