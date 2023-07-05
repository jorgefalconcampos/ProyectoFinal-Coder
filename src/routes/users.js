
const ClassRouter = require('./router.js')



class UserRouter extends ClassRouter {
    init(){
        this.get('/', ['USER_PREMIUM'],(req, res)=>{
            res.sendSuccess('Hola coder')
        }) 
    }
}

module.exports = {
    UserRouter
}