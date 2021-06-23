import React, {useState, useEffect} from 'react';
import "./editProfile.css";
import BackgroundImg from "../commons/images/backgroundProfile.png";
import poza from "../commons/images/editProfileDefault.png";
import fb from "../commons/images/tw1.png";
import tw from "../commons/images/fb.png";
import { useForm } from 'react-hook-form';
import axios from "../axios/axios";
import Auth from "../Auth";
import Swal from 'sweetalert2'

const backgroundStyleProfile = {
    backgroundImage: `url(${BackgroundImg})`,
    marginTop:"4%",
    width: "100%",
    height: "91.5vh",
};


const EditProfile = () => {

    const { register, handleSubmit } = useForm();

    let [username, setUsername] = useState();
    let [description, setDescription] = useState();
    let [facebook, setFacebook] = useState();
    let [twitter, setTwitter] = useState();
    let [portfolio, setPortfolio] = useState();
    let [image, setImage] = useState(null);
    let address=localStorage.getItem("address");

    useEffect(()=>{
        axios.get("/user/" + address)
        .then((response) => {
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
    },[address])

    const onSubmit = (data) => {
         const formData = new FormData();
         formData.append("address", localStorage.getItem("address"));
         formData.append("image", data.image[0]);
         axios.post("/user/image", formData, {
             headers: {
                 'content-type': 'multipart/form-data'
             }
         })
         .then ((response) => {
             console.log(response.data);
             setImage(response.data.imageName);
         })

         
         let formEdit = {
            "address": address,
            "username": username,
            "description": description,
            "portfolio": portfolio,
            "facebook": facebook,
            "twitter": twitter
        }
         axios.put("/user", formEdit)
        .then ((response) => {
            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: 'Your profile has been updated!',
                showConfirmButton: false,
                timer: 1500
              })
        })
     }


     const changeHandler = (event) => {
        console.log(event.target.name);
        console.log(event.target.value);
        if (event.target.name === "username"){
            setUsername(event.target.value);
        }
        if (event.target.name === "description"){
            setDescription(event.target.value);
        }
        if (event.target.name === "facebook"){
            setFacebook(event.target.value);
        }
        if (event.target.name === "twitter"){
            setTwitter(event.target.value);
        }
        if (event.target.name === "portfolio"){
            setPortfolio(event.target.value);
        }
    }


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
        <div className="EditProfile" style={backgroundStyleProfile}>
            <div className="navbar">
                <Auth></Auth>   
            </div>
            <div className="EditLeftProfile">
                <p id="title">Edit profile</p>
                <p id="text">You can set preferred display name, create your branded profile URL and manage other personal settings</p>
                <div className="imgEditProfile">
                    {imageProfile}

                </div>
                <form className="formImg" onSubmit = {handleSubmit(onSubmit)}>
                    <input type = "file" name = "image" {...register("image")} />
                    <button type = "submit">Upload</button>
                </form>
            </div>
            <div className="EditRightProfile">
                <p id="username_lb">Display name</p>
                <input type="text" name="username" placeholder={username} value={username} onChange = {changeHandler}></input>
                <p id="portfolio_lb">Portfolio</p>
                <input type="text" name="portfolio" placeholder={portfolio} value={portfolio} onChange = {changeHandler}></input>
                <p id="description_lb2">Description</p>
                <input type="text" name="description" placeholder={description} value={description} onChange = {changeHandler}></input>
                <p id="facebook_lb">Facebook Account</p>
                <img id="img1" src={fb} alt="img"/>
                <input type="text" name="facebook" placeholder={facebook} value={facebook} onChange = {changeHandler}></input>
                <p id="twitter_lb">Twitter Account</p>
                <img id="img2" src={tw} alt="img"/>
                <input type="text" name="twitter" placeholder={twitter} value={twitter} onChange = {changeHandler}></input>
               
                
            </div>
        </div>
    );
};

export default EditProfile;