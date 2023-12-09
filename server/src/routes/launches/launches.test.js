const request = require('supertest')
const app = require('../../app')
const {
    mongoConnect,
    mongoDisconnect
} = require('../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');

describe('Test our launches API', () => {

    beforeAll(async() => {
        await mongoConnect();
        await loadPlanetsData();
    });

    afterAll(async() => {
        await mongoDisconnect();
    });

    describe('Test GET /v1/launches', () => {
        test('It should respond with 200 success', async() => {
            await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200)
        })
    })
    
    
    describe('Test POST /v1/launches',() => {
    
        const launchData = {
            mission: "ETS 123",
            rocket: "Bundler 9T5",
            target: "Kepler-62 f",
            launchDate: "Febuary 22, 2023"
        }
    
        const launchDataWithoutDate = {
            mission: "ETS 123",
            rocket: "Bundler 9T5",
            target: "Kepler-62 f",
        }
    
        const launchDataWithoutMission = {
            rocket: "Bundler 9T5",
            target: "Kepler-62 f",
            launchDate: "Febuary 22, 2023"
        }
    
        const launchDataWithInvalidDate = {
            mission: "ETS 123",
            rocket: "Bundler 9T5",
            target: "Kepler-62 f",
            launchDate: "hello"
        }
    
        test('It should respond with 201 created', async() => {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchData)
            .expect('Content-Type', /json/)
            .expect(201);
    
            const responseBody = response.body;
    
            const requestDate = new Date(launchData.launchDate).valueOf()
            const responseDate = new Date(responseBody.launchDate).valueOf()
    
            expect(requestDate).toBe(responseDate)
            expect(responseBody).toMatchObject(launchDataWithoutDate)
        })
    
    
    
        test('It should catch missing required properties', async() => {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutMission)
            .expect('Content-Type', /json/)
            .expect(400);
    
            expect(response.body).toStrictEqual({
                error: "Missing launch property"
            })
        })
    
    
        test('It should catch invalid dates', async() => {
            const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithInvalidDate)
            .expect('Content-Type', /json/)
            .expect(400)
    
            expect(response.body).toStrictEqual({
                error: "Invalid type date.",
            })
        })
    })
})
