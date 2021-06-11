import React, {useState} from 'react';
import "./modalSell.css";
import { abi, address } from "../auctionContract";
import { abi as abiNFT, address as addressNFT } from "../contract";
import Web3 from 'web3';
import Swal from 'sweetalert2'
import imgAlert from "../commons/images/modalAuctionimage.png";

const ModalSell = ({ handleClose, showSellModal, children, image, tokenId }) => {

    let modal="";

    let web3 = new Web3(window.web3.currentProvider);
    let contract = new web3.eth.Contract(abi, address);
    let contractNFT = new web3.eth.Contract(abiNFT, addressNFT);
    let logged = localStorage.getItem("address");

    if(showSellModal===true)
    {
       modal="ModalSell";
    }

    console.log(tokenId);

    let [startPrice, setStartPrice] = useState(0);
    let [endPrice, setEndPrice] = useState(0);
    let [duration, setDuration] = useState(0);



    const changeHandler = (event) => {
        switch(event.target.name){
            case "startPrice":
                setStartPrice(event.target.value);
                break;
            case "minimumPrice":
                setEndPrice(event.target.value);
                break;
            case "expirationDate":
                setDuration(event.target.value);
                break;
            default:
                break;                
        }
    }

    const handleSubmit = async () => {

        const receipt = await contract.methods.createAuction(tokenId, web3.utils.toWei(startPrice.toString(), "ether"), web3.utils.toWei(endPrice.toString(), "ether"), (duration*3600)).send({ from: logged});
        //const receipt = await contract.methods.createAuction(tokenId, startPrice, endPrice, duration).send({ from: logged});
        await contractNFT.methods.approve(contract.options.address, tokenId).send({ from: localStorage.getItem("address") })
        console.log(receipt);
        console.log(receipt.events.AuctionCreated.returnValues);
        Swal.fire({
            text: 'Auction created succesfully!',
            imageUrl: imgAlert,
            imageWidth: 100,
            imageHeight: 100,
            imageAlt: 'Custom image',
          })
    }

    return (
        <div className={modal}>    
        {
            showSellModal?
            <section className="ModalMainSell">
                <div className="leftSell">
                <button type="button" id="backbtn" onClick={handleClose}>Back</button>
                <div className="imgNFT">
                    <div className="grid-imgNFT">
                        <img src={image} alt="alt"/>
                    </div>
                </div>
                </div>
                <div className="rightSell">
                    <form id="form-sell" >
                        <label for="startPrice">Start price</label>
                        <input type="text" id="startPriceI" name="startPrice" onChange = {changeHandler}></input>
                        <label for="minimumPrice">Minimum price</label>
                        <input type="text" id="minimumPriceI" name="minimumPrice" onChange = {changeHandler}></input>
                        <label for="expirationDate">Expiration date</label>
                        <input type="text" id="expirationDateI" name="expirationDate" onChange = {changeHandler}></input>
                    </form>
                        <button id="sellbtn" onClick = {handleSubmit}>Put on market</button>

                </div>
            </section>
            :
            null
        }      
        </div>
    );
};

export default ModalSell;