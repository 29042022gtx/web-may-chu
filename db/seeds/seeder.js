require('dotenv/config');
const mongoConnect = require('../../common/mongoConnect.js');
const userSeed = require('./userSeed.js');

async function main() {
  await mongoConnect();
  console.log('Seeding');
  await userSeed();
  console.log('Finished!');
  process.exit(0);
}

main();
