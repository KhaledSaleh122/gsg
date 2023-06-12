import express, { json } from 'express';

const app = express();
app.use(json());
const arr = [];
let highestPriorty;
app.get('/tasks',(req,res)=>{
  res.end(JSON.stringify(arr));
})

app.post('/tasks',(req,res)=>{
  const {id , name,priority} = req.body;
  if(!isNaN(Number(id)) && name && !isNaN(Number(priority))){
    if(!isIdExists(id)){
      isPriorityExist(priority);
      arr.push({id,name,priority});
      res.end("Task Created Successfully.");
    }else{
      res.end("Task id exist");
    }
  }else{
    res.end("Please ensure you input all the data correctly");
  }
})

app.get('/tasks/:id', (req, res, next) => {
  const {id} = req.params;
  if (!isNaN(Number(id))){
    if(isIdExists(id)){
      const taskIndex = arr.findIndex((obj)=> obj.id === id);
      res.end(JSON.stringify(arr[taskIndex]));
    }else{
      res.end('Task id not exist');
    }
  }else{
    res.end("Please ensure you input the id");
  }
});

app.put('/tasks/:id',(req,res)=>{
  const {id} = req.params;
  const {name,priority} = req.body;
  if (!isNaN(Number(id))){
    if(isIdExists(id)){
      const taskIndex = arr.findIndex((obj)=> obj.id === id);
      if(name){
        arr[taskIndex].name = name;
      }
      if(priority){
        swapPriority(priority,taskIndex);
      }
      res.end('Task updated successfully.');
    }else{
      res.end('Task id not exist');
    }
  }else{
    res.end("Please ensure you input the id");
  }
})


app.delete('/tasks/:id',(req,res)=>{
  const {id} = req.params;
  if (!isNaN(Number(id))){
    if(isIdExists(id)){
      const taskIndex = arr.findIndex((obj)=> obj.id === id);
      arr.splice(taskIndex,1);
      res.end('Task deleted successfully.');
    }else{
      res.end('Task id not exist');
    }
  }else{
    res.end("Please ensure you input the id");
  }
})


function isIdExists(id) {
  const x = arr.find((obj) => obj.id === id);
  return x ? true:false;
}

function swapPriority(priority,taskIndex){
  const index = arr.findIndex((obj) => obj.priority === priority);
  if(index === -1){
      if (priority > highestPriorty) { highestPriorty = priority }
  }else{
      arr[index].priority = arr[taskIndex].priority;
  }
  console.log(arr);
  arr[taskIndex].priority = priority;
}

function isPriorityExist(priority) {
  const index = arr.findIndex((obj) => obj.priority === priority);
  if (index === -1) {
      if (!highestPriorty) { highestPriorty = priority; }
      if (priority > highestPriorty) { highestPriorty = priority }
  } else {
      arr[index].priority = ++highestPriorty;
  }
}


app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);
