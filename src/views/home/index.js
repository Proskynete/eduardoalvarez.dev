/* eslint-disable react/no-danger */
/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createMarkup } from '@Helpers/print-html.helper';
import { Header, Coffee, Footer, Line, Loader } from '@Components';
import './index.scss';

const handlePrintContent = data => {
	return data.map((info, i) => {
		return (
			<div key={info._id} className="container">
				<section className="container__inner">
					<h1 className="container__inner__title">
						{info.title}
						<span className="container__inner__title__subtitle">
							{info.subtitle}
						</span>
					</h1>
					<p
						className="container__inner__content"
						dangerouslySetInnerHTML={createMarkup(JSON.parse(info.content))}
					/>
				</section>

				{i + 1 < data.length ? <Line /> : ''}
			</div>
		);
	});
};

const Home = () => {
	const [data, setData] = useState([]);
	const [loader, setLoader] = useState(false);

	useEffect(() => {
		const fetchGetData = async () => {
			try {
				setLoader(true);
				const response = await axios('http://localhost:3000/node/api/home');
				setData(response.data.content);
				setLoader(false);
			} catch (err) {
				setLoader(false);
				console.log(err);
			}
		};

		fetchGetData();
	}, []);

	return (
		<>
			<Header />
			<div className="container-fluid">
				<div className="row justify-content-md-center">
					<div className="col col-md-5">
						{loader ? <Loader /> : handlePrintContent(data)}
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
		</>
	);
};

export default Home;
