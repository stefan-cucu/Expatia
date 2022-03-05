import '@reach/combobox/styles.css'
import '../css/viewpost.css';
import thumbsUp from '../svg/thumbs.svg';
import { firebase } from '../Config';
import { Redirect, useLocation, useParams } from 'react-router-dom';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../components/navbar';
import axios from 'axios';
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
    MarkerClusterer,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
} from "@reach/combobox";
import styles from '../components/mapStyles';
const { useState, useRef } = require("react");

const mapContainerStyle = {
    height: "30vh",
    width: "33vw",
};
const options = {
    styles: styles,
    disableDefaultUI: true,
    zoomControl: true,
};

const db = firebase.firestore();
const auth = firebase.auth();

function ViewPost() {
    const [date, setdate] = useState(null);
    const [description, setdescr] = useState(null);
    const [points, setpoints] = useState(null);
    const [title, settitle] = useState(null);
    const [type, setType] = useState(1);
    const [location, setlocation] = useState([{
        lat: 43.6532,
        lng: -79.3832,
    }]);
    const [username, setusername] = useState(null);
    const mapRef = useRef();
    const [center, setCenter] = useState(null);

    const {postID} = useParams();

    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
        console.log(mapRef);
    }, []);


    const [commentText, setCommentText] = useState(null);
    const [comments, setComments] = useState([]);


    const getPost = () => {
        const ref = db.collection('posts').doc(postID);
        ref.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                setdate(doc.data().date);
                setdescr(doc.data().description);
                setpoints(doc.data().points);
                settitle(doc.data().title);
                setlocation(doc.data().location);
                setType(doc.data().type);
                setCenter({
                    lat: location[0].lat,
                    lng: location[0].lng
                })
                console.log(center);
                db.collection('users').doc(doc.data().user).get().then((userdata) => {
                    setusername(userdata.data().username);
                });
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    const uploadComment = () => {
        const commentId = uuidv4();
        const ref = db.collection('comments-' + postID).doc(commentId);
        ref.set({
            id: commentId,
            username: auth.currentUser.displayName,
            commentText: commentText,
            points: 0
        }, { merge: true })
        setCommentText('');
    }

    const updatePoints = () => {
        setpoints(points + 1);
        db.collection('posts').doc(postID).set({
            points: points + 1
        }, {merge: true})
    }

    useEffect(() => {
        getPost();
        auth.currentUser.getIdToken().then((token) => {
            axios.get('http://urandom.cloud:3000/try', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            })
            .then(data => (console.log('ceva')));
        })
        db.collection('comments-' + postID)
            .onSnapshot((querySnapshot) => {
                var data = [];
                querySnapshot.forEach((doc) => {
                    data.push(doc.data());
                })
                setComments(data);
                console.log(comments);
            });
    }, []);

    return (
        <div className="ViewPost">
            <Navbar />
            <div className="viewpost-container">
                <div className="post-container">
                    <div className="text-container">
                        <div className="upvote-sys">
                            <img src={thumbsUp} onClick={updatePoints} id="thumbsUp" />
                            <p>{points}</p>
                        </div>
                        <div class="another-container">
                            <h1>{title}</h1>
                            <div class="line" />
                            <p>{"Posted by " + username}</p>
                            <div class="line" />
                            <p>{description}</p>
                            {
                                type == 2 &&
                                <>
                                <div class="line"/>
                                <p>{"Date: " + date}</p>
                                </>
                            }
                        </div>
                    </div>
                    {
                        type == 2 &&
                        <GoogleMap
                        id="map"
                        mapContainerStyle={mapContainerStyle}
                        zoom={14}
                        center={{lat: location[0].lat, lng: location[0].lng}}
                        options={options}
                        >
                        {location && location.map((marker) => (
                            <Marker
                                key={uuidv4()}
                                position={{ lat: marker.lat, lng: marker.lng }} />
                        ))}
                        </GoogleMap>
                    }

                </div>
                <div className="comment-container">
                    {
                        auth.currentUser != null &&
                        <div className="create-comment">
                            <textarea className="text-input comment-area" placeholder="Comment here!" value={commentText} onChange={(e) => { setCommentText(e.target.value) }}> </textarea>
                            <button onClick={uploadComment}>Submit comment</button>
                        </div>
                    }
                    {
                        comments && comments.map((comment) => (<Comment commentId={comment.id}
                            username={comment.username}
                            commentText={comment.commentText}
                            postID={postID}
                            points={comment.points} />))
                    }
                </div>
            </div>
        </div>
    )
}

function Comment(props) {
    const commentId = props.commentId;
    const username = props.username;
    const commentText = props.commentText;
    const postID = props.postId;
    const [points, setPoints] = useState(props.points);

    const updatePoints = () => {
        setPoints(points + 1);
        db.collection('comments-'+postID).doc(commentId).set({
            points: points + 1
        }, {merge: true});
    }

    return (
        <div className="comment">
            <div className="upvote-sys">
                <img src={thumbsUp} onClick={updatePoints} id="thumbsUp" />
                <p>{points}</p>
            </div>
            <div className="comment-box">
                <p className="username">{"Comment by: " + username}</p>
                <p className="comment-text">{commentText}</p>
            </div>
        </div>
    );
}

export default ViewPost;