const bcrypt = require('bcryptjs')
const faker = require('faker')

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // delete all data from the database

  await prisma.account.deleteMany()
  console.log('All accounts deleted')

  await prisma.session.deleteMany()
  console.log('All sessions deleted')

  await prisma.verificationToken.deleteMany()
  console.log('All verification tokens deleted')

  await prisma.twoFactorToken.deleteMany()
  console.log('All two-factor tokens deleted')

  await prisma.twoFactorConfirmation.deleteMany()
  console.log('All two-factor confirmations deleted')

  await prisma.subscription.deleteMany()
  console.log('All subscriptions deleted')

  await prisma.budget.deleteMany()
  console.log('All budgets deleted')

  await prisma.category.deleteMany()
  console.log('All categories deleted')

  await prisma.creditCard.deleteMany()
  console.log('All credit cards deleted')

  await prisma.user.deleteMany()
  console.log('All users deleted')

  const user = await prisma.user.create({
    data: {
      id: faker.datatype.uuid(),
      name: faker.name.findName(),
      email: 'bsignx@gmail.com',
      emailVerified: faker.date.past(),
      password: bcrypt.hashSync('password', 10),
      role: 'USER',
      image: faker.image.avatar(),
      isTwoFactorEnabled: faker.datatype.boolean()
    }
  })
  console.log('User created')

  await prisma.account.create({
    data: {
      id: faker.datatype.uuid(),
      userId: user.id,
      type: faker.finance.accountName(),
      provider: faker.company.companyName(),
      providerAccountId: faker.finance.account()
    }
  })
  console.log('Account created')

  await prisma.session.create({
    data: {
      id: faker.datatype.uuid(),
      sessionToken: faker.datatype.uuid(),
      userId: user.id,
      expires: faker.date.future()
    }
  })
  console.log('Session created')

  const category = await prisma.category.create({
    data: {
      id: faker.datatype.uuid(),
      name: faker.commerce.department()
    }
  })
  console.log('Category created')

  const creditCard = await prisma.creditCard.create({
    data: {
      id: faker.datatype.uuid(),
      nameOnCard: faker.name.findName(),
      cardNumber: faker.finance.creditCardNumber(),
      expirationDate: faker.date.future(),
      userId: user.id
    }
  })
  console.log('Credit card created')

  await prisma.subscription.create({
    data: {
      id: faker.datatype.uuid(),
      userId: user.id,
      name: faker.commerce.productName(),
      price: Number(faker.finance.amount()),
      description: faker.commerce.productDescription(),
      firstBillingDate: faker.date.past(),
      reminder: faker.datatype.boolean(),
      categoryId: category.id,
      creditCardId: creditCard.id
    }
  })
  console.log('Subscription created')

  await prisma.budget.create({
    data: {
      id: faker.datatype.uuid(),
      amount: Number(faker.finance.amount()),
      startDate: faker.date.past(),
      endDate: faker.date.future(),
      categoryId: category.id
    }
  })
  console.log('Budget created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
