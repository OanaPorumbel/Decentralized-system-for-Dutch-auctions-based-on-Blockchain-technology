import React, { useState} from 'react';
import Auth from "../Auth";
import "./createNft.css";
import { useForm } from 'react-hook-form';
import axios from '../axios/axios';
import check from "../commons/images/check.png";
import checkColor from "../commons/images/checkColor.png";
import circles from "../commons/images/circlesNft.png";
import Web3 from 'web3';
import Swal from 'sweetalert2'
import { abi,  address } from "../contract";

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }

const CreateNft = () => {


    const { register, handleSubmit } = useForm();

    let [imgIpfs, setImgIpfs]=useState();
    let [title, setTitle]=useState();
    let [description, setDescription]=useState();
    let [jsonIpfs, setJsonIpfs]=useState();
    let [checked, setChecked]=useState(false);

    let web3 = new Web3(window.web3.currentProvider);
    let contract = new web3.eth.Contract(abi, address);

    const onSubmit = (data) => {
        console.log(data.image[0]);
        let formData = new FormData();
        formData.append("image", data.image[0]);
        axios.post("/nfts", formData, {
            headers: {
                "content-type": "multipart/form-data"
            }
        }).then ( (response) => {
            let pathIpfs= "https://ipfs.io/ipfs/" + response.data.hash;
            setImgIpfs(pathIpfs);
            setChecked(true);
            Swal.fire({
                icon: 'info',
                title: 'Your image has been uploaded on IPFS!',
                html: `<p id="ceva">You can view your image here: </p><p>${pathIpfs}</p>`,
                showConfirmButton: false,
                customClass: {  
                    icon: 'iconClass',
                    htmlContainer: 'htmlClass',
                    
                  }
              })
        })
    }

    const clickHandler = async () => {
        console.log(title);
        console.log(description);
        console.log(imgIpfs);
        let pathJsonIpfs;
        let formNftJson = {
            "image": imgIpfs,
            "title": title,
            "description": description,
        }
        axios.post("/nfts/json", formNftJson)
        .then ( async (response) => {
            console.log(response.data.hash);
            pathJsonIpfs= "https://ipfs.io/ipfs/" + response.data.hash;
            let tokenId=getRandomInt(0, 1000000000000000);
            console.log(await web3);
            const receipt = await contract.methods.mint(localStorage.getItem("address"), tokenId, pathJsonIpfs).send({from: localStorage.getItem("address")});
            console.log(receipt);
            let formNftToken = {
                "address": localStorage.getItem("address"),
                "tokenId": tokenId
            }
            axios.post("/nfts/mintNft", formNftToken)
            .then ( async (response) => {
                console.log(response.data);  
                Swal.fire({
                    icon: 'success',
                    title: 'Your NFT has been created!',
                    html: `<p>Block Number: ${receipt.blockNumber} </p><p>Gas Consumed: ${receipt.cumulativeGasUsed}</p><p>Block Hash: ${receipt.blockHash}</p>`,
                    showConfirmButton: false,
                    customClass: {  
                        icon: 'iconClass',
                        htmlContainer: 'htmlClass',
                        
                      }
                  })
            })
            setJsonIpfs(pathJsonIpfs);
        })
        
    }

    const changeHandler = (event) => {
        if (event.target.name === "title"){
            setTitle(event.target.value);
        }
        if (event.target.name === "description"){
            setDescription(event.target.value);
        }
    }

    let imgcheck=check;
    if(checked===true)
    {
        imgcheck=checkColor;
    }
    else{
        imgcheck=check;
    }

    return (
        <div className="createNft">
            <Auth></Auth>
            <div className="leftNftCreate">
            <div class="blob">
                <svg  version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 350">
                    <path d="M156.4,339.5c31.8-2.5,59.4-26.8,80.2-48.5c28.3-29.5,40.5-47,56.1-85.1c14-34.3,20.7-75.6,2.3-111  c-18.1-34.8-55.7-58-90.4-72.3c-11.7-4.8-24.1-8.8-36.8-11.5l-0.9-0.9l-0.6,0.6c-27.7-5.8-56.6-6-82.4,3c-38.8,13.6-64,48.8-66.8,90.3c-3,43.9,17.8,88.3,33.7,128.8c5.3,13.5,10.4,27.1,14.9,40.9C77.5,309.9,111,343,156.4,339.5z"/>
                </svg>
            </div>
            <h2>Create single collectible</h2>
            <p id="upload_lb">Upload file</p>
               <form className="uploadDiv" onSubmit = {handleSubmit(onSubmit)}>
                    <button type="submit"><img src={imgcheck} alt="img"/></button> 
                    <p>Upload file to create your brand new NFT</p>
                    <input type="file" class="custom-file-input" name="image" {...register("image")}/>
                </form>
                <p id="title_lb">Title</p>
                <input type="text" name="title" onChange={changeHandler}></input>
                <p id="description_lb">Description</p>
                <input type="text" name="description" onChange={changeHandler}></input>
                <button onClick={clickHandler}>Create item</button>
            </div>
            <div id="circle">
                <img  src={circles} alt="img"/>
            </div>
        </div>
       
    );
};

export default CreateNft;