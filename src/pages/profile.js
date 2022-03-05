import '../css/profile.css';
import defaultPic from '../svg/profile.svg';
import { firebase } from '../Config';
import React from 'react';
import { Redirect } from 'react-router-dom';
import Navbar from '../components/navbar';
const { useState, useRef } = require("react");

var auth = firebase.auth();
var db = firebase.firestore();
var storage = firebase.storage();

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function Profile() {
    const [profilePic, setProfilePicLocal] = useState();
    const [username, setUsername] = useState(auth.currentUser.displayName);
    const [description, setDescription] = useState();
    const [email, setEmail] = useState(auth.currentUser.email);

    console.log(auth.currentUser)
    if (auth.currentUser == null)
        return (
            <Redirect to="/"></Redirect>
        )

    const downloadProfilePic = () => {
        var ref = storage.ref();
        var profilePicRef = ref.child('users/' + auth.currentUser.uid + '/profile.jpg');
        profilePicRef.getDownloadURL()
            .then((url) => {
                setProfilePicLocal(url);
            });
    }

    const updateProfilePic = (e) => {
        var ref = storage.ref();
        var profilePicRef = ref.child('users/' + auth.currentUser.uid + '/profile.jpg');
        var newPic = e.target.files[0];
        profilePicRef.put(newPic)
        .then(() => {
            downloadProfilePic();
        })
    }

    const saveChanges = (e) => {
        e.preventDefault();
        auth.currentUser.updateProfile({
            displayName: username
        });
        db.collection('users').doc(auth.currentUser.uid).set({
            description: description,
            username: username
        }, {merge: true})
        if(validateEmail(email))
            auth.currentUser.updateEmail(email);
    }

    return (
        <div className="Profile">
            <Navbar />
            <div className="container">
                <h1>Let us know you better!</h1>
                <div className="profile-picture">
                    <img src={profilePic == null ? defaultPic : profilePic} alt="Profile Picture"></img>
                </div>
                <div class="file-input">
                    <input class="upload" id="upload" type="file" accept="image/png, image/jpg" onChange={updateProfilePic}></input>
                    <label for="upload">Upload new profile pic</label>
                </div>
                <input className="text-input" type="username" placeholder="Username" value={username} onChange={(e) => { setUsername(e.target.value); }} />
                <textarea className="text-input" placeholder="Description" value={description} onChange={(e) => { setDescription(e.target.value); }} />
                <input className="text-input" type="email" placeholder="Email" value={email} onChange={(e) => { setEmail(e.target.value); }} />
                <button onClick={saveChanges}>Save changes</button>
            </div>
        </div>
    )
}

export default Profile;