import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './Home'; 
import Simulator from './Simulator';
import Investimentos from './Investimentos';
import { QuemSomos } from './QuemSomos';
import Calculator from './Calculator';
 import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
export default function App() {
  return (
    <>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/simulator" element={<Simulator/>} />
        <Route path='/investimentos' element={<Investimentos/>}/>
        <Route path='/quem-somos' element={<QuemSomos/>}/>
        <Route path='/calculator' element={<Calculator/>}/>
      </Routes>
    </HashRouter>
   

   
  
</>

  );
}
