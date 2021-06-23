import React, { useEffect, useState } from 'react';
import Auth from "../Auth";
import "./nftObject.css";
import axios from '../axios/axios';
import imgNft from "../commons/images/arrownft.png";
import ReactRoundedImage from "react-rounded-image";
import imgEth from "../commons/images/eth.png";
import blob from "../commons/images/blob.svg";
import { connect } from 'react-redux';
import { abi, address } from "../auctionContract";
import { abi as abiNFT, address as addressNFT } from "../contract";
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';
import Swal from 'sweetalert2'
import upscale from "../commons/images/upscale.png"
import Chart from '../chart/chart';
import Timer from './timer';

const NftObject = ({nft}) => {

    let web3 = new Web3(window.web3.currentProvider);
    let contract = new web3.eth.Contract(abi, address);
    let contractNFT = new web3.eth.Contract(abiNFT, addressNFT);

    const history=useHistory();

    let [currentPrice, setCurrentPrice] = useState(nft.currentPrice);
    let [owner, setOwner] = useState();
    let [ownerAdd, setOwnerAdd] = useState();
    let [blockNFT, setBlockNFT] = useState();
    let [seePriceHistory, setSeePriceHistory] = useState(true);
    let [listHistory, setListHistory] = useState([]);


    let finishTime = Number(nft.startedAt) + Number(nft.duration);
    let pollingInterval;

    const convertDate = (date) => {
        let stringDate = new Date(date * 1000).toString().split(" ").reduce((acc, item, index) => (index < 5 ? acc + " " + item : acc), "");
        return stringDate;
    }


    const polling = () => {
        pollingInterval = setInterval( async () => {
            let currentPriceAux = await contract.methods.getCurrentPriceByTokenId(nft.tokenId).call()
            setCurrentPrice(currentPriceAux)
        }, 1000)
    }

    const handleBuy = async () => {
        console.log(localStorage.getItem("address"));
        const receipt = await contract.methods.bid(nft.tokenId).send({ from: localStorage.getItem("address"), value: currentPrice});
        console.log(receipt);
        console.log(await contractNFT.methods.ownerOf(nft.tokenId).call())
        axios.delete(`/nfts/deleteNft/${nft.seller}/${nft.tokenId}`)
        .then ( async (response) => {
                if(response.status===200){
                    let formNftToken = {
                        "address": localStorage.getItem("address"),
                        "tokenId": nft.tokenId
                    }
                    axios.post("/nfts/mintNft", formNftToken)
                    .then ( async (response) => {
                        if (response.status === 201){
                            console.log("S-a creat");
                            Swal.fire({
                                title: 'Congratulation!',
                                icon: 'success',
                                title: 'The NFT has been bought!',
                                showConfirmButton: false,
                                html: `<p>Gas Consumed: ${receipt.cumulativeGasUsed}</p><p>IPFS address: ${nft.nft.image}</p>`,
                                customClass: {  
                                        htmlContainer: 'htmlClass',     
                                        }
                              })
                        }
                    });
                }
        });   
    }

    useEffect( async() => {
        let addressOwner= await contractNFT.methods.ownerOf(nft.tokenId).call();
        let event = await contract.events;
        //console.log(event);
        setOwnerAdd(addressOwner);
        axios.get("/user/" + addressOwner)
        .then((response) => {
            setOwner(response.data.username);
        }).catch (error => {
            console.log(error);
        });
        if (nft.finished === false){
            polling()
            return function cleanup() {
                clearInterval(pollingInterval)
            }
        }
    })
    

    const getTransactions = async () => {
        let list=[];
        contractNFT.getPastEvents('Mint', {fromBlock: 0, toBlock: 'latest'}, function(error, events) {
            let mintEvents = events.filter( (event) => event.returnValues.tokenId === nft.tokenId)
            console.log(mintEvents);
            setBlockNFT(mintEvents[0].blockNumber);
            list.push({
                "nameEvent": "Created",
                "transactionHash": mintEvents[0].transactionHash,
                "price": null,
                "soldTo": null
            })
        })

        
        contract.getPastEvents('allEvents', {fromBlock: 0, toBlock: 'latest'}, function(error, events) {
            let auctionEvent = events.filter( (event) => event.returnValues.tokenId === nft.tokenId)
            console.log(auctionEvent);
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

    

    useEffect( () => {
        getTransactions()
    }, [])
    

    const openprofile = () =>{
        history.push(`/profile/${nft.seller}`);
    }
    
    const handleScaleImage = () => {
        console.log(nft.nft.image);
        window.open(nft.nft.image);
    }

    const openProfileBuyer = () => {
        history.push(`/profile/${ownerAdd}`)
    }

    const seePHistoryHandler = () => {
        setSeePriceHistory(true);
    }
    const seeTHistoryHandler = () => {
        setSeePriceHistory(false);
    }
    const goToProfile = (e) => {
        console.log(e.split(" ")[1]);
        history.push(`/profile/${e.split(" ")[1]}`)
    }

    let contentHistory=(
        <div className="chart">
            <Chart duration = {nft.duration} maxPrice={web3.utils.fromWei(nft.startingPrice.toString(), "ether") | 0 } minPrice={web3.utils.fromWei(nft.endingPrice.toString(), "ether") | 0 }/>
        </div>
    );

    if(seePriceHistory===false){
         contentHistory=(<div className="chart">
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
        </div>);
    }
    else if(seePriceHistory===true){
        contentHistory=(
            <div className="chart">
                <Chart duration = {nft.duration} maxPrice={web3.utils.fromWei(nft.startingPrice.toString(), "ether") | 0 } minPrice={web3.utils.fromWei(nft.endingPrice.toString(), "ether") | 0 }/>
            </div>
        );
    }

    const name = (params) => {
        
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
                            <img src={nft.nft.image} alt="alt"/>
                        </div>
                        <div className="upscale"> 
                            <img src={upscale} onClick={handleScaleImage}/>
                        </div>
                        <div className="arrow">
                            <img src={imgNft} alt="alt"/>      
                        </div>
                    </div>
                    <div className="topDetails">
                        <h1>{nft.nft.title}</h1>
                        <div className="creator">
                            <div className="imgCreator" onClick={openprofile.bind(this, nft.seller)}>
                                <ReactRoundedImage
                                    image={`http://localhost:8080/static/${nft.user.image}`}
                                    roundedColor="#dab679"
                                    imageWidth="60"
                                    imageHeight="60"
                                    roundedSize="2"
                                    borderRadius="85"
                                />
                            </div>
                            <div className="detailsCreator">
                                <h3 id="owner">Owned by:</h3>
                                <h3>{nft.user.username}</h3>
                            </div>

                            <div className="startTime">  
                                <p>{convertDate(nft.startedAt)}</p>
                                <p id="price">Start price: {web3.utils.fromWei(nft.startingPrice.toString(), "ether")} ETH</p>
                            </div> 
                            
                        </div>
                        {!nft.finished ? <div className="startDetails">
                            <Timer finishTime = {finishTime}/> </div>: null}
                        
                        {!nft.finished ? <div className="status">
                                <h3>Listing price:</h3>
                                <div className="price">
                                    <div className="eth">
                                        <img src={imgEth} alt="eth"/>
                                    </div>
                                    <p>{web3.utils.fromWei(currentPrice.toString(), "ether")} ETH</p>
                                </div>
                            </div> : null}
                        
                        {((!nft.finished)) ?
                        (nft.seller.toString().toLowerCase() !== localStorage.getItem("address").toString().toLowerCase())? 
                            <div className="buy">
                                <button onClick = {handleBuy}>Buy</button>
                            </div> : null
                        : 
                        <div className = "bought">
                            <div id="finished">
                                <p>Auction completed!</p>
                            </div>
                            <div id="soldTo" onClick={openProfileBuyer}>
                                <p>Sold to {owner}</p> 
                                <p style={{fontSize:"0.9vw", color:"lightgrey"}}> {ownerAdd} </p>
                            </div>
                        </div>
                        }     
                    </div>
                    
                </div>
                <div className="down">
                    <div className="leftDown">
                        <div className="description">
                            <h1>Description</h1>
                            <p>{nft.nft.description} </p>
                        </div>
                        <div className="details">
                            <h1>Details</h1>
                            <div className="det">
                                <div className="contractAddress">
                                    <h4>Contract Address</h4>
                                    <p>{address.substring(0, 10) + "..." + address.substring(address.length - 6, address.length)}</p>
                                </div>
                                <div className="token">
                                    <h4>Token Id</h4>
                                    <p>{nft.tokenId}</p>
                                </div>
                                <div className="blockchain">
                                    <h4>NFT Block</h4>
                                    <p>{blockNFT}</p>
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
                            <button className="btnPH" onClick={seePHistoryHandler}>Price History</button>
                            <button className="btnTH" onClick={seeTHistoryHandler}>Trade History</button>
                        </div>
                        <img src={blob} alt="svg"/> 
                        {contentHistory}
                        
                    </div>
                </div>
            </div>     
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        nft: state.nft.nft
    }
}

 export default connect(mapStateToProps, null)(NftObject);