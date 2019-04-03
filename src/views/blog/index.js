import React from 'react';
import Header from '../../components/header/';
import Footer from '../../components/footer/';

const Blog = () => (
    <div className="container-fluid">
        <div className="row justify-content-md-center">
            <div className="col-12">
                <Header />
            </div>
            <div className="col col-md-7">
                <h1>Blog</h1>
            </div>
        </div>
        <div className="row">
            <Footer />
        </div>
    </div>
);

export default Blog;
