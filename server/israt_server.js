import express from "express";
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.ISRAT_API_KEY,
});
const openai = new OpenAIApi(configuration);

//initial express application
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async(req, res) =>{
    res.status(200).send({
        message: 'Hallo from Israt ',
    })
});
//get the data from the Body 
app.post('/', async(req, res)=>{
    try{
        const prompt = req.body.prompt;
        //create response 
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.7,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        //As soon as we get a response,
        // we will send at the frond end
        res.status(200).send({
            israt_icon: response.data.choices[0].text
        })
    }catch(error){
        console.log(error);
        res.status(500).send({error})
    }
})
//make sure server is listen
app.listen(5000,()=> 
console.log('Server is runnig on port  http://localhost:5000'));