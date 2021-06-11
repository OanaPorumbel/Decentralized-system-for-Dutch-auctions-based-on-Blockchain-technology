import React from 'react';
import "./chart.css";
import { Line } from "react-chartjs-2"


function Chart ({ duration, maxPrice, minPrice })  {

    const x = []
    for (let i = 1; i <= 7; i++){
        x.push(Math.floor(duration / 420 * i) + " min")
    }
    
    const data={
        labels: x, //duration
        datasets:[
            {
                label: "Current price of auction",
                data:[15, 14, 13, 12], //price
                borderColor: ["#0D455C"]
            }
        ]
    };

    const options= {
        scales: {
            y: {
                min: minPrice, 
                max: maxPrice
            }
        }
    };

    return (
       <Line data={data} options={options}></Line>
    );
};

export default Chart;