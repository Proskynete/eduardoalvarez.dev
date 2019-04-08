import React from 'react';
import { Link } from "react-router-dom";

import Header from 'Components/header/';
import Coffee from 'Components/coffee/';
import Footer from 'Components/footer/';
import LinkWeb from 'Components/linkweb/';
import Highlighted from 'Components/highlighted/';
import Line from 'Components/line/';
import './index.scss';

const WhoIAm = () => (
    <div className="container-fluid">
        <div className="row justify-content-md-center">
            <div className="col-12">
                <Header />
            </div>
            <div className="col col-md-7">
                <div className="container">
                    <h1 className="container__title">Quien soy</h1>
                    <p className="container__content">
                        Hola!!! Mi nombre es <Highlighted content="Eduardo Esteban Álvarez Castañeda" /> y soy
                        nivel 25 en este juego llamado vida. Nacido y criado en Santiago de Chile (lugar donde sigo viviendo). Hijo
                        mayor de <Highlighted content="Eduardo Álvarez Dubles" /> (super original mi papá)
                        y <Highlighted content="Janett Castañeda González" />. Un día Viernes, cuando recien partía el día 24 de Diciembre del
                        año 1993 fue cuando dije mi primer <Highlighted content="Hola Mundo" />.
                    </p>
                    <p className="container__content">
                        Actualmente me encuentro trabajando para <LinkWeb link="http://www.globant.com" title="Globant" /> como
                        <Highlighted content="Desarrollador Web Ssr" />. En las tardes me voy a la universidad para
                        estudiar <Highlighted content="Ingeniería en computación e informática" /> y los fines de semana (o cuando encuentro
                        un tiempo libre) me dedico a hacer contenido para mi blog.
                    </p>
                    <p className="container__content">
                        Por si quieres saber más a detalle en lo que estoy actualmente,
                        visita <Link className="container__content__link" to="/now">éste link</Link>.
                    </p>
                </div>
                <div className="container">
                    <h1 className="container__title">Como inicié?</h1>
                    <p className="container__content">
                        Desde que tengo memoria, recuerdo que siempre me llamó la atención la computación y desde pequeño quise aprender
                        como es que funcionaba por dentro.
                    </p>
                    <p className="container__content">
                        Cuando estaba entrando a la enseñanza media <Highlighted content="(2007)" /> me hice amigo
                        de <LinkWeb link="https://twitter.com/m_mrk2" title="Marcelo Mercado" /> quien estaba entrando a primer año de Ing. en
                        informática. En ese tiempo fue cuando él empezo a hacer trabajos de desarrollo de sitios web
                        con <LinkWeb link="https://www.joomla.org/" title="Joomla" /> mientras que por mi parte estaba
                        estudiando <Highlighted content="HTML5" />, <Highlighted content="CSS3" /> y <Highlighted content="JS" /> con <LinkWeb link="https://codigofacilito.com/" title="CódigoFacilito" />.
                    </p>
                    <p className="container__content">
                        En el <Highlighted content="2012" /> entré a la universidad Iberoamericana de Ciencias
                        y Tecnología para estudiar <Highlighted content="Ingeniería Civil en Computación e Informática" /> la
                        cual no pude terminar gracias a que dicha universidad cerró. En esos mismos años, ya estaba haciendo trabajos como
                        freelance los cuales mantengo hasta el día de hoy.
                    </p>
                </div>
                <div className="container">
                    <h1 className="container__title">Solo programación?</h1>
                    <p className="container__content">
                        A pesar de que disfruto el programar y aprender de nuevas tecnologías, también me gustan otras cosas como por ejemplo:
                        Jugar videojuegos, tocar instrumentos de cuerda (tengo un teclado, una guitarra eléctrica y dos guitarras electroacústicas),
                        ver anime y dibujos animados infantiles.
                    </p>
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

export default WhoIAm;
