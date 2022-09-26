import dotenv from 'dotenv';
import chalkAnimation from 'chalk-animation';
import moment from 'moment';
import chalk from 'chalk';




function start(){
    dotenv.config();
    let server_ip = process.env.IOTSERVER
    console.clear();
    let time = moment().format('MMMM Do YYYY, h:mm:ss a');
    const rainbow = chalkAnimation.rainbow('Loading Data');
    setInterval(() => {
        rainbow.replace(`Sending Packets ... To ${server_ip} [${moment().format('MMMM Do YYYY, h:mm:ss a')}]`)
    }, 1000);
}

console.log(chalk.bgYellow.black('Starting Iot Client'))
console.log(chalk.bgGray.black('Accessing Packets'))

setTimeout(start,2000)