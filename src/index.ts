import express, { Request, Response } from 'express';
import routes from "./routes";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!, from Sale Notes Container');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
