import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for wallet address
const walletAddressSchema = z.string().min(1, 'Wallet address is required');

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const walletAddress = searchParams.get('walletAddress');

        // Check if walletAddress parameter exists
        if (!walletAddress) {
            return new Response(JSON.stringify({
                error: 'Wallet address parameter is required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate wallet address
        const validationResult = walletAddressSchema.safeParse(walletAddress);
        if (!validationResult.success) {
            return new Response(JSON.stringify({
                error: 'Invalid request data',
                details: validationResult.error.errors
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const user = await prisma.user.findUnique({
            where: { walletAddress },
            include: {
                distributions: {
                    include: {
                        depositAddress: {
                            select: {
                                address: true
                            }
                        }
                    },
                    orderBy: [
                        {
                            status: 'asc'
                        },
                        {
                            createdAt: 'desc'
                        }
                    ]
                }
            }
        });

        if (!user) {
            return new Response(JSON.stringify([]), { status: 200 });
        }

        return new Response(JSON.stringify(user.distributions), { status: 200 });
    } catch (error) {
        console.error('Error fetching distributions:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch distributions' }), { status: 500 });
    }
} 