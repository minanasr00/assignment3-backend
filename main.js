//1
{
    const fs = require('fs');
    const path = require('path');
    filePath = path.resolve("./main.html")
    const readStream = fs.createReadStream(filePath,{encoding: 'utf8'});
    readStream.on('data', (chunk) => {
        console.log(chunk);
    } ) 
}
//2
{
    const fs = require('node:fs');
    const path = require('node:path');
    filePath = path.resolve("./main.html")
    const readStream = fs.createReadStream(filePath,{encoding: 'utf8'});
    const writeStream = fs.createWriteStream('./output.txt');
    readStream.on('data', (chunk) => {
        writeStream.write(chunk);
    
    }).on('end', () => {
        console.log('File read and written successfully.');
    })
}
//3
{
    const fs = require('node:fs');
    const path = require('node:path');
    const zlib = require('zlib');
    filePath = path.resolve("./main.html")
    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const writeStream = fs.createWriteStream('./compressed.gz'); 
    readStream.pipe(zlib.createGzip()).pipe(writeStream) 
}




//part two
{
    const http = require('node:http'); 
    const fs = require('node:fs');
    const path = require('node:path');
    let port = 3000;
    
    const server = http.createServer((req, res) => {
        const { url, method } = req;
        
        if (url === '/user' && method === 'POST') {
            const filePath = path.resolve('./users.json');
            const rawData = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(rawData || '[]');
            const writeStream = fs.createWriteStream(filePath,);
            req.on('data', (chunk) => {
                newUser = {id: Date.now(), ...JSON.parse(chunk.toString()) };
                if (data.some((user) => user.email === newUser.email) === true) {
                    writeStream.write(JSON.stringify(data));
                    res.writeHead(409, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ message: 'User already exists' }));
                    res.end();
                } else {
                    data.push(newUser);
                    writeStream.write(JSON.stringify(data));
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ message: 'User data saved successfully' }));
                    res.end();
                }
            })
        } else if (url === `/users/${url.split('/')[2]}` && method === 'PATCH') { 
            userId = Number(url.split('/')[2]);
            const filePath = path.resolve('./users.json');
            const rawData = fs.readFileSync(filePath, 'utf-8');
            let data = JSON.parse(rawData || '[]');
            if (data.some((user) => user.id === userId) === false) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ message: 'User not found' }));
                res.end();
            } else {
                let user = data.find((user) => user.id === userId);
                data = data.filter((user) => user.id !== userId);
                console.log(user);
                req.on('data', (chunk) => { 
                    const updates = JSON.parse(chunk?.toString() || '{}');
                    updatedUser = { ...user, ...updates };
                    data.push(updatedUser);
                    const writeStream = fs.createWriteStream(filePath);
                    writeStream.write(JSON.stringify(data));
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.write(JSON.stringify({ message: 'User data updated successfully' }));
                    res.end();
                })
            }
        } else if (url === `/users/${url.split('/')[2]}` && method === 'DELETE') {
            userId = Number(url.split('/')[2]);
            const filePath = path.resolve('./users.json');
            const rawData = fs.readFileSync(filePath, 'utf-8');
            let data = JSON.parse(rawData || '[]');
            if (data.some((user) => user.id === userId) === false) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ message: 'User not found' }));
                res.end();
            } else {
                data = data.filter((user) => user.id !== userId);
                const writeStream = fs.createWriteStream(filePath);
                writeStream.write(JSON.stringify(data));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ message: 'User deleted successfully' }));
                res.end();
            }

        } else if (url === '/users' && method === 'GET') {
            const filePath = path.resolve('./users.json');
            const readStream = fs.createReadStream(filePath, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            readStream.on('data', (chunk) => {
                console.log(chunk);
                res.write(chunk);
                res.end();
             })

        } else if (url === '/' && method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write('<h1>Welcome to the User Management API</h1>');
            res.end();
        } else if (url === `/user/${url.split('/')[2]}` && method === 'GET') {
            userId = Number(url.split('/')[2]); 
            filePath = path.resolve('./users.json');
            const rawData = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(rawData || '[]');
            if (data.some((user) => user.id === userId) === false) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({ message: 'User not found' }));
                res.end();
            } else {
                const user = data.find((user) => user.id === userId);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify(user));
                res.end();
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ message: 'Route not found' }));
            res.end();
        }
    });

    server.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });

    server.on('error', (err) => { 
        console.log({ err });
        server.listen(++port);
    })    
}
//https://web.postman.co/workspace/My-Workspace~e07108d1-7b3b-4751-828c-a8256e4484b8/collection/41349421-1e8e632a-7f58-4008-a9a1-7bd3ff4c965c?action=share&source=copy-link&creator=41349421


//part three
// 1-What is the Node.js Event Loop?
//the node.js event loop is a mechanism that allows node.js to perform non-blocking I/O operations,
//despite the fact that JavaScript is single-threaded It enables node.js to handle multiple operations concurrently by offloading tasks to the system

// 2-What is Libuv and What Role Does It Play in Node.js?
//libuv is a library that provides node.js with an event-driven architecture and a thread pool for handling asynchronous operations.

// 3- How Does Node.js Handle Asynchronous Operations Under the Hood?
//node.js uses the event loop and libuv to manage asynchronous operations. When an asynchronous operation is initiated, it is give it to the system or thread pool
// allowing the main thread to continue executing other code. Once the operation is complete a callback function is added to the Event Loop's queue which is then executed when the main thread is free.

// 4- What is the Difference Between the Call Stack, Event Queue, and Event Loop in Node.js?
//the call stack is where the JavaScript engine keeps track of function calls and executes them in a LIFO manner.
//the event queue is a queue that holds callback functions for asynchronous operations that are ready to be executed.
//the event loop is a mechanism that continuously checks the Call Stack and Event Queue

//5-What is the Node.js Thread Pool and How to Set the Thread Pool Size?
//the node.js thread pool is a pool of worker threads that libuv uses to handle asynchronous operations
//you can set the thread pool size by setting the UV_THREADPOOL_SIZE environment variable

//6-How Does Node.js Handle Blocking and Non-Blocking Code Execution?
//node.js handles blocking code execution by executing it on the main thread which can cause delays in processing other requests
//non-blocking code execution is handled by event loop that gives tasks to the system or thread pool allowing the main thread to continue executing other code