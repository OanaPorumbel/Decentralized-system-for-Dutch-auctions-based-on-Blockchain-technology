import React, {useEffect, useState} from 'react';
import Auth from "../Auth";
import "./collection.css";
import "../application/application.css";
import { useHistory } from 'react-router-dom';
import axios from '../axios/axios';
import Web3 from 'web3';
import { abi, address } from "../contract";
import rp from "request-promise";
import { connect } from 'react-redux';
import ModalSell from "../modalSell/modalSell";
import { setNFT } from "../reducer/nftReducer";

const Collection = (props) => {

    const history=useHistory();
    let addressAccount=localStorage.getItem("address");
    let [nfts, setNfts]=useState([]);
    let web3 = new Web3(window.web3.currentProvider);
    let contract = new web3.eth.Contract(abi, address);
    let [showSellModal, setShowSellModal] = useState(false);
    let [tokenId, setTokenId] = useState();
    let [image, setImage] = useState();

    const showModal = (image, tokenId) => {
        setImage(image);
        setTokenId(tokenId);
        setShowSellModal(true);
     }
    
     const hideModal = () => {
        setShowSellModal(false);
     }

    useEffect( async () => {
      axios.get("/nfts/" + addressAccount)
            .then ( async (response) => {
                 let tokens = response.data.tokenIds;
                 const ipfss = await Promise.all(tokens.map( async (item) => {
                 let ipfs = await contract.methods.tokenURI(item).call();
                 let ownerAddress= await contract.methods.ownerOf(item).call();
                 console.log(ownerAddress)
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
    },[])


    const handleClickCard = (index) => {
        props.setNFT(nfts[index]);
        history.push(`/nftTokenObject`);
    }

    return (
        <div  className="Collection" >
            <div className="navbar">
                <Auth></Auth>   
            </div>
            <div className="ContainerCollection">
                {nfts.map((item, index) => {
                        return(
                        <div
                        key = {item.image} 
                        className="grid-box">
                            <div className="card">
                                <div className="imgCard" onClick={handleClickCard.bind(this, index)}>
                                    <div className="grid-img">
                                        <img src={item.image} alt="alt"/>
                                    </div>
                                </div>
                                <div className="infoCard" onClick={handleClickCard.bind(this, index)}> 
                                    <div className="title-name">
                                        <p id="title">{item.title}</p>
                                    </div>
                                    <div className="description">
                                        <p>{item.description}</p>
                                    </div>
                                </div> 
                                <button onClick={showModal.bind(this, item.image, item.tokenId)}>Put on Market</button>
                            </div>
                        </div>    
                )})}
            </div>
            <ModalSell showSellModal={showSellModal} image={image} tokenId = {tokenId} handleClose={hideModal} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Collection);