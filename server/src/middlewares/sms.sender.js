const { default: axios } = require("axios")

module.exports = async (txt,  phone) =>{
    return await axios.post(`http://185.8.212.184/smsgateway/`,{
        login: 'sharqiy',
        password: 'n7qV76XROm51Fk19G4Gn',
        data: `[{"phone":"998${phone}","text": "Sharqiy.uz -> ${txt}"}]`
    })
}