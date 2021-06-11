import React from 'react';
import "./Home.css";
import img_circle_text from "../commons/images/circleText.png";
import logo from "../commons/images/logoAuctionGold.png";
import arrow from "../commons/images/arrow.png";
import banc from "../commons/images/banc2.png";
import back from "../commons/images/background.png";
import painting1 from "../commons/images/painting1.png";
import painting2 from "../commons/images/painting2.png";
import painting3 from "../commons/images/painting3.png";
import leaf from "../commons/images/leaf.png";
import vase from "../commons/images/vase.png";



const Home = () => {
    return (
        <div className="Home" >
           <a href="#description"> <button id="aboutus">About Us</button></a>
            <div id="logo">
                <img src={logo} alt="img"></img>
            </div>
            <img id="arrow" src={arrow} alt="img"></img> 
            <a href="./application"><button id="launchApp">Launch App</button></a>
            <div className="wrapper">
               <img src={banc} alt="img"></img>
            </div>
            <img id="text-circle" src={img_circle_text} class="rotate"  alt="img"/> 
            <div id="description">
              <img src={back} alt="img"/>
            </div>
            <img id="painting1" src={painting1} alt="img"/>
            <img id="painting2" src={painting2} alt="img"/>
            <img id="painting3" src={painting3} alt="img"/>
            <p id="title1">What is</p>
            <p id="title2">Auctigon?</p>
            <p id="text">Auctigon is an online marketplace connecting artists and collectors through Blockchain technology to easily sell, invest and own art and collectibles with complete transparency. Magnify your visibility, reach enthusiasts, and capture royalties.</p>
            <img id="leaf" src={leaf} alt="img"/>
            
        </div>
    );
};

export default Home;