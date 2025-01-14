import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import multer from 'multer';
import morgan from 'morgan';
import helmet from "helmet"
import path from 'path';
import { fileURLToPath } from "url";
import {register} from "./controllers/auth.js"
import authRoutes from './routes/auth.js'
import { verifyToken } from "./middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan('common'))
app.use(bodyParser.json({limit:'30mb', extended:true}));
app.use(bodyParser.urlencoded({limit:'30mb', extended:true}));
app.use(cors());
app.use("/assests", express.static(path.join(__dirname, 'public/assests')));


const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, "public/assests")
    },
    filename:function(req, file, cb){
        cb(null, file.originalname);
    }
})

const upload = multer({storage})
/* Routes*/
app.post("/auth/register", upload.single("picture"), register)
app.use("/auth", authRoutes)

const PORT = process.env.PORT || 6001
mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(PORT, ()=>console.log(`Server  Port :${PORT}`))
}).catch((error)=>console.log(`${error} did not connect`))

