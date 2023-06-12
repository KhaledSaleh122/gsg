import http from "http";
const database = [];

let highestPriorty;
const server = http.createServer(async (req, res) => {
    if (req.method === "POST" && req.url === "/tasks") {
        try {
            const promis = await new Promise((resolve, reject) => {
                let data = "";
                req.on("data", (d) => {
                    data += d;
                }).on('end', () => {
                    try {
                        const taskInfo = JSON.parse(data);
                        taskInfo.id = Number(taskInfo.id);
                        taskInfo.priority = Number(taskInfo.priority);
                        if (isNaN(taskInfo.id) || typeof taskInfo.name !== "string" || isNaN(taskInfo.priority)) { throw "Please ensure you send all information." }
                        if(isIdExists(taskInfo.id)){throw "The Id is Exist."};
                        isPriorityExist(taskInfo.priority);
                        //adding task
                        database.push(taskInfo);
                        resolve("Task added successfully.");
                    } catch (err) {
                        reject(err);
                    }
                })
            })
            res.end(promis);
        } catch (err) {
            console.log(database);
            res.end(err.toString());
        }
    } else if (req.method === "PUT" && req.url.startsWith("/tasks/")) {
        let data = "";
        req.on("data", (d) => {
            data += d;
        }).on('end', () => {
            try{
                const taskInfo = JSON.parse(data);
                taskInfo.id = Number(req.url.split('/')[2]);
                taskInfo.priority = Number(taskInfo.priority);
                if (isNaN(taskInfo.id)) { throw "Please ensure you send the id." }
                if(!isIdExists(taskInfo.id)){throw "This id is not exist"};
                const taskIndex = database.findIndex((obj)=> obj.id === taskInfo.id);
                if(!isNaN(taskInfo.priority)){swapPriority(taskInfo.priority,taskIndex);}
                //update task name
                if(taskInfo.name){database[taskIndex].name = taskInfo.name}
                res.end("Task updated successfully.");
            }catch(err){
                res.end(err.toString());
            }
        })
    }else if (req.method === "GET" && req.url === "/tasks"){
        res.end(JSON.stringify(database));
    }else if (req.method === "GET" && req.url.startsWith("/tasks/")){
        try{
            const id = Number(req.url.split('/')[2]);
            if (isNaN(id)) { throw "Please ensure you send the id." }
            if(!isIdExists(id)){throw "This id is not exist"};
            const taskIndex = database.findIndex((obj)=> obj.id === id);
            res.end(JSON.stringify(database[taskIndex]));
        }catch(err){
            res.end(err.toString());
        }
    }else if (req.method === "DELETE" && req.url.startsWith("/tasks/")){
        let data = "";
        req.on("data", (d) => {
            data += d;
        }).on('end', () => {
            try{
                const taskInfo = JSON.parse(data);
                taskInfo.id = Number(req.url.split('/')[2]);
                if (isNaN(taskInfo.id)) { throw "Please ensure you send the id." }
                if(!isIdExists(taskInfo.id)){throw "This id is not exist"};
                const taskIndex = database.findIndex((obj)=> obj.id === taskInfo.id);
                database.splice(taskIndex,1);
                res.end("Task deleted successfully.");
            }catch(err){
                res.end(err.toString());
            }
        })
    }
    console.log(database);
}).listen(8080);

function isIdExists(id) {
    const x = database.find((obj) => obj.id === id);
    return x ? true:false;
}

function isPriorityExist(priority) {
    const index = database.findIndex((obj) => obj.priority === priority);
    if (index === -1) {
        if (!highestPriorty) { highestPriorty = priority; }
        if (priority > highestPriorty) { highestPriorty = priority }
    } else {
        database[index].priority = ++highestPriorty;
    }
}

function swapPriority(priority,taskIndex){
    const index = database.findIndex((obj) => obj.priority === priority);
    if(index === -1){
        if (priority > highestPriorty) { highestPriorty = priority }
    }else{
        database[index].priority = database[taskIndex].priority;
    }
    database[taskIndex].priority = priority;
}







