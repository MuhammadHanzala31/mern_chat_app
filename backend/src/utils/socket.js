import {Server} from 'socket.io'
import { server } from '../index.js'



const io = new Server(server , {
    cors : {
        origin : 'http://localhost:5173',

    }
})

      
        
io.on("connection", (socket)=>{
    console.log("A user is connected", socket.id)
    socket.on("disconnect", (reason)=>{
        console.log('A user is disconnected' , socket.id, reason)
        
    })
})



