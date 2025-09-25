import dotenv from"dotenv"
dotenv.config()
import app from "./src/app.js"


const PORT = process.env.PORT || 8888 

app.listen(PORT, () => {
    console.log(`server is running in port ${PORT}`);
})