import Navbar from '../components/navbar';
import '../css/home.css';
import countries from '../components/countries';
import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { firebase } from '../Config';

function Home() {
    const [showCountrySelector, setShowCountrySelector] = useState(false);
    const [showComunitySelector, setShowComunitySelector] = useState(false);
    const ref = useRef(null);
    const history = useHistory();

    const join = () => {
        if(firebase.auth().currentUser == null)
            history.push("/login");
        else
            setShowCountrySelector(true);
    }
    const alerta = () => {
        alert("You succesfuly joined the community!");
        history.push("/community");
    }

    return (
        <div id="Home">
            <Navbar ref={ref} />
            <div id="main-photo-container">
                <div id="main-bttn-container">
                    <button onClick={() => {join()}}>Join Community</button>
                </div>
            </div>
            <div id="content">
                <div id="popular-communities">
                    <h2>Popular Communities</h2>
                    <div id="popular-communities-container">
                        <div class="community">
                            <div class="community-image-container">
                                <img src="https://cdn.wallpapersafari.com/52/88/pAcCWh.jpg" alt="Madrid" />
                            </div>
                            <h3 class="community-name">Cluj-Madrid Community</h3>
                            <p class="community-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            <div class="community-tags-container">
                                <div class="tag">First Tag</div>
                                <div class="tag">Second Tag Name</div>
                                <div class="tag">Third Tag Name</div>
                                <div class="tag">This is Forth Tag</div>
                                <div class="tag">Last Tag</div>
                            </div>
                        </div>
                        <div class="community">
                            <div class="community-image-container">
                                <img src="https://lp-cms-production.imgix.net/features/2019/02/Parthenon-Acropolis-Athens-6bb8e8c9ddaa.jpg?auto=format&fit=crop&sharp=10&vib=20&ixlib=react-8.6.4&w=850" alt="Athens" />
                            </div>
                            <h3 class="community-name">Bucuresti-Atena Community</h3>
                            <p class="community-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            <div class="community-tags-container">
                                <div class="tag">First Tag</div>
                                <div class="tag">Second Tag Name</div>
                                <div class="tag">Third Tag Name</div>
                                <div class="tag">This is Forth Tag</div>
                                <div class="tag">Last Tag</div>
                            </div>
                        </div>
                        <div class="community">
                            <div class="community-image-container">
                                <img src="https://media.timeout.com/images/105186767/750/422/image.jpg" alt="Milan" />
                            </div>
                            <h3 class="community-name">Oradea-Milano Community</h3>
                            <p class="community-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                            <div class="community-tags-container">
                                <div class="tag">First Tag</div>
                                <div class="tag">Second Tag Name</div>
                                <div class="tag">Third Tag Name</div>
                                <div class="tag">This is Forth Tag</div>
                                <div class="tag">Last Tag</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            {
                showCountrySelector &&
                <div id="join-container">
                    <div id="join">
                        <h3>Please Select Country</h3>
                        <div id="country-dropdown">
                            {
                                countries.map((country) => (<div value={country} onClick={()=>{setShowComunitySelector(true); setShowCountrySelector(false);}}>{country}</div>))
                            }
                        </div>
                    </div>
                </div>
            }
            {
                showComunitySelector &&
                    <div id="join-community-container">
                        <div id="join-community">
                            <h3>Please Select Community</h3>
                            <div id="community-select">
                                <div class="commty">
                                    <div class="community-image-container">
                                        <img src="https://cdn.wallpapersafari.com/52/88/pAcCWh.jpg" alt="Madrid"/>
                                    </div>
                                    <div class="right">
                                        <h2 onClick={() => alerta()} class="community-name">Oradea-Milano Community</h2>
                                        <div class="community-tags-container">
                                            <div class="tag">First Tag</div>
                                            <div class="tag">Second Tag Name</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </div>
    );
}



export default Home;