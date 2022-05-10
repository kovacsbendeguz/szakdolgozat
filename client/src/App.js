import './App.css';
import io from 'socket.io-client'
import { ChakraProvider, theme } from '@chakra-ui/react'
import {
  Routes, Route,
} from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Registration from './pages/Register'
import Room from './pages/Room'
import NewRoom from './pages/NewRoom'
import Films from './pages/Films'
import Genres from './pages/Genres'


const socket = io()

function App() {

  /*window.onbeforeunload = (event) => {
    const e = event || window.event;
    e.preventDefault();
    if (e) {
      e.returnValue = '';
    }
    return '';
  };*/

  return (
    <ChakraProvider theme={theme}>
      <Header>
        <Routes>
          <Route path="/" element={<Dashboard socket={socket}/>} />
          <Route path="/login" element={<Login socket={socket}/>} />
          <Route path="/registration" element={<Registration socket={socket}/>} />
          <Route path="/newroom" element={<NewRoom socket={socket}/>} />
          <Route path="/room/:id" element={<Room socket={socket}/>} />
          <Route path="/films" element={<Films socket={socket}/>} />
          <Route path="/genres" element={<Genres socket={socket}/>} />
        </Routes>
      </Header>
    </ChakraProvider>
  );
}

export default App;
