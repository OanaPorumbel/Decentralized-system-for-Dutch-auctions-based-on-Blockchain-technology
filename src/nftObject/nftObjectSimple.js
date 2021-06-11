import React, { useEffect, useState } from 'react';
import Auth from "../Auth";
import "./nftObject.css";
import axios from '../axios/axios';
import imgNft from "../commons/images/arrownft.png";
import ReactRoundedImage from "react-rounded-image";
import blob from "../commons/images/blob.svg";
import { connect } from 'react-redux';
import { address as addressNFT } from "../contract";
import ModalSell from "../modalSell/modalSell";
import upscale from "../commons/images/upscale.png"

const NftObjectSimple = ({nft}) => {

    let [username, setUsername] = useState();
    let [userImage, setUserImage] = useState();
    let [showSellModal, setShowSellModal] = useState(false);

    const showModal = () => {
        setShowSellModal(true);
     }
    
     const hideModal = () => {
        setShowSellModal(false);
     }
    
    useEffect( () => {
        axios.get("/user/" + nft.owner)
        .then((response) => {
            setUsername(response.data.username);
            setUserImage(response.data.image);
        }).catch (error => {
            console.log(error);
        });
        
    }, [nft.owner])
    

    console.log(nft);
    const handleScaleImage = () => {
        window.open(nft.image);
    }
    
    return (
        <div className="nftObject">
            <div className="navbar">
                <Auth></Auth>   
            </div>
            <div className="containerFluid">
                <div className="top">
                    <div className="topImage">
                        <div className="grid-img">
                            <img src={nft.image} alt="alt"/>
                        </div>
                        <div className="upscale"> 
                            <img src={upscale} onClick={handleScaleImage}/>
                        </div>
                        <div className="arrow">
                            <img src={imgNft} alt="alt"/>
                        </div>
                    </div>
                    <div className="topDetails">
                        <h1>{nft.title}</h1>
                        <div className="creator">
                            <div className="imgCreator">
                                <ReactRoundedImage
                                    image={`http://localhost:8080/static/${userImage}`}
                                    roundedColor="#dab679"
                                    imageWidth="60"
                                    imageHeight="60"
                                    roundedSize="2"
                                    borderRadius="85"
                                />
                            </div>
                            <div className="detailsCreator">
                                <h3 id="owner">Owned by:</h3>
                                <h3>{username}</h3>
                            </div>
                        </div>
                        {(nft.owner.toString().toLowerCase() === localStorage.getItem("address").toString().toLowerCase())? 
                            <div className="putOnMarket">
                                <button onClick={showModal}>Put on Market</button>
                            </div> : null
                            }
                    </div>
                    
                </div>
                <div className="down">
                    <div className="leftDown">
                        <div className="description">
                            <h1>Description</h1>
                            <p>{nft.description}</p>
                        </div>
                        <div className="details">
                            <h1>Details</h1>
                            <div className="det">
                                <div className="contractAddress">
                                    <h4>Contract Address</h4>
                                    <p>{addressNFT.substring(0, 10) + "..." + addressNFT.substring(addressNFT.length - 6, addressNFT.length)}</p>
                                </div>
                                <div className="token">
                                    <h4>Token Id</h4>
                                    <p>{nft.tokenId}</p>
                                </div>
                                <div className="blockchain">
                                    <h4>Blockchain</h4>
                                    <p>Ethereum</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="rightDown">
                        <img src={blob} alt="svg"/>
                    </div>
                </div>
            </div>  
            <ModalSell showSellModal={showSellModal} image={nft.image} tokenId = {nft.tokenId} handleClose={hideModal} />   
        </div>
    );
};
const mapStateToProps = (state) => {
    return {
        "nft": state.nft.nft
    }
}

 export default connect(mapStateToProps, null)(NftObjectSimple);