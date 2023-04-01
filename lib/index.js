import chalk from 'chalk';
import open from 'open';
import express from 'express';
import fs from 'fs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 4516
const CLIENT_ID ='ade80b4b86074693b0fcd2f4691a5cee'
const SHOW_DIALOG = false
const SCOPE = [
  'user-read-private',
  'user-read-email',
  'user-top-read',
].join('%20')


const REDIRECT_URI = 'http://localhost:' + PORT + '/callback'

const URL =
  'https://accounts.spotify.com/authorize'
  + '?client_id=' + CLIENT_ID
  + '&response_type=token'
  + '&scope=' + SCOPE
  + '&redirect_uri=' + REDIRECT_URI

const app = express()
app.get('/callback', async (req, res) => {
  res.sendFile(__dirname + '/callback.html')
  if (req.query.error) {
    console.log(chalk.red('Something went wrong. Error: '), req.query.error)
  }
})
app.get('/token', (req, res) => {
  const rtoken = req.query.access_token
  let expirein = req.query.expires_in
  let now = new Date();
  const later = new Date(now.getTime() + 60 * 60 * 1000);
  if (rtoken) {
    res.send('<script>window.close();</script>');
    const data = {
      'expires-token': later,
      'access-token': rtoken,
    };
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.end()
  } else {
    res.sendStatus(400)
  }
})

const main = async (SHOW_DIALOG) => {
    open(URL
      + '&show_dialog=' + SHOW_DIALOG)
  }
app.listen(PORT);
export {main};