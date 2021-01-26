import { Router } from 'express';

import pollsRouter from './polls.routes';
import usersRouter from './users.routes';

const routes = Router();

routes.use('/polls', pollsRouter);
routes.use('/users', usersRouter);

export default routes;