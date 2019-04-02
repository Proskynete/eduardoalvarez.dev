import React from 'react';
import Header from '../../components/header/';
import Footer from '../../components/footer/';
import { Link } from "react-router-dom";
import './index.scss';

const handleShowSocialsNetwork = () => {

}

const Home = () => (
    <div className="container-fluid">
        <div className="row justify-content-md-center">
            <div className="col-12">
                <Header />
            </div>
            <div className="col col-md-8">
                <div className="container">
                    <h1 className="container__title">Quien soy en 15 segundos</h1>
                    <p className="container__content">
                        Soy estudiante de ingeniería en computación e informática en
                        la <a className="container__content__link" target="_blank" rel="noopener noreferrer" href="https://www.unab.cl/">UNAB</a>, desarrollador web (Web UI) en
                        la empresa <a className="container__content__link" target="_blank" rel="noopener noreferrer" href="http://www.globant.com">Globant</a>.
                        Apasionado por las tecnologías web. Me creé este sitio porque busco poder compartir el conocimiento que he
                        adquirido a lo largo de todo este tiempo.
                    </p>
                </div>
                <div className="container">
                    <h1 className="container__title">Quien soy en 10 minutos</h1>
                    <p className="container__content">
                        Puedes leer más en la página: <Link className="container__content__link" to="/quien-soy">Quien soy</Link>
                    </p>
                </div>
                <div className="container">
                    <h1 className="container__title">En que estoy ahora?</h1>
                    <p className="container__content">
                        Te recomiendo que visites <Link className="container__content__link" to="/now">Now</Link> para que sepas más a detalle que es
                        en lo que estoy metido.
                    </p>
                </div>
                <div className="container">
                    <h1 className="container__title">Quieres que hablemos?</h1>
                    <p className="container__content">
                        Puedes contactarme <a className="container__content__link" href="https://mobile.twitter.com/proskynete" target="_blank" rel="noopener noreferrer">Twitter</a> y
                        te prometo que trataré de responderte lo más rápido posible o, si gustas, también puedes mandarme un correo al
                        mail <a className="container__content__link" href="mailto:eduardo.a1993@gmail.com">eduardo.a1993@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>
        <div className="row">
            <Footer />
        </div>
    </div>
);

export default Home;
