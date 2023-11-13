const request = require('supertest')
const app = require('../../app')

describe('Test GET /launches', () => {
    test('It should respond with 200 success', async() => {
        await request(app)
        .get('/launches')
        .expect('Content-Type', /json/)
        .expect(200)
    })
})


describe('Test POST /launches',() => {

    const launchData = {
        mission: "ETS 123",
        rocket: "Bundler 9T5",
        target: "Kepler-186 f",
        launchDate: "Febuary 22, 2023"
    }

    const launchDataWithoutDate = {
        mission: "ETS 123",
        rocket: "Bundler 9T5",
        target: "Kepler-186 f",
    }

    const launchDataWithoutMission = {
        rocket: "Bundler 9T5",
        target: "Kepler-186 f",
        launchDate: "Febuary 22, 2023"
    }

    const launchDataWithInvalidDate = {
        mission: "ETS 123",
        rocket: "Bundler 9T5",
        target: "Kepler-186 f",
        launchDate: "hello"
    }

    test('It should respond with 201 created', async() => {
        const response = await request(app)
        .post('/launches')
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
        .post('/launches')
        .send(launchDataWithoutMission)
        .expect('Content-Type', /json/)
        .expect(400);

        expect(response.body).toStrictEqual({
            error: "Missing launch property"
        })
    })


    test('It should catch invalid dates', async() => {
        const response = await request(app)
        .post('/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400)

        expect(response.body).toStrictEqual({
            error: "Invalid type date.",
        })
    })
})