import express from 'express';
const ROUTER = express.Router();

ROUTER.get('/', (req, res) => {
  res.send('Index');
});

export default ROUTER;