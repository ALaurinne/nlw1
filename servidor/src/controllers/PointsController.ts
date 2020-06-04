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
            image: 'https://images.unsplash.com/photo-1584192134994-726100c5d92a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=317&q=60-fake',
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
    
        const pointItem = items.map((item_id: number) => {
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

        return response.json({point, items});

    };

    // Listar vários pontos
    async index(request: Request, response: Response){
        // cidade, UF, items ( Query Params )
        const { city, uf, items } = request.query;

        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));
        
    
        // Tentar sempre informar o formato quando receber a informação pelo query
        const points = await knex('points')
            .join('points_items', 'points.id', '=', 'points_items.point_id')
            .whereIn('points_items.item_id', parsedItems) // Onde tem ao menos um dos items
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct() // Apenas pontos de coleta distintos
            .select('points.*'); // Apenas todos os dados da tabela points

        return response.json(points);
    };
};

export default PointsController;