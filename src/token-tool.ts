#!/usr/bin/env node

import program from 'commander';
import http from 'http';
import opn from 'opn';

program.description('Spotify Refresh Token Tool');

import { generateAuthUrl, getTokens } from './spotify-api';

program
  .command('token <clientId> <clientSecret>')
  .alias('t')
  .description('Start Spotify OAuth Flow')
  .action((clientId, clientSecret) => {
    console.log('Starting HTTP server to receive OAuth data from Spotify...');

    http
      .createServer(async (req, res) => {
        const url = new URL(`http://localhost${req.url}`);
        const code = url.searchParams.get('code');

        if (!code) {
          return;
        }

        console.log('Got the code. Getting the refresh token now...');

        const tokens = await getTokens(
          clientId,
          clientSecret,
          code,
          'authorization_code',
        );

        console.log(`Here's your refresh token:`);
        console.log(tokens.refresh_token);

        res.write(`Your refresh token is:\n${tokens.refresh_token}`);
        res.end();
        setTimeout(() => process.exit(0), 1000);
      })
      .listen(5071);

    console.log(
      'I will open a browser window for you.',
      'Please log in using your Spotify credentials.',
    );

    opn(generateAuthUrl(clientId));
  });

program.parse(process.argv);
