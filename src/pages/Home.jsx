import React from 'react'
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { useFetch } from '../hooks/fetchDataHooks'
import styles from './Home.module.css'
function Home () {
    const [storiesNumber, setStoriesNumber] = useState(10);
    const [chartData, setChartData] = useState({})
    const [inputError, setInputError] = useState('')
    const API_URL = `https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty`
	const { data, scores, descendants,  error, status } = useFetch(API_URL, storiesNumber);

    //re-calculate the chart
    useEffect(() => {
        if(scores.length > 0 && descendants.length > 0)
       {
           const data = {
             labels: scores,
             datasets: [
               {
                 label: "My First dataset",
                 fillColor: "rgba(220,220,220,0.2)",
                 strokeColor: "rgba(220,220,220,1)",
                 pointColor: "rgba(220,220,220,1)",
                 pointStrokeColor: "#fff",
                 pointHighlightFill: "#fff",
                 pointHighlightStroke: "rgba(220,220,220,1)",
                 data: descendants,
               },
             ],
           };
        setChartData(data)}
    }, [status, scores, descendants])

    const handleSubmit = (e) => {
		e.preventDefault();
		const query = e.target.search.value;
		if (query) {
			setStoriesNumber(query);
			e.target.search.value = '';      
		}
	};
    return (
        <div>
            <form className={styles.Form} onSubmit={handleSubmit}>
				<input
					type="number" 
                    pattern="[0-9]*" 
                    inputmode="numeric"
					autoFocus
					autoComplete="off"
					name="search"
					placeholder="Number of stories"
				/>
				<button> Search </button>
			</form>
            <span style={{color: "red"}}>{this.state.errors["name"]}</span>
            <Line data={chartData}
            options = {
                {scaleShowGridLines: true,
                scaleGridLineColor: 'red',
                scaleGridLineWidth: 1,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: true,
                bezierCurve: true,
                bezierCurveTension: 0.4,
                pointDot: true,
                pointDotRadius: 4,
                pointDotStrokeWidth: 1,
                pointHitDetectionRadius: 20,
                datasetStroke: true,
                datasetStrokeWidth: 2,
                datasetFill: true,
                legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>',}
              }
            />
        </div>
    )
}

export default Home
