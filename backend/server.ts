import express, { Response, Request } from 'npm:express';
// import express from 'npm:express';
import env from './config/db.ts';

import address from './routes/address.ts';
import user from './routes/user.ts';
import image from './routes/image.ts';
import transaction from './routes/transaction.ts';

const APP = express();

APP.use((_req: Request, res: Response) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set(
        'Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS, POST, PUT, DELETE'
    );
    res.set(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
});

APP.use(express.json());
APP.use('/user', user);
APP.use('/address', address);
APP.use('/image', image);
APP.use('/transaction', transaction);

// APP.listen(env.PORT, '127.0.0.1', () => {
APP.listen(env.PORT, () => {
    console.log(`Server started on ${env.PORT}`);
});
