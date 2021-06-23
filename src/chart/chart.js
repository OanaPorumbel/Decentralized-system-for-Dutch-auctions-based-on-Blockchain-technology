import React, { useEffect, useState } from 'react';
import "./chart.css";
import { Line } from "react-chartjs-2"
import { connect } from 'react-redux';


function Chart ({ duration, maxPrice, minPrice, timer })  {

    const x = []
    const timeElapsed = duration - timer;

    let [yAxis, setYAxis] = useState([])
    const calculateY = () => {
        let i = 0;
        let y = []
        let tick = duration / 7
        while (tick * i <= timeElapsed){
            let pointY = tick * i * (minPrice - maxPrice) / duration + maxPrice
            y.push(pointY)
            i += 1
        }
        return y;
    }
    for (let i = 0; i <= 7; i++){
        x.push(Math.floor(duration / 396 * i) + " min")
    }

    useEffect( () => {
        setYAxis(calculateY())
    }, [timer])

    
    const data={
        labels: x, 
        datasets:[
            {
                label: "Current price of auction",
                data: yAxis, 
                borderColor: ["#0d465cc5"]
            }
        ]
    };

    const options= {
        scales: {
            y: {
                min: minPrice, 
                max: maxPrice
            }
        },
        animation: {
            duration: 0
        }
    };

    return (
       <Line data={data} options={options}></Line>
    );
};

const mapStateToProps = (state) => {
    return {     
        timer: state.timer.timer
    }
}

export default connect(mapStateToProps, null)(Chart);