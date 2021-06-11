import React, {useEffect, useState} from 'react';
import "./profile.css";
import BackgroundImg from "../commons/images/backgroundProfile.png";
import copy from "../commons/images/copy.png";
import poza from "../commons/images/editProfileDefault.png";
import designItem from "../commons/images/designProfile.png";
import fb from "../commons/images/tw1.png";
import tw from "../commons/images/fb.png";
import axios from "../axios/axios";
import Auth from "../Auth";
import Web3 from 'web3';
import { abi, address } from "../contract";
import rp from "request-promise";
import { connect } from 'react-redux';
import { useLocation } from 'react-router-dom';

const backgroundStyleProfile = {
    backgroundImage: `url(${BackgroundImg})`,
    marginTop:"4%",
    width: "100%",
    height: "91.5vh",
};



const Profile = () => {

    let [username, setUsername] = useState();
    let [description, setDescription] = useState();
    let [facebook, setFacebook] = useState();
    let [twitter, setTwitter] = useState();
    let [portfolio, setPortfolio] = useState();
    let [image, setImage] = useState();
    let [nfts, setNfts]=useState([]);
    let web3 = new Web3(window.web3.currentProvider);
    let contract = new web3.eth.Contract(abi, address);
    
    const location = useLocation();
    const addressAccount = location.pathname.split("/")[location.pathname.split("/").length - 1];      


    const copyHandler = () => {
        navigator.clipboard.writeText(addressAccount);
    }

    
    useEffect(()=>{
        console.log("object");
        axios.get("/user/" + addressAccount)
        .then((response) => {
            console.log("hei");
            setUsername(response.data.username);
            setDescription(response.data.description);
            setPortfolio(response.data.portfolio);
            setFacebook(response.data.facebook);
            setTwitter(response.data.twitter);
            setImage(response.data.image);
            console.log(response);
        }).catch (error => {
            console.log(error);
        });
        axios.get("/nfts/" + addressAccount)
            .then ( async (response) => {
                 let tokens = response.data.tokenIds;
                 const ipfss = await Promise.all(tokens.map( async (item) => {
                 let ipfs = await contract.methods.tokenURI(item).call();
                 let ownerAddress= await contract.methods.ownerOf(item).call();
                  return {
                      "owner": ownerAddress,
                      "ipfs": ipfs,
                      "tokenId": item,
                  };
                  
                
              }));
                let nftsDetails = await Promise.all(ipfss.map(({ ipfs, tokenId, owner }) => {
                let obj = rp(ipfs).then( (html) => {
                  let { description, title, image } = JSON.parse(html);
                  return {
                    description,
                    title,
                    image,  
                    tokenId,
                    owner
                  }
                })
                console.log(obj);
                return obj;
              }))
              console.log(nftsDetails);
              setNfts(nftsDetails);
       }) 
    },[address])


    let imageP = (
                 <div>
                     <img src = {"http://localhost:8080/static/" + image} alt="img"/>
                 </div>
             )
    let imageProfile=(
        <div>
            <img src={poza} alt="img"/>
        </div>
    )
    if (image)
    {
       imageProfile= imageP;
    }     


    return (
        <div className="Profile">
            <div className="navbar">
                <Auth></Auth>   
            </div>
            <div className="topProfile" style={backgroundStyleProfile}>
                <div className="LeftProfile">
                    <p id="name">{username}</p>
                    <div className="addCopy">
                        <p id="address">{address}</p>
                        <img src={copy} onClick={copyHandler} alt="img"/>
                    </div>
                    <img src={designItem} alt="img"/>
                </div>
                <div className="imgProfile">
                    {imageProfile}
                </div>
                <div className="RightProfile">
                    <p id="portfolio_lb">Portfolio</p>
                    <p id="portfolio_txt"><a href={`${portfolio}`}>{portfolio}</a></p>
                    <p id="description_label">Description</p>
                    <p id="description_txt">{description}</p>
                    <div className="s">
                        <img id="img1" src={fb} onClick={()=> window.open(`${twitter}`, "_blank")} alt="img"/>
                        <img id="img2" src={tw} onClick={()=> window.open(`${facebook}`, "_blank")} alt="img"/>
                    </div> 
                </div>
            </div>
            {addressAccount !== localStorage.getItem("address")?
            <div className="profileCollection">
                <h1>Collection</h1>
                <div className="ContainerCollection">
                {nfts.map((item, index) => {
                        return(
                        <div
                        key = {item.image} 
                        className="grid-box">
                            <div className="card">
                                <div className="imgCard" >
                                    <div className="grid-img">
                                        <img src={item.image} alt="alt"/>
                                    </div>
                                </div>
                                <div className="infoCard" > 
                                    <div className="title-name">
                                        <p id="title">{item.title}</p>
                                    </div>
                                    <div className="description">
                                        <p>{item.description}</p>
                                    </div>
                                </div> 
                            </div>
                        </div>    
                )})}
                </div>
            </div>
            : null}
        </div>
    );
};

export default Profile;