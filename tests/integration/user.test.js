const {User} = require('../../src/models/user');
const request = require('supertest');
const mongoose = require('mongoose');


describe('Describe users', ()=> {

    let server;
    beforeEach(()=>{
        server = require('../../index');
    });
    afterEach( async ()=>{
        await User.deleteMany({});
        server.close();
    });

    describe('Create users post', ()=>{

        it('it should return error 400 if all fields are not filled', async ()=>{
            let user = {
                name: "user name",
                email:  "email@email.com",
                phone: "12345678901"
            };

            const result = await request(server).post('/users').send(user);
            expect(result.status).toBe(400);
        })

    });

});