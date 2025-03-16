const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

async function userSeed() {
  await User.deleteMany();
  await User.create({
    name: 'Admin',
    email: 'admin@mail.com',
    password: 12345678,
    dateOfBirth: faker.date.past(30, new Date('2000-01-01')),
    role: 'admin',
  });
  await User.create({
    name: 'Staff 01',
    email: 'staff01@mail.com',
    password: 12345678,
    dateOfBirth: faker.date.past(30, new Date('2000-01-01')),
    role: 'staff',
  });
  const users = [];
  for (let i = 1; i <= 10; i++) {
    users.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 12345678,
      dateOfBirth: faker.date.past(30, new Date('2000-01-01')),
      role: 'staff',
    });
  }
  await User.insertMany(users);
}

module.exports = userSeed;
