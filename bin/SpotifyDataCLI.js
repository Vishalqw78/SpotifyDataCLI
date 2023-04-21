#!/usr/bin/env node
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import figlet from 'figlet';
import gradient from 'gradient-string';
import fs from 'fs';
import { main } from '../lib/index.js';
import chalkAnimation from 'chalk-animation';
import { getTopArtists, getTopTracks, getUserDetail } from '../lib/Spotify-request.js';

const dataFile = 'data.json';
let accessToken = 'null';
let expireIn = 'null';
let jsonData; // Define jsonData here

if (fs.existsSync(dataFile)) {
  const data = fs.readFileSync(dataFile, 'utf8');
  jsonData = JSON.parse(data);
  accessToken = jsonData['access-token'];
  expireIn = jsonData['expires-token'];
} else {
  const newData = { 'access-token': 'null', 'expires-token': 'null' };
  jsonData = JSON.stringify(newData);
  fs.writeFileSync(dataFile, jsonData);
}

const saveData = (data) => {
  fs.writeFileSync(dataFile, JSON.stringify(data), 'utf8');
};

const sleep = (ms = 2000) =>
  new Promise((r) =>
    setTimeout(r, ms));

async function welcome() {
  const rainbowTitle = chalkAnimation.rainbow(figlet.textSync('Spotify Data CLI \n',));

  await sleep();
  rainbowTitle.stop();
  const AuthorTitle = chalkAnimation.rainbow("by Vishal PAl");
  await sleep();
  AuthorTitle.stop();
  console.log(gradient.rainbow(`-`.repeat(60)));
  console.log(gradient('White','White').multiline(
    `\t\tThis is a command-line interface 
    \t\tfor Spotify that allows you to
    \t\tsearch for your Top Ten Songs 
    \t\tand Top 10 Artists for now`
  ));
  console.log(gradient.rainbow(`-`.repeat(60)));
  await sleep();
}

const isTokenValid = () => {
  const expiresAt = expireIn;
  if (!expiresAt) return false;
  const expired = new Date(expiresAt) < new Date();
  return !expired;
};

async function AuthorizeAndExit() {
  const answers = await inquirer.prompt({
    name: 'Welcome_1',
    type: 'list',
    message: 'Starting............\n',
    choices: ['Authorize User', 'Authorize Another User', 'Exit'],
  });
  if (answers.Welcome_1 === 'Authorize User') {
    let dateNow = Date.now();
    if (accessToken == 'null' || !isTokenValid()) {
      const spinner2 = createSpinner('You have 30 seconds to authorize').start();
      main(false);
      await timeStop();
      spinner2.stop();
      const data = fs.readFileSync(dataFile, 'utf8');
  jsonData = JSON.parse(data);
  accessToken = jsonData['access-token'];
  expireIn = jsonData['expires-token'];

      saveData({ 'access-token': accessToken, 'expires-token': expireIn });
      spinner2.success({ text: `Authorization successfully` });

      await getUserDetail(accessToken);
      await sleep();
      await dataAnalytics();
    } else {
      const spinner = createSpinner('Authorizing User').start();
      await sleep();
      spinner.success({ text: `Authorization successfully` });
      await getUserDetail(accessToken);
      await sleep();
      await dataAnalytics();
    }
  }
  if (answers.Welcome_1 === 'Authorize Another User') {
    accessToken = 'null';
    expireIn = 'null';
    const spinner = createSpinner('Authorizing Another User you have 30 seconds').start();
    main(true);
    await timeStop();
    spinner.stop();
    accessToken = jsonData['access-token'];
    expireIn = jsonData['expires-token'];

    saveData({ 'access-token': accessToken, 'expires-token': expireIn });
    spinner.success({ text: `Authorization successfully` });
    const username = await getUserDetail(accessToken);
    await sleep();
    await dataAnalytics();
  }
  if (answers.Welcome_1 === 'Exit') {
    process.exit(0);
  }
}


/*This Function is called when
the user has to login into the spotify account 
for loader to load the content and give user the time to login and authorize
*/
async function dataAnalytics() {
  const answers = await inquirer.prompt({
    name: 'SpotData',
    type: 'list',
    message: 'Choose one of the Query \n',
    choices: [
      'Spotify Top 10 Tracks',
      'Spotify Top 10 Artists',
      'Exit'
    ],
  });
  if (answers.SpotData === 'Spotify Top 10 Tracks'){
    
    let range = await Range();
    await getTopTracks(accessToken,range);
    await sleep();
    dataAnalytics();
  }
  else if (answers.SpotData === 'Spotify Top 10 Artists'){
    let range = await Range();
    await getTopArtists(accessToken,range);
    await sleep();
    dataAnalytics();
  }
  if (answers.SpotData === 'Exit'){
    process.exit(0);
  }
}

async function Range() {
  const answers = await inquirer.prompt({
    name: 'Range',
    type: 'list',
    message: 'Choose one of the Range \n',
    choices: [
      'Last Month',
      'Last 6 Months',
      'Last Year',
      'Exit'
    ],
  });
  if (answers.Range === 'Last Month'){
    return 'short_term'
  }
  else if (answers.Range === 'Last 6 Months'){
    return 'medium_term'
  }
  else if (answers.Range === 'Last Year'){
    return 'long_term'
  }
  if (answers.Range === 'Exit'){
    process.exit(0);
  }
}




const timeStop =(ms=30000)=>
    new Promise((r) =>
        setTimeout(r,ms));
await welcome();
await AuthorizeAndExit();