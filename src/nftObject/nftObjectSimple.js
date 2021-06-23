import React, { useEffect, useState } from 'react';
import Auth from "../Auth";
import "./nftObject.css";
import axios from '../axios/axios';
import imgNft from "../commons/images/arrownft.png";
import ReactRoundedImage from "react-rounded-image";
import blob from "../commons/images/blob.svg";
import { connect } from 'react-redux';
import ModalSell from "../modalSell/modalSell";
import upscale from "../commons/images/upscale.png"
import { abi, address } from "../auctionContract";
import { abi as abiNFT, address as addressNFT } from "../contract";
import Web3 from 'web3';
import { useHistory } from 'react-router-dom';


const NftObjectSimple = ({nft}) => {

    let web3 = new Web3(window.web3.currentProvider);
    let contract = new web3.eth.Contract(abi, address);
    let contractNFT = new web3.eth.Contract(abiNFT, addressNFT);
    const history=useHistory();
    let [username, setUsername] = useState();
    let [userImage, setUserImage] = useState();
    let [showSellModal, setShowSellModal] = useState(false);
    let [blockNFT, setBlockNFT] = useState();
    let [listHistory, setListHistory] = useState([]);

    const showModal = () => {
        setShowSellModal(true);
     }
    
     const hideModal = () => {
        setShowSellModal(false);
     }

     console.log("HEI");
    
    
    useEffect( () => {
        axios.get("/user/" + nft.owner)
        .then((response) => {
            setUsername(response.data.username);
            setUserImage(response.data.image);
        }).catch (error => {
            console.log(error);
        });

        getTransactions()
        
    }, [nft.owner])

    const getTransactions = async () => {
        let list=[];
        await contractNFT.getPastEvents('Mint', {fromBlock: 0, toBlock: 'latest'}, function(error, events) {
            let mintEvents = events.filter( (event) => event.returnValues.tokenId === nft.tokenId)
            setBlockNFT(mintEvents[0].blockNumber);
            list.push({
                "nameEvent": "Created",
                "transactionHash": mintEvents[0].transactionHash,
                "price": null,
                "soldTo": null
            })
        })
        
        await contract.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'}, function(error, events) {
            let auctionEvent = events.filter( (event) => event.returnValues.tokenId === nft.tokenId)
            for(let i=0; i<auctionEvent.length;i++){
                if(auctionEvent[i].event==="AuctionCreated"){
                    list.push({
                        "nameEvent": "Listed",
                        "transactionHash": auctionEvent[i].transactionHash,
                        "price": parseFloat(web3.utils.fromWei(auctionEvent[i].returnValues.startPrice.toString(), "ether")).toFixed(2) + " ETH",
                        "soldTo": null
                    })   
                }
                if(auctionEvent[i].event==="AuctionSuccessful"){
                    list.push({
                        "nameEvent": "Sold",
                        "transactionHash": auctionEvent[i].transactionHash,
                        "price": parseFloat(web3.utils.fromWei(auctionEvent[i].returnValues.totalPrice.toString(), "ether")).toFixed(2) + " ETH",
                        "soldTo":  "to " + auctionEvent[i].returnValues.winner
                    })   
                }
                
            }
            
        })
        setListHistory(list)
        console.log(list);

    }

    const goToProfile = (e) => {
        console.log(e.split(" ")[1]);
        history.push(`/profile/${e.split(" ")[1]}`)
    }

   
    
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
                       
                        <div className="buttons">
                            <button className="btnTH" >Trade History</button>
                        </div>
                        <img src={blob} alt="svg"/>
                        <div className="chart">
                            <ul>
                                {listHistory.map(item => (
                                <div id="li"> 
                                <div id="left">
                                    <h1>{item.nameEvent}</h1>
                                    <p onClick={goToProfile.bind(this, item.soldTo)}> {item.soldTo}</p>
                                </div>
                                <p>{item.price}</p>
                                </div>
                                ))}
                            </ul>
                        </div>
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