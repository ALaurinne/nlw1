import knex from '../database/connections';
import { Request, Response } from 'express';

class PointsController {
    //Cadastrar pontos de coleta
    async create(request: Request, response: Response){
        const {
            name,
            email,
            whatsapp,
            lagitude,
            longitude,
            city,
            uf,
            items,
        } = request.body;
    
        // transaction para aguardar a outra query ter sucesso
        const trx = await knex.transaction();

        const point = {
            image: request.file.filename,
            name,
            email,
            whatsapp,
            lagitude,
            longitude,
            city,
            uf,
        }
    
        // Short Syntax, quando o nome da variavel é igual ao nome propriedade do objeto 
        const insertedIds = await trx('points').insert(point);
        
        const point_id = insertedIds[0];
    
        const pointItem = items
            .split(',') // separando por virgula
            .map((item: string) => Number(item.trim())) // transformando a string em number
            .map((item_id: number) => {
                return {
                    item_id,
                    point_id,
                };
        });
    
        await trx('points_items').insert(pointItem);
    
        await trx.commit();

        return response.json({
            id: point_id,
            ...point,
        });
    
    };

    // Listar um ponto especifico 
    async show(request: Request, response: Response){
        // Short Syntax
        const {id} = request.params;

        const point = await knex('points').where('id', id).first();

        if(!point){
            return response.status(400).json({
                message: 'Point not found.'
            });

        };

        // Atribuindo os itens pertecentes ao ponto de coleta
        //Todos os itens relacionados com o ponto de coleta

        const items = await knex('items')
            .join('points_items', 'items.id', '=', 'points_items.item_id')
            .where('points_items.point_id', id)
            .select('items.title');


        const serializedPoints = {
            ...point,
            image_url: `http://192.168.0.5:3333/uploads/${point.image}`,
            
        }

        return response.json({point: serializedPoints, items});

    };

    // Listar vários pontos
    async index(request: Request, response: Response){
        // cidade, UF, items ( Query Params )
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        
        // API Transforme - Serialização

        // Tentar sempre informar o formato quando receber a informação pelo query
        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', parsedItems) // Onde tem ao menos um dos items
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct() // Apenas pontos de coleta distintos
            .select('points.*'); // Apenas todos os dados da tabela points

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.0.5:3333/uploads/${point.image}`,
            };
        })

        return response.json(serializedPoints);
    };
};

export default PointsController;