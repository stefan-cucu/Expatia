import '../css/navbar.css';
import { firebase } from '../Config';
import { useHistory } from 'react-router-dom';
import LogoPng from './logo.png';
import { useEffect, useState } from 'react';

var auth = firebase.auth();

function Navbar() {
    const history = useHistory();
    const [list, showList] = useState(false);

    return (
        <>
            <header>
                <img src={LogoPng} alt="Logo" />
                <ul>
                    <li title="Home">
                        <i onClick={() => { history.push("/"); }} class="fa-solid fa-house"></i>
                    </li>
                    {
                        auth.currentUser != null &&
                        <>
                            <li onClick={()=>{showList(true)}} title="Your Communities">
                                <i class="fa-solid fa-hands-holding"></i>
                            </li>
                            <li title="Profile">
                                <i onClick={() => { history.push("/profile") }} class="fa-solid fa-user"></i>
                            </li>
                        </>
                    }
                </ul>
                {
                    auth.currentUser != null &&
                    <i onClick={() => { auth.signOut(); history.push("/") }} class="fa-solid fa-right-from-bracket"></i>
                }
            </header>
            {
                list &&
                <div class="comm-list">
                    <div class="commty">
                        <div class="community-image-container">
                            <img src="https://cdn.wallpapersafari.com/52/88/pAcCWh.jpg" alt="Madrid" />
                        </div>
                        <div class="right">
                            <h2 onClick={() => {history.push("/community/")}} class="community-name">Oradea-Milano Community</h2>
                            <div class="community-tags-container">
                                <div class="tag">First Tag</div>
                                <div class="tag">Second Tag Name</div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

function CommunityContainer() {

}

export default Navbar;