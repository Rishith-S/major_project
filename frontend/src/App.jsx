import { Routes, Route } from 'react-router-dom';
import PersistLogin from './components/persistLogin';
import Login from './components/Login'
import SignUp from './components/SignUp'
import Layout from './components/Layout';
import HomePage from './screens/HomePage';
import Result from './screens/Result';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
          <Route element={<PersistLogin />} >
            <Route element={<Layout />}>
              <Route path='/home' element={<HomePage/>}/>
              <Route path='/result' element={<Result/>}/>
            </Route>
          </Route>
      </Routes>
    </div>
  );
}

export default App;
