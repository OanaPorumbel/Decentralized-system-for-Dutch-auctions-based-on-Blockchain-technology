import React, { useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch, useHistory} from 'react-router-dom'
import Home from "./home/Home";
import Application from "./application/application";
import Profile from "./profile/profile";
import EditProfile from "./editProfile/editProfile";
import CreateNft from "./createNft/createNft";
import Collection from "./collection/collection";
import NFTObject from "./nftObject/nftObject";
import NFTObjectSimple from "./nftObject/nftObjectSimple";
import { changeAddress, changeNetwork } from "./reducer/web3Reducer";
import { deleteUser } from "./reducer/userReducer";
import { connect } from 'react-redux';
import Chart from './chart/chart';

function App(props) {


    window.ethereum.on("accountsChanged", function(accounts) {
        if (props) {
            console.log(props);
            const address = accounts[0];
            console.log(address);
            localStorage.setItem("address", address);
            props.changeAddress(address);
            props.deleteUser();
            localStorage.removeItem("user");
            window.location.href = "/"
        }
    })

    window.ethereum.on("networkChanged", function(networkId) {
        if (props) {
            console.log(props);
            console.log(networkId);
            localStorage.setItem("network", networkId);
            props.changeNetwork(networkId);
        }
    })

    useEffect( async () => {
        if (props) {
            const a = await window.ethereum.request({ method: 'eth_accounts' });
            localStorage.setItem("account", a[0]);
            props.changeAddress(a[0]);
        }
    }, [])

  return (
    <div className="App">
       <Router>
                <div>
                    <Switch>
                        <Route
                            exact
                            path='/'
                            component = {Home}
                        /> 
                        <Route
                            exact
                            path='/application'
                            component = {Application}
                        /> 
                        <Route
                            exact
                            path='/profile/:address'
                            component = {Profile}
                        /> 
                        <Route
                            exact
                            path='/editprofile'
                            component = {EditProfile}
                        /> 
                        <Route
                            exact
                            path='/createNft'
                            component = {CreateNft}
                        /> 
                        <Route
                            exact
                            path='/collection'
                            component = {Collection}
                        /> 
                        <Route
                            exact
                            path='/nftObject'
                            component = {NFTObject}
                        /> 
                        <Route
                            exact
                            path='/nftTokenObject'
                            component = {NFTObjectSimple}
                        /> 
                        <Route
                            exact
                            path = "/chart"
                            component = {Chart}
                        />
                    </Switch>
                </div>
      </Router>
    </div>
  );
}

const mapDispatchToProps = {
    changeAddress,
    changeNetwork,
    deleteUser,
}

export default connect(null, mapDispatchToProps)(App);
