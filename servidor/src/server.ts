import express from 'express';
import routes from './routes';
import cors from 'cors';
import path from 'path';

const app = express ();

app.use(cors(
    //{ origin: 'www.' }
    ));
app.use(express.json());
app.use(routes);

// Estaticos como imagens, pdfs, etc
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')));



app.listen(3333);

/* const users = [
    'Laurinne',
    'Fernanda',
    'Hebert'
] */

// Listar usuários
/* app.get('/users', (request, response) =>{
    console.log('Listagem de usuários');
    return response.json(users);
}); */

// Procurar um usuário pelo ID
/* app.get('/users/:id', (request, response) => {
    const id = Number(request.params.id);
    
    const user = users[id];

    return response.json(user);
}); */

// Procurar um usuário pelo nome
/* app.get('/users', (request, response) => {
    const search = String(request.query.search);
    
    const filteredUser = search? users.filter(user => user.includes(search)) : users;

    return response.json(filteredUser);
}); */

// Criar um usuário
/* app.post('/users', (request, response) =>{
    const data = request.body
    
    const user = {
        name: data.name,
        email: data.email
    };

    return response.json(user);
});
 */
