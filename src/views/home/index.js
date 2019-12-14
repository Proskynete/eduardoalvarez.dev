/* eslint-disable react/no-danger */
/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect } from 'react';
import { createMarkup } from '@Helpers/print-html.helper';
import Header from '@Components/header/';
import Coffee from '@Components/coffee/';
import Footer from '@Components/footer/';
import Line from '@Components/line/';
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

	useEffect(() => {
		fetch('http://localhost:3000/node/api/home')
			.then(res => res.json())
			.then(response => {
				setData(response.content);
			});
	}, []);

	return (
		<>
			<Header />
			<div className="container-fluid">
				<div className="row justify-content-md-center">
					<div className="col col-md-5">{handlePrintContent(data)}</div>
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
