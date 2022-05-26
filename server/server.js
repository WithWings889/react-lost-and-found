import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser'

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { verify } from './middleware/authMiddleware.js';
import connectDB from './db.js';

import { graphqlHTTP } from 'express-graphql';

import graphqlSchema from './graphql/schemas/index.js';
import graphqlResolvers from './graphql/resolvers/index.js';

dotenv.config();

await connectDB();

const app = express();

app.use(express.json());
app.use(bodyParser.text({ type: 'application/graphql' }));
app.use(cors({ credentials: true }));
app.use(verify);
app.use(cors());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.use(
    '/graphql',
    graphqlHTTP((req, res, graphQLParams) => {
        return {
            schema: graphqlSchema,
            rootValue: graphqlResolvers,
            context: req,
            graphiql: process.env.NODE_ENV === 'development' ? true : false,
        };
    })
);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/', (req, res) => {
    res.send('API is running....');
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

export const server = app.listen(
    PORT,
    console.log(
        `Server running on port ${PORT}`
    )
);

export default {
    app,
};
