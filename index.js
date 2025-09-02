
const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./Routes/routes.js');
const dotenv = require('dotenv')

const app = express();
dotenv.config();
const PORT = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.json({message: "api working fine!"})
})
app.use('/schoolImages', express.static(path.join(process.cwd(), 'schoolImages')));


app.use('/api', routes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
