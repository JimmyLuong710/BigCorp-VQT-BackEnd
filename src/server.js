import WebService from "./services/WebService";
import DbService from "./services/DbService";

const startServer = () => {
  WebService.start();
  DbService.connect();
};

startServer();
