const axios = require("axios");
require("dotenv").config();

async function Wheather(params, resp){

    const{lat, long , days} = params.body ;
    let url = `https://${process.env.WHEATHER_BASE_URL}lat=${lat}&lon=${long}&cnt=${days}&appid=${process.env.API_KEY}`
    console.log(url);
    try {
      const response = await axios.get(url);
      resp.json(response.data);
    }catch(error){
      resp.status(500).json({error: "Erro na consulta!"})

    };
}

module.exports = {Wheather}