const mineflayer = require('mineflayer')
const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { goals } = require('mineflayer-pathfinder')
const GoalsFollow = goals.GoalFollow

const express = require("express");
const http = require("http");

const app = express();

app.use(express.json());

app.get("/", (_, res) => res.send("hi"));
app.listen(process.env.PORT);

setInterval(() => {
    http.get(`http://${process.env.PROJECT_DOMAIN}.herokuapp.com/`);
}, 180000);


///////// instead of starting your program with just "$node filename.js" you start it with "$node filename.js host port username password" in terminal.
// const bot = mineflayer.createBot({
//     host: process.argv[2],
//     port: parseInt(process.argv[3]),
//     username: process.argv[4],
//     password: process.argv[5]
// })

const bot = mineflayer.createBot({
    host: 'aaron2smp.aternos.me', //server name/ip
    port: 28805, //server port
    username: `alvin-BOT`,// name the bot
    // password: ``,
    version: false, // false corresponds to auto version detection (that's the default), put for example "1.8.8" if you need a specific version
    // auth: 'mojang' // optional; by default uses mojang, if using a microsoft account, set to 'microsoft'
});

bot.loadPlugin(pathfinder)
bot.once('spawn', () => {
    // botLook()
    bot.on('chat', (username, message) => {
        if (username === bot.username) return

        switch (message) {
            case 'sleep':
                goToSleep()
                break
            case 'wakeup':
                wakeUp()
                break
            case 'come':
                followMe()
                break
            case 'stop follow me':
                stopFollowMe()
                break
            case 'jump':
                startCount()
                break
            case 'stop jumping':
                stopCount()
                break
            case 'fishing':
                onFishing()
                break
            case 'look':
                botLook()
                break
        }       
    })
});
var b = 0;
var t;
var time_on = 0;
function counter(){
    b = b + 1;
    t = setTimeout(counter, 1000);
    // console.log(b);
    if (b === 5){
        bot.setControlState('jump', true);
        b = 0;
        bot.setControlState('jump', false);
    }
}

function startCount() {
    if (!time_on) {
        time_on = 1;
        counter();
    }
}
function stopCount(){
    time_on = 1;
    clearTimeout(t);
}

bot.on('sleep', () => {
    bot.chat('Oyasuminasai!')
});
bot.on('wake', () => {
    bot.chat('Ohayou Gozaimasu')
});
bot.on('spawn', () => {
    onFishing()
    startCount()
});

function goToSleep() {
    const bed = bot.findBlock({
        matching: block => bot.isABed(block)
    })
    if (bed) {
        bot.sleep(bed, (err) => {
            if (err) {
                bot.chat(`Nemurenai yo!: ${err.message}`)
            } else {
                bot.chat("Watashi wa nemutte iru")
            }
        })
    } else {
        bot.chat('Chikaku no beddo wa arimasen')
    }
}

function wakeUp() {
    bot.wake((err) => {
        if (err) {
            bot.chat(`Me ga samenai.: ${err.message}`)
        } else {
            bot.chat('Okita')
        }
    })
}

function followMe(){
    const target = bot.players['Aqirito']
    if (!target) {
        bot.chat('I don\'t see you !')
        return
    }
    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    bot.pathfinder.setMovements(movements)

    const goal = new GoalsFollow(target.entity, 3)
    bot.pathfinder.setGoal(goal, true)
}

function stopFollowMe(){
    const target = bot.players['Aqirito']
    const mcData = require('minecraft-data')(bot.version)
    const movements = new Movements(bot, mcData)
    bot.pathfinder.setMovements(movements)

    const goal = new GoalsFollow(target.entity, 3)
    bot.pathfinder.setGoal(goal, false)
}

var fishing = 0;
function onFishing() {
    bot.fish(() =>{
        fishing = 1;
        if (fishing == 1){
            newFunction()
            fishing = 0;
            onFishing()
            
        }
    },
    err =>{
        console.log('Error!', err);
    })

    function newFunction() {
        botLook()
    }
}

var is_looking = 0;
function botLook(){
    setTimeout(botLook, 300);
    bot.look(0, -0.9, true, () =>{
        is_looking = 1;
    },
    () =>{
        console.log('Error!', Error);
    })
}




bot.on("error", err => console.log(err)); //triggers when there's an error and logs it into the console

bot.on("login", () => { //triggers when the bot joins the server
    console.log(bot.username + " is online"); //logs the username of the bot when the bot is online
});
bot.on("end", () => { //triggers when the bot leaves/gets kicked
    console.log("The bot disconnected, reconnecting..."); //says "The bot disconnected, reconnecting... in console
    process.exit(0);
});
