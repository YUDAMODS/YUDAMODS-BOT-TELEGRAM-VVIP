#!/bin/bash

# Grant execute permission to main.sh
chmod +x main.sh

# Install dependencies
npm install telegraf axios cheerio fs gradient-string pino util

# Run the bot
bash start.sh
