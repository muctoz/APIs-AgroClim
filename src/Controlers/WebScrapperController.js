const axios = require("axios");
require("dotenv").config();

async function WebScrapper(params, resp){

  const{Product} = params.body ;
  let url = `${process.env.URL_BASE}${Product}`
  console.log(url)
  try {
    const response = await axios.get(url)
    resp.json(response.data)
  }catch(error){
    resp.status(500).json({error: "Erro na consulta!"})
  };
}







module.exports = { WebScrapper };
