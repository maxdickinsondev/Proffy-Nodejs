import { Request, Response } from 'express';
import connections from '../database/connection';

class ConnectionsController {
    async index(request: Request, response: Response) {
        const totalConnections = await connections('connections').count('* as total');

        const { total } = totalConnections[0];

        return response.json({ total });
    }

    async create(request: Request, response: Response) {
        const { user_id } = request.body;

        await connections('connections').insert({
            user_id,
        });

        return response.status(201).send();
    }
}

export default new ConnectionsController();