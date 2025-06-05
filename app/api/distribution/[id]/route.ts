import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for distribution ID
const distributionIdSchema = z.string().uuid({
    message: 'Invalid distribution ID format'
});

interface Recipient {
    id: string;
    amount: number;
    walletAddress: string | null;
}

export async function GET(
    request: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const params = await context.params;
        const id = params.id;

        // Check if id parameter exists
        if (!id) {
            return new Response(JSON.stringify({
                error: 'Distribution ID is required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Validate distribution ID
        const validationResult = distributionIdSchema.safeParse(id);
        if (!validationResult.success) {
            return new Response(JSON.stringify({
                error: 'Invalid distribution ID',
                details: validationResult.error.errors
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const distribution = await prisma.distribution.findUnique({
            where: {
                id,
            },
            include: {
                depositAddress: true,
                recipients: true,
            },
        });

        if (!distribution) {
            return new Response(JSON.stringify({ error: 'Distribution not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Відфільтровуємо дані, щоб повернути чітку структуру
        const filteredDistribution = {
            id: distribution.id,
            name: distribution.name,
            tokenAddress: distribution.tokenAddress,
            status: distribution.status,
            createdAt: distribution.createdAt,
            updatedAt: distribution.updatedAt,
            depositAddress: distribution.depositAddress ? distribution.depositAddress.address : null,
            recipients: distribution.recipients.map((recipient: Recipient) => ({
                id: recipient.id,
                amount: recipient.amount,
                walletAddress: recipient.walletAddress
            }))
        };

        return new Response(JSON.stringify(filteredDistribution), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error fetching distribution:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
} 