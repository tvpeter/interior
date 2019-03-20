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

        let user ;
        beforeEach(()=> {
       user = { name: "user name", email:  "email@email.com", 
                    phone: "12345678901", password :'password', password_confirmation: 'password' };
        });

        const exec = async () => {
            return await request(server).post('/users').send(user);
        }

        it('it should return error 400 if all fields are not filled', async ()=>{
           user.password = undefined;
            const result = await exec();
            expect(result.status).toBe(400);
        });
        it('should return error 400 if name of user is less than 4 characters', async ()=>{
            user.name = '123';

            const result = await exec();
            expect(result.status).toBe(400);

        });
       it('should return error 400 if password is less than 6 characters', async ()=> {
            user.password = '12345';

            const result = await exec();
            expect(result.status).toBe(400);
       });

       it('should return error 409 if given email already exist', async ()=>{
           const newUser = new User({
                name: 'New User',  email : 'email@email.com',
                phone: '1234567827234', password: 'password' });
           await newUser.save();

           const result = await exec();
           expect(result.status).toBe(409);
       });

       it('should return error 409 if given phone already exist', async ()=>{
        const newUser = new User({
             name: 'New User',  email : 'email@email.com',
             phone: '1234567827234', password: 'password' });
        await newUser.save();

        user.phone = '1234567827234';

        const result = await exec();
        expect(result.status).toBe(409);
    });

    it('should return 200 if request is valid', async ()=>{
        
        const result = await exec();
        expect(result.status).toBe(200);
    });

    });

});