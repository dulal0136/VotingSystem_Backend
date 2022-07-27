const express = require('express');
const cors = require('cors');


const port = 4000;
const app = express();
const api = require('./routers/api');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use('/api',api);
app.listen(port,()=>{
    console.log(`Server started at ${port}`);
});