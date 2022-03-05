import {
  HashRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Post from "./pages/post";
import ViewPost from "./pages/viewpost";
import Community from "./pages/community";
import LoginComponent from './pages/login-component';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/login" exact component={Login} />
          <Route path="/community" exact component={Community}/>
          <Route path="/profile" exact component={Profile} />
          <Route path="/post" exact component={Post} /> 
          <Route path="/test" exact component={LoginComponent} />
          <Route path="/viewpost/:postID">
            <ViewPost/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
