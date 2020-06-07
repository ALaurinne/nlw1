import knex from '../database/connections';
import { Request, Response } from 'express';

class ItemsController{
async index(request: Request, response: Response){
    // Buscando todos os campos da tabela de itens
    // Sempre que utilizar uma query pro banco de dados, precisa utilizar o await para aguardar a query terminar para ter os resultados
    // sempre que utilizar await, precisa-se alterar para async

    const items = await knex('items').select('*');

    const serializedItems = items.map(item => {
        return {
            id: item.id,
            title: item.title,
            image_url: `http://192.168.0.5:3333/uploads/${item.image}`,
        };
    })

    return response.json(serializedItems);
}};

export default ItemsController;