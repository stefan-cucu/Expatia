import Navbar from '../components/navbar';
import '../css/community.css';
import {firebase} from '../Config';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

const db = firebase.firestore();

function Community() {
    const [posts, setPosts] = useState([]);
    const history = useHistory();
    useEffect(() => {
        db.collection('posts').get()
        .then((querySnapshot) => {
            var data = [];
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
            });
            setPosts(data);
            console.log(posts.map((post)=>{return post;}));
        })
    }, []);

    return (
        <div className="Community">
            <Navbar/>
            <div id="community-template">
                <h1>Oradea-Milano Community</h1>
                <div class="community-image-container-1">
                    <img src="https://ychef.files.bbci.co.uk/976x549/p0963z2q.jpg" alt="Milan" />
                </div>
                <section>
                    <h2>Community Description</h2>
                    <p class="community-description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                </section>
                <section id="important-topics">
                    <div id="places-to-visit">
                        <h2>Places To Visit</h2>
                        <ul>
                            <li>First Place</li>
                            <li>Second Place</li>
                            <li>Third Place</li>
                            <li>Forth Place</li>
                        </ul>
                    </div>
                    <div id="places-to-eat">
                        <h2>Places To Eat</h2>
                        <ul>
                            <li>First Place</li>
                            <li>Second Place</li>
                            <li>Third Place</li>
                            <li>Forth Place</li>
                        </ul>
                    </div>
                    <div id="local-customs">
                        <h2>Local Customs</h2>
                        <ul>
                            <li>Local Custom</li>
                            <li>Local Custom</li>
                            <li>Local Custom</li>
                            <li>Local Custom</li>
                        </ul>
                    </div>
                    <div id="local-laws">
                        <h2>Local Law</h2>
                        <ul>
                            <li>Local Law</li>
                            <li>Local Law</li>
                            <li>Local Law</li>
                            <li>Local Law</li>
                        </ul>
                    </div>
                </section>
                <section id="posts-event">
                    <h2>Stay Involved</h2>
                    <div id="bttns-container">
                        <i onClick={() => {history.push("/post");}} class="fab fa-usps">Create an Event / Make a Post</i>
                    </div>
                </section>
                <section id="posts">
                    <h2>Posts</h2>
                    <div id="posts-list">
                        <ol>
                            {
                                posts.map((post) => (
                                    <li onClick={() => {history.push("/viewpost/"+post.id)}}>{post.title}</li>
                                ))
                            }
                        </ol>
                    </div>
                </section>
                <section>
                    <h2>Community Tags</h2>
                    <div class="community-tags-container">
                        <div class="tag">First Tag</div>
                        <div class="tag">Second Tag Name</div>
                        <div class="tag">Third Tag Name</div>
                        <div class="tag">This is Forth Tag</div>
                        <div class="tag">Last Tag</div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Community;