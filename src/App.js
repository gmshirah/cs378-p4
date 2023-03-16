import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image'
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

async function fetchAPIData(url) {
  return await axios({
    url: url,
    method: 'get'
  })
}

function App() {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDuQfg1cH9VyExr9ACaa1VuYLtK2560b8M",
    authDomain: "cs378-p4-81fdd.firebaseapp.com",
    databaseURL: "https://cs378-p4-81fdd-default-rtdb.firebaseio.com",
    projectId: "cs378-p4-81fdd",
    storageBucket: "cs378-p4-81fdd.appspot.com",
    messagingSenderId: "43755040085",
    appId: "1:43755040085:web:1e82ead64f5874491ad3dc",
    measurementId: "G-52SKHQ58RS"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  // Initialize Firebase Authentication and get a reference to the service
  const auth = getAuth(app);
  const user = auth.currentUser;

  const [signUp, setSignUp] = useState(false);
  const [loggedIn, setLoggedIn] = useState(user !== null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchError, setSearchError] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [searchImage, setSearchImage] = useState([]);
  const [dogImage, setDogImage] = useState([]);
  const [fetchDogImage, setFetchDogImage] = useState(false);
  const [dogFact, setDogFact] = useState([]);
  const [fetchDogFact, setFetchDogFact] = useState(false);

  useEffect(() => {
    console.log("Fetching random image...");
    async function getData() {
      const res = await fetchAPIData('https://dog.ceo/api/breeds/image/random');
      setDogImage(res.data);
    }
    getData();
  }, [fetchDogImage]);

  useEffect(() => {
    console.log("Fetching random fact...");
    async function getData() {
      const res = await fetchAPIData('https://dogapi.dog/api/v2/facts');
      setDogFact(res.data.data[0]);
    }
    getData();
  }, [fetchDogFact]);

  const onEmailInput = ({target:{value}}) => setEmail(value);
  const onPasswordInput = ({target:{value}}) => setPassword(value);

  const onCreateUserSubmit = e => {
    e.preventDefault();
    console.log("Creating user...");
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        // const user = userCredential.user;
        setLoggedIn(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
      });
  }

  const onSignInSubmit = e => {
    e.preventDefault();
    console.log("Signing in...");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        // const user = userCredential.user;
        setLoggedIn(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMessage(errorMessage);
      });
  }

  const onSignOut = e => {
    e.preventDefault();
    console.log("Signing out...");
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        setErrorMessage("");
        setEmail("");
        setPassword("");
        setSignUp(false);
        setLoggedIn(false);
      }).catch((error) => {
        // An error happened.
      });
  }

  const onSearchInput = ({target:{value}}) => setSearchValue(value);

  const onSearchSubmit = e => {
    e.preventDefault();
    console.log("Fetching " + searchValue + " image...");
    let breed = searchValue;
    breed = breed.toLowerCase();
    let breedArray = breed.split(" ");
    let url = 'https://dog.ceo/api/breed/';
    if (breedArray.length > 1) {
      url = url + breedArray[1] + '/';
    }
    url = url + breedArray[0] + '/';
    url = url + 'images/random';
    async function getData() {
      try {
        const res = await fetchAPIData(url);
        setSearchImage(res.data);
        breed = "";
        for (let i = 0; i < breedArray.length; i++) {
          if (i > 0) {
            breed = breed + " ";
          }
          breed = breed + breedArray[i].substring(0, 1).toUpperCase() + breedArray[i].substring(1).toLowerCase();
        }
        setSearchValue(breed);
      } catch (err) {
        console.log(searchImage);
        setSearchError(true);
      }
    }
    getData();
    setShowSearch(true);
  }

  if (!loggedIn) {
    if (signUp) {
      return (
        <div className="SignUpPage">
          <h1>Sign Up</h1>
          { errorMessage.length > 0 ? (
            <Alert variant="danger" onClose={() => {setErrorMessage("");}} dismissible>
              <Alert.Heading>Error</Alert.Heading>
              <p>{errorMessage}</p>
            </Alert>
          ) : (
            <span></span>
          )}
          <Form onSubmit={onCreateUserSubmit}>
            <Form.Group className="FormElement" controlId="signUpForm.email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" onChange={onEmailInput} value={email} />
            </Form.Group>
            <Form.Group className="FormElement" controlId="signUpForm.password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="password" onChange={onPasswordInput} value={password} />
            </Form.Group>
            <Button className="FormElement" variant="secondary" type="submit">Sign Up</Button>
          </Form>
          <p>Already have an account? <a href="#" onClick={() => {setSignUp(false); setErrorMessage(""); setEmail(""); setPassword("");}}>Login!</a></p>
        </div>
      );
    } else {
      return (
        <div className="LoginPage">
          <h1>Login</h1>
          { errorMessage.length > 0 ? (
            <Alert variant="danger" onClose={() => {setErrorMessage("");}} dismissible>
              <Alert.Heading>Error</Alert.Heading>
              <p>{errorMessage}</p>
            </Alert>
          ) : (
            <span></span>
          )}
          <Form onSubmit={onSignInSubmit}>
            <Form.Group className="FormElement" controlId="loginForm.email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="email" placeholder="name@example.com" onChange={onEmailInput} value={email} />
            </Form.Group>
            <Form.Group className="FormElement" controlId="loginForm.password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="password" onChange={onPasswordInput} value={password} />
            </Form.Group>
            <Button className="FormElement" variant="secondary" type="submit">Login</Button>
          </Form>
          <p>Don't have an account? <a href="#" onClick={() => {setSignUp(true); setErrorMessage(""); setEmail(""); setPassword("");}}>Sign up!</a></p>
        </div>
      );
    }
  }

  if (showSearch) {
    if (searchError) {
      return (
        <Alert id="fullScreenAlert" variant="danger" onClose={() => {setShowSearch(false); setSearchValue(""); setSearchError(false);}} dismissible>
          <Alert.Heading>Invalid Search</Alert.Heading>
          <p>Oh, no! We couldn't find any images of "{searchValue}". Please close this alert and try again.</p>
        </Alert>
      );
    } else {
      return (
        <Alert id="fullScreenAlert" variant="secondary" onClose={() => {setShowSearch(false); setSearchValue("");}} dismissible>
          <Alert.Heading>{searchValue}</Alert.Heading>
          <Image rounded src={searchImage.message} />
          <Button variant="secondary" onClick={onSearchSubmit}>Another One!</Button>
        </Alert>
      );
    }
  }

  if (showImage) {
    return (
      <Alert id="fullScreenAlert" variant="secondary" onClose={() => {setShowImage(false); setFetchDogImage(!fetchDogImage);}} dismissible>
        <Alert.Heading>Random Image</Alert.Heading>
        <Image rounded src={dogImage.message} />
        <Button variant="secondary" onClick={() => setFetchDogImage(!fetchDogImage)}>Another One!</Button>
      </Alert>
    );
  }

  if (showFact) {
    return (
      <Alert id="fullScreenAlert" variant="secondary" onClose={() => {setShowFact(false); setFetchDogFact(!fetchDogFact);}} dismissible>
        <Alert.Heading>Random Fact</Alert.Heading>
        <p>{dogFact.attributes.body}</p>
        <Button variant="secondary" onClick={() => setFetchDogFact(!fetchDogFact)}>Another One!</Button>
      </Alert>
    );
  }

  return (
    <div className="App">
      <div className="HeadBlock">
        <p>Signed in as {user.email}, <a href="#" onClick={onSignOut}>sign out?</a></p>
        <Form onSubmit={onSearchSubmit}>
          <InputGroup>
            <Form.Control type="text" placeholder="Search images by breed..." onChange={onSearchInput} value={searchValue} />
            <Button variant="outline-secondary" id="searchBtn" type="submit">
              <span className="material-symbols-outlined">
                search
              </span>
            </Button>
          </InputGroup>
        </Form>
        <Row>
          <Col id="randImgBtnCol">
            <Button variant="secondary" onClick={() => setShowImage(true)}>Random Image</Button>
          </Col>
          <Col id="randFactBtnCol">
            <Button variant="secondary" onClick={() => setShowFact(true)}>Random Fact</Button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default App;
