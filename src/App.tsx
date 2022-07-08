import Header from './components/Header/Header';
import { useState, createContext } from 'react';
import Footer from './components/Footer/Footer';
import Autorization from './pages/Autorization/Autorization';
import Cabinet from './components/Cabinet/Cabinet';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';
import PrivateRoute from './utils/PrivateRouter';
// import { store } from './redux/store';

export const SearchContext = createContext({});

function App() {
  // const isAuth = localStorage.getItem('id');
  const [searchValue, setSearchValue] = useState('');
  // const navigate = useNavigate();
  const [localName, setLocalName] = useState('');

  // const navigate = useNavigate();

  return (
    <div className="App">
      <Header localName={localName} setLocalName={setLocalName} />
      <SearchContext.Provider value={{ searchValue, setSearchValue }}>
        <Routes>
          <Route
            path={'/cabinet'}
            element={
              <PrivateRoute>
                <Cabinet localName={localName} setLocalName={setLocalName} />{' '}
              </PrivateRoute>
            }></Route>

          <Route
            path="/signin"
            element={<Autorization localName={localName} setLocalName={setLocalName} />}></Route>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </SearchContext.Provider>

      <Footer />
    </div>
  );
}

export default App;
