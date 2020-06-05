import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import CreatePoint from './pages/CreatePoint';
import Routes from './routes';

// import Header from './Header';

// // .tsx para poder escrever elementos HTML
// // Isolar para poder utilizar quantas vezes quiser dentro do APP 
// // Enviar atributos para o elemento ( type, value ) as propriedades do react são atributos que enviamos para o componente
// // Armazenar informação que o usuário fez alguma coisa ( estados )

// function App() {
//   // Usar estado: retorna um array [ valor do estado, função para atualizar o valor do estado ]
//   //Vale para qualquer propriedade
//   // Manter uma informação que permanece acessivel em tempo real para o componente, o valor atual dela. 
//   const [counter, setCounter] = useState(0);
  
//   // setCounter é uma função dentro do estado, o handleButton a chama quando clica no botão.
//   function handleButtonClick(){
//     setCounter(counter + 1);
//   }
  

//   return (
//     <div>
 
//       <Header title = {`Contador: ${counter}`}/>
      
//       <button type="button" onClick={handleButtonClick}>Aumentar</button>
//     </div>
//   );
// }

function App() {
  return (
    <Routes />
  );
};

export default App;
