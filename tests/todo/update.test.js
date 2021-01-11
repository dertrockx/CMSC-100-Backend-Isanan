const { build } = require('../../junnie');
const { writeFileSync} = require('fs');
const {join} = require('path');
const {getTodos} = require('../../lib/get-todos');
require('tap').mochaGlobals();
const should = require('should');
const {delay} = require('../../lib/delay');



describe('update todos using PUT(/todo)',

() =>
{
    let app;
    const ids = [];
    const filename =join(__dirname,'../../database.json');
    const encoding = 'utf8';
    
    before(async() =>
    {
        app = await build(
            
        );
        for(let i = 0; i < 4; i++)
        {
            const response = await app.inject({
                method: 'POST',
                url:'/todo',
                payload: {
                    text: `Todo ${i}`,
                    done: false
                }
            });
            const payload = response.json();
            const {data} = payload;
            const {id} = data;
            ids.push(id);
            await delay(1000);
        }
    });

    after(async()=>
    {
        const todos = getTodos(filename,encoding);
        for (const id of ids)
        {
            const index = todos.findIndex(todo => todo.id == id);
            if(index >= 0)
            {
                todos.splice(index,1);
            }

            writeFileSync(filename,JSON.stringify({todos},null,2),encoding);
        }
    });

    it('it should return {success:true, data:todo} with method PUT, statusCode is 200, updates the item',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/${ids[0]}`,
            payload:
            {
                text:"new todo",
                done:true
            }
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        const {text,done,id} = data;
        success.should.equal(true);
        statusCode.should.equal(200);
        
      
        const todos = getTodos(filename,encoding);
        const index = todos.findIndex(todo => todo.id === id);
        const todo = todos[index];
        text.should.equal('new todo');
        done.should.equal(true);

        text.should.equal(todo.text);
        done.should.equal(todo.done);
        todo.should.equal(todo.id);
    });

    it('it should return {success:true, data:todo} with method PUT, statusCode is 200,updates the text only',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/${ids[1]}`,
            payload:
            {
                text:"new todo 1"
            }
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        const {text,done,id} = data;
        success.should.equal(true);
        statusCode.should.equal(200);
        
      
        const todos = getTodos(filename,encoding);
        const index = todos.findIndex(todo => todo.id === id);
        const todo = todos[index];
        

        text.should.equal('new todo 1');
        done.should.equal(false);

        text.should.equal(todo.text);
        done.should.equal(todo.done);
        todo.should.equal(todo.id);
    });



    it('it should return {success:true, data:todo} with method PUT, statusCode is 200, updates the done item only',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/${ids[2]}`,
            payload:
            {
                done:true
            }
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        const {text,done,id} = data;
        success.should.equal(true);
        statusCode.should.equal(200);
        
      
        const todos = getTodos(filename,encoding);
        const index = todos.findIndex(todo => todo.id === id);
        const todo = todos[index];
        

        done.should.equal(true);

        text.should.equal(todo.text);
        done.should.equal(todo.done);
        todo.should.equal(todo.id);
    });


    it('it should return {success:false, message:error message} with method PUT, statusCode is 404, the id of the todo is non-existing',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/non-existing-id`,
            payload:
            {
                text:'new todo',
                done:true
            }
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,code,message} = payload;

        success.should.equal(false);
        statusCode.should.equal(404);
        
      
        should.exists(code);
        should.exists(message);
    });



    it('it should return {success:false, data:error message} with method PUT, statusCode is 200',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/${ids[3]}`,
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,code,message} = payload;
        const {text,done,id} = data;
        success.should.equal(true);
        statusCode.should.equal(200);
        
      
        const todos = getTodos(filename,encoding);
        const index = todos.findIndex(todo => todo.id === id);
        const todo = todos[index];
        

        text.should.equal('new todo 1');
        done.should.equal(false);

        console.log('payload:',payload);
        text.should.equal(todo.text);
        done.should.equal(todo.done);
        todo.should.equal(todo.id);
    });



    it('it should return {success:false, data:todo} with method PUT, statusCode is 404',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/non-existing-ID`,
            payload:
            {
                text:"new todo 1",
                done:true
            }
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,code,message} = payload;
        const {text,done,id} = data;
        success.should.equal(false);
        statusCode.should.equal(404);
        
      

        text.should.equal(todo.text);
        done.should.equal(todo.done);
        todo.should.equal(todo.id);
        should.exists(code);
        should.exists(message);
    });


    it('it should return {success:false, data:todo} with method PUT, statusCode is 400 since no payload was given',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/${ids[3]}`,
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,code,message} = payload;
    
        success.should.equal(false);
        statusCode.should.equal(400);

        should.exists(code);
        should.exists(message);

    });

    it('it should return {success:false, data:error message} with method PUT, statusCode is 400 since a payload exists but no text or done attribute',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/${ids[3]}`,
            payload:{}
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,code,message} = payload;
        
        success.should.equal(false);
        statusCode.should.equal(400);
        
      
        should.exists(code);
        should.exists(message);
    });


    
});