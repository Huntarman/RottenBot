# RottenBot
A discord bot aimed to make a brain-rotting experience for its users, in light of recent meme culture.
And that was originally what it was going to be, homever I decided to take it in a different direction,
in order to learn many useful IT technologies and tools, such as Docker and DB migrations, but also some asynchronous programming.
I was planning on hosting this app on somewhere, homever I ultimately decided against it.
I'm glad how this project turned out, but I ran out of interesting features to add, might revisit this in the future.
## 🤖RottenBot
RottenBot is a bot that uses Discord API in order to:

- **Play music**:
  - **from youtube**
  - **saved locally**
- **Send HTTP requests to Reddit.com**:
  - **to get the top daily post of r/polska**
  - **to get a random post from user specified in .env**
- **Play games like coinflip, rock-paper-scissors**:
- **Challange other players to rock-paper-scizzors**:
- **Randomize an alkoholic drink for you (Polish language only)**:
- **Other various things**:

## 📚Stack
- **Node.js**:
- **JavaScript**:
- **PostgreSQL**:

## Most important NPM packages:
- **[Discord.js](https://github.com/discordjs/discord.js)**
- **[sequelize](https://github.com/sequelize/sequelize)**
- **[ffmpeg](https://github.com/damianociarla/node-ffmpeg)**

## Requirements for running locally:
- **Node.js**
- **Docker**
- **Installed FFMPEG**
- **Set up discord application**
- **Set up env**

## How to run 
- **Clone project (recommended with SSH)**
- **Install dependencies using**:
```
npm install
```
- **Set up database using**:
```
docker compose up
```
- **Set up config.json**
- **Make sure the database is like sequelize object**:
- **Run the app using**:
```
node .
```
