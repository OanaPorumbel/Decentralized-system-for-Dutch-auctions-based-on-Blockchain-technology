import React, { useEffect, useState } from 'react';
import "./application.css";
import Web3 from "web3";
import axios from "../axios/axios";
import Auth from "../Auth";
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { abi, address } from "../auctionContract";
import { setNFT } from "../reducer/nftReducer";
import { abi as abiNFT, address as addressNFT }  from "../contract";
import rp from "request-promise";


const Application = (props) => {

    let web3 = new Web3(window.web3.currentProvider);
    let contract = new web3.eth.Contract(abi, address);
    let contractNFT = new web3.eth.Contract(abiNFT, addressNFT);

    let [auctions, setAuctions] = useState([]);
    const history = useHistory();

    const getAuctions = async () => {
        let numberAuctions = await contract.methods.auctionId().call();
        let auctions = [];
        for (let i = 0; i < numberAuctions; i++){
            const receipt = await contract.methods.getAuctionByAuctionId(i).call();
            console.log(await contract.methods.getAuctionByTokenId(receipt.tokenId).call());
            const { finished } = await contract.methods.getAuctionByTokenId(receipt.tokenId).call();
            let tokenId = receipt.tokenId;
            let ipfs = await contractNFT.methods.tokenURI(tokenId).call();
            let currentPrice = await contract.methods.getCurrentPriceByTokenId(tokenId).call();
            const {data: user} = await axios.get("/user/" + receipt.seller);
            let nft = await rp(ipfs).then( (html) => {
                let { description, title, image } = JSON.parse(html);
                return {
                  description,
                  title,
                  image,  
                }
              })
            auctions.push({
                "currentPrice": currentPrice,
                "duration": receipt.duration,
                "endingPrice": receipt.endingPrice,
                "startingPrice": receipt.startingPrice,
                "tokenId": receipt.tokenId,
                "seller": receipt.seller,
                "startedAt": receipt.startedAt,
                "finished": finished,
                "user": user,
                "nft": nft
            })
        }
        setAuctions(auctions);
    }


    useEffect( () => {
        getAuctions();

    }, [])

    const handleClickCard = (index) => {
        props.setNFT(auctions[index]);
        history.push(`/nftObject`);
    }

    return (
        <div className="Application" >
            <Auth></Auth>
            <div className="ContainerMarketplace">
                {auctions.map((item, index) => {
                        return(
                        <div key = {item.image} className="grid-box">
                            <div className="card">
                                <div className="imgCard" onClick={handleClickCard.bind(this, index)}>
                                    <div className="grid-img">
                                        <img src={item.nft.image} alt="alt"/>
                                    </div>
                                </div>
                                <div className="infoCard" onClick={handleClickCard.bind(this, index)} >
                                    <div className="title-name">
                                        <p id="title">{item.nft.title}</p>
                                        <p id="nickname">{item.user.username}</p>
                                    </div>
                                    <div className="description">
                                        <p>{item.nft.description}</p>
                                    </div>
                                    {!item.finished ?
                                    ((Number(item.startedAt)+Number(item.duration) - Date.now()/1000) < 0 ) ?
                                        <div className="price">
                                            <p id="finish">Auction Expired! </p>
                                        </div>:
                                        <div className="price">
                                            <p>Price: </p>
                                            <h4>{web3.utils.fromWei(item.currentPrice.toString(), "ether")} ETH</h4>
                                        </div>:
                                        <div className="price">
                                            <p id="finish" >Auction Closed! </p>
                                        </div>
                                    }      
                                </div> 
                            </div>
                        </div>    
                )})}
            </div>
        </div>
    
    );
};

const mapStateToProps = (state) => {
    return {
        address: state.web3.address,
        network: state.web3.network,
        user: state.user.user,
        nft: state.nft.nft,
    }
}

const mapDispatchToProps = {
    setNFT
}

export default connect(mapStateToProps, mapDispatchToProps)(Application);