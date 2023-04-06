import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {secret, hashSecret,saltRounds, usernamePattern, passwordPattern} from '../config/auth.config.js';
import userModel, { UserType } from '../models/user.model.js';

class AuthController
{
    private jwt
    private secret
    private hashSecret 
    private saltRounds 
    
    constructor()
    {
        this.jwt = jwt;
        this.secret = secret;
        this.hashSecret = hashSecret;
        this.checkCredentials = this.checkCredentials.bind(this);
        this.checkToken = this.checkToken.bind(this);
        this.generateToken = this.generateToken.bind(this);
        this.checkUsername = this.checkUsername.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.login = this.login.bind(this);
        this.me = this.me.bind(this);
    }

    async login(req,res,next)
    {
        const {username,password} = req.body;
        if(username&&password)
        {
            if(this.checkPassword(password),this.checkUsername(username))
            {
                if(await this.checkCredentials(username,password))
                {
                    const token = this.generateToken(username);
                    res.status(200).send(token);
                }
                else
                {
                    res.status(400).send('Not such user');
                }
            }  
            else
            {
                res.status(400).send("Invalid username or password");
            }
        }
        else
        {
            res.status(400).send("Missing required data in body: username or password")
        }
    }

    async me(req,res)
    {
        if(req.body.token)
        {
            const username = this.checkToken(req.body.token);
            res.status(200).send(username);
        }
        else
        {
            res.status(400).send('Missing token')
        }
    }

    public generateToken(username:string):string
    {
        if(username)
        {
            const token = this.jwt.sign(username,this.secret);
            return token;
        }
        else
        {
            throw "Missing requiered argument";
        }
    }

    public checkToken(token:string):string
    {
        if(token)
        {
            try
            {
                const result = this.jwt.verify(token,this.secret);
                return result;
            }
            catch(err)
            {
                return '';
            }
        }
        else
        {
            throw "Missing requiered argument token"
        }
    }

    public async checkCredentials(username:string,password:string):Promise<boolean>
    {
        if(username&&password)
        {
            const users:UserType[] = await userModel.find({username:username});
            let user;
            if(Array.isArray(users)) 
            {
                user = users[0];
            }
            else 
            {
                user=false;
            }
            if(user) 
            {
                const result = bcrypt.compareSync(password,user.password);
                return result;
            }
            else
            {
                return false;
            }
        }
        else
        {
            throw 'Missing requiered argument(s)';
        }
    }

    public hash(password:string)
    {
        if(password)
        {
            const salt = bcrypt.genSaltSync(this.saltRounds);
            const hash = bcrypt.hashSync(password,salt)
            return hash;    
        }
        else
        {
            throw 'Missing requiered argument';
        }
        
    }

    public checkUsername(username:string):boolean
    {
        if(username)
        {
            if(username.match(usernamePattern))
            {
                return true;
            }
            else
            {
                return false
            }
        }
        else
        {
            throw 'Missing requiered argument username'
        }
    }

    public checkPassword(password:string):boolean
    {
        if(password)
        {
            if(password.match(passwordPattern))
            {
                return true;
            }
           else
           {
                return false;
           }
        }
        else
        {
            throw 'Missing requiered argument unhashed password'
        }
    }
}

const authController = new AuthController();
export default authController;