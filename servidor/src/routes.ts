import express from 'express';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();

// Pegar uma lista de itens
routes.get('/items', itemsController.index);

//Cadastrar pontos de coleta
routes.post('/points', pointsController.create);

// Listar um ponto especifico 
routes.get('/points/:id', pointsController.show);

// Listar vários pontos 
routes.get('/points', pointsController.index);

// padrão: index ( listagem ), show ( um único registro ), create, update, delet

export default routes;

// Estruturas para criar o código: 
// Service Pattern
// Repository Pattern ( Data Mapper )