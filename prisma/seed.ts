import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      walletAddress: 'So1anaTestWallet111111111111111111111111111111111',
    },
  });

  // Create a deposit address for user
  const depositAddress = await prisma.depositAddress.create({
    data: {
      userId: user.id,
      address: 'DepositAddress111111111111111111111111111111111111',
      derivationPath: "m/44'/501'/0'/0/1",
      status: 'ACTIVE',
    },
  });

  // Create a distribution
  const distribution = await prisma.distribution.create({
    data: {
      name: 'Test Airdrop',
      tokenAddress: 'TokenMint11111111111111111111111111111111111111',
      status: 'PENDING',
      userId: user.id,
      depositAddressId: depositAddress.id,
    },
  });

  // Create recipients
  const recipient1 = await prisma.recipient.create({
    data: {
      walletAddress: 'RecipientWallet11111111111111111111111111111111',
      amount: 10.5,
      distributionId: distribution.id,
    },
  });
  const recipient2 = await prisma.recipient.create({
    data: {
      walletAddress: 'RecipientWallet22222222222222222222222222222222',
      amount: 20.0,
      distributionId: distribution.id,
    },
  });

  // Create a transaction
  const transaction = await prisma.transaction.create({
    data: {
      signature: 'TestSignature1111111111111111111111111111111111111',
      status: 'PENDING',
      userId: user.id,
      distributionId: distribution.id,
      recipients: {
        connect: [
          { id: recipient1.id },
          { id: recipient2.id },
        ],
      },
    },
  });

  // Update recipients to link to transaction
  await prisma.recipient.update({
    where: { id: recipient1.id },
    data: { transactionId: transaction.id },
  });
  await prisma.recipient.update({
    where: { id: recipient2.id },
    data: { transactionId: transaction.id },
  });

  // Create a fee
  await prisma.fee.create({
    data: {
      amount: 0.01,
      type: 'NETWORK',
      distributionId: distribution.id,
    },
  });

  console.log('Seed complete.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
