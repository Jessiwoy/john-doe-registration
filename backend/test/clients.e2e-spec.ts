// clients.e2e-spec.ts
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from '@jest/globals';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Color } from '@prisma/client';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { PrismaService } from '../src/prisma/prisma.service';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://john_doe:john_doe_password@localhost:5432/john_doe_registration?schema=test';

const validPayload = {
  fullName: ' John Doe ',
  cpf: '529.982.247-25',
  email: ' JOHN@EMAIL.COM ',
  observations: ' Observação opcional ',
};

describe('Clients integration (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let activeColor: Color;
  let inactiveColor: Color;

  beforeAll(async () => {
    process.env.DATABASE_URL = databaseUrl;

    execSync('npx prisma migrate deploy', {
      cwd: join(__dirname, '..'),
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
      stdio: 'inherit',
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    await prisma.client.deleteMany();
    await prisma.color.deleteMany();

    activeColor = await prisma.color.create({
      data: {
        name: 'Azul',
        value: 'blue',
        hex: '#0000FF',
        isActive: true,
      },
    });
    inactiveColor = await prisma.color.create({
      data: {
        name: 'Cinza',
        value: 'gray',
        hex: '#808080',
        isActive: false,
      },
    });
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.client.deleteMany();
      await prisma.color.deleteMany();
    }
    if (app) {
      await app.close();
    }
  });

  it('retorna 201 para cadastro válido e persiste os dados normalizados', async () => {
    await request(app.getHttpServer())
      .post('/clients')
      .send({
        ...validPayload,
        favoriteColorId: activeColor.id,
      })
      .expect(201)
      .expect({ message: 'Cliente cadastrado com sucesso.' });

    const client = await prisma.client.findUnique({
      where: {
        cpf: '52998224725',
      },
    });

    expect(client).toMatchObject({
      fullName: 'John Doe',
      cpf: '52998224725',
      email: 'john@email.com',
      favoriteColorId: activeColor.id,
      observations: 'Observação opcional',
    });
    expect(client?.createdAt).toBeInstanceOf(Date);
  });

  it('retorna 400 para payload inválido', async () => {
    await request(app.getHttpServer())
      .post('/clients')
      .send({
        fullName: ' ',
        cpf: '111.111.111-11',
        email: 'email-invalido',
        favoriteColorId: activeColor.id,
      })
      .expect(400)
      .expect({
        message: 'Dados inválidos.',
        error: 'Bad Request',
        statusCode: 400,
      });

    await expect(prisma.client.count()).resolves.toBe(0);
  });

  it('retorna 400 para favoriteColorId inexistente', async () => {
    await request(app.getHttpServer())
      .post('/clients')
      .send({
        ...validPayload,
        favoriteColorId: '550e8400-e29b-41d4-a716-446655440999',
      })
      .expect(400)
      .expect({
        message: 'Dados inválidos.',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('retorna 400 para favoriteColorId inativo', async () => {
    await request(app.getHttpServer())
      .post('/clients')
      .send({
        ...validPayload,
        favoriteColorId: inactiveColor.id,
      })
      .expect(400)
      .expect({
        message: 'Dados inválidos.',
        error: 'Bad Request',
        statusCode: 400,
      });
  });

  it('retorna 409 para CPF já cadastrado', async () => {
    const payload = {
      ...validPayload,
      favoriteColorId: activeColor.id,
    };

    await request(app.getHttpServer())
      .post('/clients')
      .send(payload)
      .expect(201);

    await request(app.getHttpServer())
      .post('/clients')
      .send(payload)
      .expect(409)
      .expect({
        message: 'Cliente já cadastrado.',
        error: 'Conflict',
        statusCode: 409,
      });

    await expect(prisma.client.count()).resolves.toBe(1);
  });

  it('retorna cores ativas em GET /colors', async () => {
    const response = await request(app.getHttpServer())
      .get('/colors')
      .expect(200);

    expect(response.body).toEqual([
      {
        id: activeColor.id,
        name: 'Azul',
        value: 'blue',
        hex: '#0000FF',
      },
    ]);
  });

  it('retorna status simples em GET /health', async () => {
    await request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok' });
  });
});
