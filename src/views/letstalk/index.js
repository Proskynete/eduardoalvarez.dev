import React from 'react';
import Header from '../../components/header/';
import Coffee from '../../components/coffee/';
import Footer from '../../components/footer/';
import Line from '../../components/line/';
import './index.scss';

const LetsTalk = () => (
    <div className="container-fluid">
        <div className="row justify-content-md-center">
            <div className="col-12">
                <Header />
            </div>
            <div className="col col-md-7">
                <div className="container">
                    <h1 className="container__title">Hablemos</h1>
                    <p className="container__content" />
                </div>
                <Line />
            </div>
        </div>
        <div className="row justify-content-md-center">
            <div className="col-12">
                <Coffee />
            </div>
        </div>
        <div className="row">
            <Footer />
        </div>
    </div>
);

export default LetsTalk;
