import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Renderizar ( Mostrar em tela ) o APP dentro do documento com o id root
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
