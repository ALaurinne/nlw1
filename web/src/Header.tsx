import React from 'react';


// Forma de definir a tipagem de um objeto
interface HeaderProps {
    title: string;
    logo?: string;
};

// Todo componente com letra maiscula para não se confudir com o elemento
// Arow Function
// Tipagem estática: maneira mais escalavel 
// HeaderProps é como o parametro da função 
const Header: React.FC<HeaderProps> = (props) => {
    
    return (
        <header>
            <h1>{props.title}</h1>
        </header>
    );
};

export default Header;