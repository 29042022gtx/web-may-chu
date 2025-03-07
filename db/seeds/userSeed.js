const User = require("../../models/User");


async function userSeed() {
  await User.deleteMany();
  const staffs = [
    {
      name: 'John Doe',
      dateOfBirth: new Date('1985-07-15'),
    },
    {
      name: 'Jane Smith',
      dateOfBirth: new Date('1990-02-22'),
    },
    {
      name: 'Alice Johnson',
      dateOfBirth: new Date('1982-11-30'),
    },
    {
      name: 'Bob Brown',
      dateOfBirth: new Date('1978-03-05'),
    },
    {
      name: 'Charlie Davis',
      dateOfBirth: new Date('1995-06-25'),
    },
    {
      name: 'Diana Miller',
      dateOfBirth: new Date('1992-09-13'),
    },
    {
      name: 'Eve Wilson',
      dateOfBirth: new Date('1989-12-09'),
    },
    {
      name: 'Frank Moore',
      dateOfBirth: new Date('1980-04-18'),
    },
    {
      name: 'Grace Taylor',
      dateOfBirth: new Date('1993-08-07'),
    },
    {
      name: 'Hank Martinez',
      dateOfBirth: new Date('1975-01-25'),
    },
  ];
  await User.insertMany(staffs);
}

module.exports = userSeed