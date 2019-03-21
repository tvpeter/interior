 const {Service, validate} = require('../../src/models/services');
 const request = require('supertest');

 describe('Services module', ()=>{

    beforeEach(()=>{
        server = require('../../index');
    });
    afterEach( async ()=>{
        await Service.deleteMany({});
        server.close();
    });

    describe('Create a service', ()=>{

        let service;
        beforeEach(()=> {
            service = {
                title: "title of the service",
                description: "Once database and required all the necessary packages, we can now begin defining our server-side logic. We must first define our database schema"
            }
        });

        const exec = async () => {
            return await request(server).post('/services/create').send(service);
        }

        it('should return error 400 if title is not supplied', async ()=>{
            service.title = "";

            const result = await exec();
            expect(result.status).toBe(400);
        });

        it('should return error 400 if description is not supplied', async ()=> {
            service.description = "";

            const result = await exec();
            expect(result.status).toBe(400);            
        });

        it('should return error 409 if service already exist in the db', async ()=>{
            const serviceInDb = new Service({
                title: "title of the service",
                description: "This is the description of the to be failed service stated above but it has to be upto to 100 characters which hopefully it should be now"
            })
            await serviceInDb.save();

            const result = await exec();
            expect(result.status).toBe(409);
        });

        it('should create a service if all params are supplied', async()=>{
            const result = await exec();
            expect(result.status).toBe(200);
        });
        
    });



 });