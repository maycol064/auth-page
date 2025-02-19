import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { MainRouter } from './router/MainRouter';

function App() {
  return (
    <BrowserRouter>
      <MainRouter />
    </BrowserRouter>
  );
}

export default App;
