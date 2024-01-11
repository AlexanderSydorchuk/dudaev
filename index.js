const fastify = require("fastify")({logger: true});

//managers
const targetManager = require("./managers/targetManager");
const settingsManager = require("./managers/settingsManager");

const {Worker} = require('node:worker_threads');

/**
 * Global gun worker, used to start and kill process.
 */
let GlobalGunWorker;

fastify.get('/', function handler(request, response) {
    response.send({hello: 'world'})
})

/**
 * Status of vehicle.
 */
fastify.get('/status', function handler(request, response) {
    response.send({raid: GlobalGunWorker === null})
})

fastify.post('/setup', function handler(request, response) {
    const data = request.body;
    settingsManager.writeAll(data);

    response.send({message: "Setup finished"})
})
//====================== TARGETS ======================//

/**
 * Get current targets.
 */
fastify.get('/targets', function handler(request, response) {
    response.send(targetManager.get())
})

/**
 * Adds target.
 */
fastify.post('/targets/add', function handler(request, response) {
    const t = request.body.target;
    response.send({body: targetManager.add(t)})
})

/**
 * Removes target.
 */
fastify.post('/targets/remove', function handler(request, response) {
    const t = request.body.target;
    response.send({body: targetManager.remove(t)})
})

/**
 * Clears targets file.
 */
fastify.delete('/targets', function handler(request, response) {
    targetManager.clear();
    response.send([]).status(204);
})

//====================== GUNS ======================//

/**
 * Set attack method (gun)
 */
fastify.post('/raid/method', function handler(request, response) {
    if (!GlobalGunWorker) {
        const method = request.body.method;
        const success = settingsManager.setMethod(method);

        if (success) {
            response.send({success: success});
        } else {
            response.status(403).send({error: "Make sure that selected method exists"});
        }
    } else {
        response.status(403).send({error: "Stop attack first"});
    }
})

/**
 * Start the raid with previously selected method (gun)
 */
fastify.post('/raid/start', async function handler(request, response) {

    const password = request.body.password;

    if (process.env.PASSWORD === password) {
        //select method
        switch (settingsManager.getMethod()) {
            case "fast": {
                GlobalGunWorker = new Worker("./workers/fastWorker.js");

                break;
            }
            case "bypass": {
                GlobalGunWorker = new Worker("./workers/bypassWorker.js");

                break;
            }
            default: {
                response.status(404).send({message: "Wrong gun name"});
            }
        }

        response.send({message: "Raid started"});
    } else {
        response.status(404).send({message: "Something went wrong"});
    }

})

fastify.post('/raid/stop', function handler(request, response) {
    const password = request.body.password;

    if (GlobalGunWorker) {
        if (process.env.PASSWORD === password) {
            GlobalGunWorker.terminate();
            GlobalGunWorker = null;

            response.send({message: "Raid stopped!"});
        } else {
            response.status(401).send({message: "wrong password"});
        }
    } else {
        response.status(200).send({message: "Raid is already stopped!"});
    }
});


// Run the server!
fastify.listen({port: 3000}, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})