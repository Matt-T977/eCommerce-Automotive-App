import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'react-router';
import './App.css';
import jwtDecode from 'jwt-decode';
import NavBar from './components/Navbar/Navbar';
import axios from 'axios';
import Login from './components/Login/Login';
import RegisterUser from './components/RegisterUser/RegisterUser';
import Landing from './components/Landing/Landing';

class App extends Component {
  state = {
    loggedUser: null,
    loginModalShow: false
  }
  registerURL = "https://localhost:44394/api/authentication/"
  loginURL = "https://localhost:44394/api/authentication/login"

  componentDidMount() {
    const jwt = localStorage.getItem('token');
    try{
      const user = jwtDecode(jwt);
      this.setState({
        loggedUser: user
      });
    } catch(err){
        console.log("🚀 ~ file: App.jsx ~ line 26 ~ App ~ componentDidMount ~ err", err)
      }
    }


    registerUser = async (userToRegister) => {
      try {
        let response = await axios.post(this.registerURL, userToRegister);
        console.log(response);
      } catch(err){
        console.log("🚀 ~ file: App.jsx ~ line 40 ~ App ~ registerUser= ~ err", err)
      }
    }

    loginUser = async (userToLogin) => {
      try {
        const response = await axios.post(this.loginURL, userToLogin);
        console.log(response);
        localStorage.setItem('token', response.data.token)
        window.location = "/";
        
      } catch(err){
        console.log("🚀 ~ file: App.jsx ~ line 51 ~ App ~ loginUser= ~ err", err)
      }
    }

    toggleLoginModal = () => {
      this.setState({
        loginModalShow: !this.state.loginModalShow
      })
    }

    logoutUser = () => {
      localStorage.removeItem('token');
      window.location = "/";
      this.setState({
        loggedUser: null
      })
    }
  
  
  render() {
    return (
      <div className="App">
        <NavBar user = {this.state.loggedUser} login={this.loginUser} logoutUser = {this.logoutUser} toggleLoginModal = {this.toggleLoginModal}/>
        <div>
        <Switch>
          {/* Home Page */}
          <Route path = "/" exact component={Landing}  />
          {/* Product Page */}
          <Route path = "/products" />
          {/* Search Page */}
          <Route path = "/search"/>
          {/* Seller Page logged in*/}
          <Route path = "/seller" />
          {/* Cart/Account logged in*/}
          <Route path = "/account" />
          {/* Login Page */}
          <Route path = "/login" render = {props => <Login {...props} login = {this.loginUser}modalShow = {this.state.loginModalShow} toggleModal={this.toggleLoginModal}/>} />
          {/* Register user */}
          <Route path = "/register" render = {props => <RegisterUser {...props} registerUser={this.registerUser}/>} />

          {/* Invalid Page Redirect */}
          <Redirect to='/not-found' />
        </Switch>
        </div>
      </div>
    );
  }
}

export default App;
