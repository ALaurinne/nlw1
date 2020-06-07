import express from 'express';
import { celebrate, Joi } from 'celebrate';
import multer from 'multer';
import multerConfig from './config/multer';
import PointsController from './controllers/PointsController';
import ItemsController from './controllers/ItemsController';

const routes = express.Router();
const pointsController = new PointsController();
const itemsController = new ItemsController();
const upload = multer(multerConfig);

// Pegar uma lista de itens
routes.get('/items', itemsController.index);

// Listar um ponto especifico 
routes.get('/points/:id', pointsController.show);

// Listar vários pontos 
routes.get('/points', pointsController.index);

// Atualizada para receber e salvar imagens
// Atualizada para validar o body
//Cadastrar pontos de coleta
routes.post(
    '/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.number().required(),
            lagitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    }, {
        abortEarly: false
    }),
    pointsController.create);


// padrão: index ( listagem ), show ( um único registro ), create, update, delet

export default routes;

// Estruturas para criar o código: 
// Service Pattern
// Repository Pattern ( Data Mapper )