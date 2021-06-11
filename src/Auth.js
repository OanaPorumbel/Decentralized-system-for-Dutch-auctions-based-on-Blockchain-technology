import axios from "./axios/axios";
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import "./application/application.css";
import ReactRoundedImage from "react-rounded-image";
import profileDefault from "./commons/images/profileDefault.png";
import { NavLink } from 'react-router-dom';
import { setUser } from "./reducer/userReducer";
import { connect } from "react-redux";

const Auth = (props) => {

    let [web3, setWeb3] = useState();
    const account = localStorage.getItem("account");
    let [image, setImage] = useState();
    const address = localStorage.getItem("address");
    console.log(props.user);


    useEffect( async (props) => {
        let web3;
        if (typeof Web3 !== "undefined"){
            web3 = new Web3(window.web3.currentProvider);
        }
        setWeb3(web3);

        axios.get("/user/" + address)
        .then((response) => {
            setImage(response.data.image);
        }).catch (error => {
            console.log(error);
        });
        
    }, [address])



    const clickHandler = () => {
        axios.post("/user", {
            "address": account
        })
        .then ( async (response) => {
            if (response.status === 200){
                const message = response.data.message;
                const signature = await sign(message);
                checkSignature(signature);
            }
            else{
                console.log("NU A MERS");
            }
        })
    }
    const sign = async (message) => {
        try{
            let signature = await web3.eth.personal.sign(message, account, "");
            return signature;
        }
        catch(error){
            console.log(error);
            return null;
        }
    }
    const checkSignature = (signature) => {
        
        axios.post("/login", {
            "signature": signature,
            "address": account
        })
        .then ( (response) => {
            alert("You have succesfully logged in!");
            const token = response.data.token;
            localStorage.setItem("token", token);
            localStorage.setItem("user", "user");
            props.setUser("user1");
        })
    }

    let imageProfile=profileDefault;
    let imageP = "http://localhost:8080/static/" + image;
    if (image)
    {
        imageProfile= imageP;
    }

    let content="";
    if(!props.user){
        content=(
                <button id="btnConnect" onClick = {clickHandler}>Connect to Metamask</button>
        );
    }

    else {
        content=(
            <div className="navbarLogged">
                <div className="seeEditProfile">
                    <button><NavLink style={{color: '#dab679', textDecoration: 'none'}} to="/editprofile">Edit</NavLink></button>
                    <NavLink to={`/profile/${address}`}>
                        <ReactRoundedImage
                        image={imageProfile}
                        roundedColor="#042a3d"
                        imageWidth="40"
                        imageHeight="40"
                        roundedSize="0"
                        borderRadius="85"
                    /></NavLink>
                </div>
                <div className="btnCreateNft">
                    <button><NavLink style={{color: '#dab679', textDecoration: 'none'}} to="/createNft">Create</NavLink></button>
                </div>
                <div className="btnCollection">
                    <button><NavLink style={{color: '#dab679', textDecoration: 'none'}} to="/collection">MyCollection</NavLink></button>
                </div>
                <div className="btnExplore">
                    <button><NavLink style={{color: '#dab679', textDecoration: 'none'}} to="/application">Explore</NavLink></button>
                </div>
            </div>
        );
    }
    return (
        <div className="navbar">
           {content}
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
    }
}

const mapDispatchToProps = {
    setUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);