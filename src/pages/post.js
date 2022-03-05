import '@reach/combobox/styles.css'
import '../css/post.css';
import { firebase } from '../Config';
import { Redirect, useHistory } from 'react-router-dom';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
import Navbar from '../components/navbar';
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
const center = {
    lat: 43.6532,
    lng: -79.3832,
};

const db = firebase.firestore();
const auth = firebase.auth();

function Post() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "API-KEY-HERE",
        libraries: ["places"]
    });
    const history = useHistory();
    //const { country, community } = useLocation().state;
    const [togglePostType, setToggleType] = useState(2); // setToggleType(...)
    const [title, setTitle] = useState(null);
    const [postText, setPostText] = useState(null);
    const [eventText, setEventText] = useState(null);
    const [eventDate, setEventDate] = useState(null);
    const mapRef = useRef();
    const [marker, setMarker] = useState([]);

    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
        console.log(mapRef);
    }, []);
    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
        setMarker([{
            lat: lat,
            lng: lng,
            time: new Date()
        }]);
    }, []);

    if (auth.currentUser == null)
        return (
            <Redirect to="/" />
        )

    const uploadPost = () => {
        if (title == null)
            return;
        if (postText == null && setToggleType == 1)
            return;
        if ((eventText == null || eventDate == null) && setToggleType == 2)
            return;
        const postUUID = uuidv4();

        if (togglePostType == 1)
            db.collection('posts').doc(postUUID)
                .set({
                    user: auth.currentUser.uid,
                    title: title,
                    type: 1,
                    id: postUUID,
                    description: postText,
                    points: 0
                }, { merge: true })
        else{
            console.log(marker.lat);
            db.collection('posts').doc(postUUID)
                .set({
                    user: auth.currentUser.uid,
                    title: title,
                    type: 2,
                    id: postUUID,
                    description: eventText,
                    date: eventDate,
                    location: marker,
                    points: 0
                }, { merge: true })
                .catch((error) =>{
                    console.log(error)
                })
        }
        history.push("/community");
    }

    return (
        <div className="Post">
            <Navbar />
            <div className="post-container">
                <div className="post-type-selector">
                    <button onClick={() => {setToggleType(1)}} className="text-post">Text</button>
                    <button onClick={() => {setToggleType(2)}}  className="event-post">Event</button>
                </div>
                <div className="post-input-area">
                    <input className="text-input" type="text" placeholder="Title" id="title" value={title} onChange={(e) => { setTitle(e.target.value) }}></input>
                    {
                        togglePostType == 1 &&
                        <textarea className="text-input text-area" value={postText} onChange={(e) => { setPostText(e.target.value) }}> </textarea>
                    }
                    {
                        togglePostType == 2 &&
                        <div className="event-container">
                            <textarea className="text-input" placeholder="Description" value={eventText} onChange={(e) => { setEventText(e.target.value) }}></textarea>
                            <input className="text-input" type="date" value={eventDate} onChange={(e) => { setEventDate(e.target.value) }}></input>
                            <GoogleMap
                                id="map"
                                mapContainerStyle={mapContainerStyle}
                                zoom={8}
                                center={center}
                                options={options}
                                onLoad={onMapLoad}
                            >
                                {marker.map((marker) => (
                                    <Marker
                                        key={marker.time.toISOString()}
                                        position={{ lat: marker.lat, lng: marker.lng }} />
                                ))}
                            </GoogleMap>
                            <Search panTo={panTo} />
                        </div>
                    }
                </div>
                <button onClick={uploadPost}>Save!</button>
            </div>
        </div>
    )
}

function Search({ panTo }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 43.6532, lng: () => -79.3832 },
            radius: 100 * 1000,
        },
    });

    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = async (address) => {
        setValue(address, false);
        clearSuggestions();
        try {
            const results = await getGeocode({ address });
            const { lat, lng } = await getLatLng(results[0]);
            console.log(panTo);
            panTo({ lat, lng });
        } catch (error) {
            console.log("😱 Error: ", error);
        }
    };

    return (
        <div className="search">
            <Combobox onSelect={handleSelect}>
                <ComboboxInput
                    value={value}
                    onChange={handleInput}
                    disabled={!ready}
                    placeholder="Search your location"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" &&
                            data.map(({ id, description }) => (
                                <ComboboxOption key={id} value={description} />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
}

export default Post;