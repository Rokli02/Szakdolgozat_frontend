import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/navbar/Navbar';
import { Login } from './pages/login/Login';
import { Logout } from './pages/Logout';
import { ProtectedRoutes } from './pages/ProtectedRoutes';
import { Signup } from './pages/signup/Signup';

function App() {
  return (
    <>
      <div>
        <Navbar></Navbar>
        <Routes>
          <Route path='/' element={<Navigate to={"/series"} replace={true}/>} />
          <Route path='/series' />
          <Route path="/newsfeed" />
          <Route path='/login' element={<Login />}/>
          <Route path='/signup' element={<Signup />}/>
          <Route path="/logout" element={<Logout />} />
          <Route path='/user' element={<ProtectedRoutes rights={["user"]} />}>
            <Route path="newsfeed"/>
            <Route path="series"/>
            <Route path="handle/series"/>
            <Route path="handle/series/:id"/>
          </Route>
          <Route path='/admin' element={<ProtectedRoutes rights={["siteManager", 'admin']} />}>
            <Route path='series'/>
            <Route path='series/:id'/>
            <Route path='newsfeed'/>
            <Route path='newsfeed/:id'/>
            <Route path='misc'/>
            <Route path='misc/:id'/>
            <Route element={<ProtectedRoutes rights={['admin']} />}>
              <Route path='user'/>
              <Route path='user/:id'/>
            </Route>
          </Route>
          <Route path='*' element={<Navigate to={"/"} replace={true}/>}/>
        </Routes>
      </div>
      {/* <div className="background"></div> */}
    </>
  );
}

export default App;
