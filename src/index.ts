import dotenv from 'dotenv';
import chalkAnimation from 'chalk-animation';
import moment from 'moment';
import chalk from 'chalk';
import { io } from "socket.io-client";
import axios from 'axios'

console.clear()
dotenv.config();
const SERVER_IP = process.env.IOTSERVER==undefined?'localhost': process.env.IOTSERVER
let SERVER_READY=true;
let CLIENT_STATUS_ONLINE=true

function start(){

   
    let time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const rainbow = chalkAnimation.karaoke('Loading Data');
    SERVER_READY=true
    let Handler = setInterval(async () => {
        try{
            if(SERVER_READY==true){
                CLIENT.on('power_off',()=>{
                    if (CLIENT_STATUS_ONLINE==true){
                        CLIENT_STATUS_ONLINE=false
                        CLIENT.disconnect()
                        clearInterval(Handler)
                        console.log(chalk.yellow("CLIENT GOING INTO SLEEP"))
                    }else{
                        CLIENT_STATUS_ONLINE=true
                        start()
                        console.clear()
                        console.log(chalk.bgRedBright("Server Ready to Serve"))
                    }
                })
                SERVER_READY=false
                clearInterval(Handler)
            rainbow.replace(`Sending Packets ... [${moment().format('D-MMMM-YYYY, h:mm:ss a')}]`)
            let data = await axios.get('http://3.109.76.78:2222/xenergyData.json',{
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            })
            console.clear()
            console.log(chalk.bgRedBright("Server Busy"))
            CLIENT.emit("data",data.data);
            }
        }
        catch(e:any){
            console.log(e)
        }
    }, 1000);
}


console.log(chalk.bgYellow.black('Starting Iot Client , Waiting for Socket Server to Respond',SERVER_IP))
const CLIENT = io(SERVER_IP,{
autoConnect:true,
extraHeaders: {
    "client_type":'1'
}})

CLIENT.on('ready_to_serve',()=>{
    SERVER_READY=true
    start()
    console.clear()
    console.log(chalk.bgRedBright("Server Ready to Serve"))
})


CLIENT.on("connect", () => {

    const engine = CLIENT.io.engine;






    console.clear()
    console.log(chalk.bgMagenta('Connected to Server , Waiting for Server to be Operational')) 
    // console.log(chalk.bgGray.black('Accessing Packets'))
    engine.on("close", (reason) => {
        clearTimeout(MainStart)
        console.clear()
        console.log(chalk.redBright("Client Closed the Server"));
        console.log(chalk.redBright("Trying to Reconnect"));
      });
    let MainStart = setTimeout(()=>{
        console.clear();
        start();
    },2000)

});