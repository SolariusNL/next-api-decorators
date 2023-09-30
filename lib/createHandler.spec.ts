/* eslint-disable @typescript-eslint/no-empty-function */
import express from 'express';
import 'reflect-metadata';
import request from 'supertest';
import { createHandler } from './createHandler';
import { HTTP_METHOD_TOKEN, HttpVerb } from './decorators';

describe('createHandler', () => {
  it('Should return not found response when "req.url" is undefined', () => {
    class Test {}

    const req: any = {};
    const res = {
      status: () => res,
      json: () => res
    };

    
    // @ts-ignore
    expect(createHandler(Test)(req, res)).toMatchObject({});
  });

  it('Should return not found when method is not found.', done => {
    class TestHandler {}
    Reflect.defineMetadata(HTTP_METHOD_TOKEN, [{ path: '/', verb: HttpVerb.GET, propertyKey: 'index' }], TestHandler);

    const server = express();
    server.use(express.json());
    
    // @ts-ignore
    server.all('/', createHandler(TestHandler));

    request(server)
      .get('/')
      .expect(404)
      .then(res => expect(res.body).toMatchObject({ statusCode: 404 }))
      .then(done);
  });
});
