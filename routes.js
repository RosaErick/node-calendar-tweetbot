import { Router } from 'express';
import AirtableController from './AirtableController.js';


const routes = new Router();


routes.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
});



//airtable routes
routes.get('/airtable', AirtableController.index);


export default routes;