import { executeTransaction, getExtract } from "./service";
import { Router, Request, Response, NextFunction } from "express";

const router = Router();

router.get('/', (req, res) => {
  res.send('Hello, world!');
});

router.post('/clientes/:id/transacoes', (req : Request, res: Response, _ : NextFunction) => {
  try {
    const { id } = req.params;
    const { valor, descricao, tipo } = req.body;

    executeTransaction({
      id,
      valor,
      descricao,
      tipo
    });

    res.status(201).send();
  } catch (error) {
    res.status(422).send();
  }
});

router.get('/clientes/:id/extrato', (req : Request, res: Response, _ : NextFunction) => {
  try{
    const { id } = req.params;

    getExtract(id);
    
    res.status(200).send();
  }catch(error){
    res.status(422).send();
  }
});

export { router };