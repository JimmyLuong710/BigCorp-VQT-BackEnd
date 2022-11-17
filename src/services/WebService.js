import express from "express";
import bodyParser from "body-parser";
import viewConfig from "../config/view.config";
import mainRouter from '../routes'
import errorHandler from '../middlewares/error.middleware'
import cors from "cors";

let port = process.env.PORT || 8000;
let app = express();

class WebService {

  static start() {
    app.use(
      cors({
        credentials: true,
        // origin: process.env.REACT_URL,
      })
    );
    app.set("trust proxy", 1); 
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    viewConfig(app)
    app.get("/", (req, res) => {
      res.send("WELCOME TO OUR WEBSITE");
    });
    app.use('/api/v1', mainRouter)
    app.use(errorHandler)
    app.use((req, res) => {
      res.send("THIS PAGE DOES NOT EXIST");
    });

    app.listen(port, () => {
      console.log("Server is running on the port : " + port);
    });
  }
}

module.exports = WebService