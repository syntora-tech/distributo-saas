import { describe, it, expect } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { GET as getFee } from '../fee/route';
import { POST as createDistribution } from '../distribution/create/route';
import { POST as startDistribution } from '../distribution/start/route';
import { GET as getDistributionReport } from '../distribution/[id]/report/route';
import { GET as getUserDistributions } from '../distribution/user/[wallet]/route';
import { Network } from '@/lib/blockchain/network';

describe('API Endpoints', () => {
    describe('GET /api/fee', () => {
        it('should return fee estimation for mainnet by default', async () => {
            const response = await getFee(new Request('http://localhost/api/fee'));
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.network).toBe(Network.MAINNET);
            expect(data).toHaveProperty('baseFee');
            expect(data).toHaveProperty('speeds');
            expect(data.speeds).toHaveProperty('standard');
            expect(data.speeds).toHaveProperty('priority');
            expect(data.speeds).toHaveProperty('urgent');
        });

        it('should return fee estimation for devnet', async () => {
            const response = await getFee(
                new Request('http://localhost/api/fee?network=devnet')
            );
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.network).toBe(Network.DEVNET);
            expect(data).toHaveProperty('baseFee');
            expect(data).toHaveProperty('speeds');
            expect(data.speeds).toHaveProperty('standard');
            expect(data.speeds).toHaveProperty('priority');
            expect(data.speeds).toHaveProperty('urgent');
        });

        it('should handle invalid network', async () => {
            const response = await getFee(
                new Request('http://localhost/api/fee?network=invalid')
            );
            expect(response.status).toBe(400);
        });

        it('should return fee estimation with custom parameters', async () => {
            const response = await getFee(
                new Request('http://localhost/api/fee?recipients=10&speed=priority')
            );
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.networkFee).toBeGreaterThan(0);
            expect(data.serviceFee).toBeGreaterThan(0);
            expect(data.totalCost).toBeGreaterThan(0);
            expect(data.estimatedTime).toBeGreaterThan(0);
        });

        it('should handle invalid number of recipients', async () => {
            const response = await getFee(
                new Request('http://localhost/api/fee?recipients=0')
            );
            expect(response.status).toBe(400);
        });

        it('should handle invalid speed parameter', async () => {
            const response = await getFee(
                new Request('http://localhost/api/fee?speed=invalid')
            );
            expect(response.status).toBe(400);
        });
    });

    describe('POST /api/distribution/create', () => {
        it('should create new distribution', async () => {
            const mockBody = {
                tokenAddress: 'test-token-address',
                tokenName: 'Test Token',
                signature: 'test-signature'
            };

            const { req } = createMocks({
                method: 'POST',
                body: mockBody
            });

            const response = await createDistribution(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveProperty('id');
            expect(data).toHaveProperty('depositAddress');
        });

        it('should handle missing required fields', async () => {
            const mockBody = {
                tokenName: 'Test Token'
            };

            const { req } = createMocks({
                method: 'POST',
                body: mockBody
            });

            const response = await createDistribution(req);
            expect(response.status).toBe(500);
        });
    });

    describe('POST /api/distribution/start', () => {
        it('should start distribution', async () => {
            const mockBody = {
                distributionId: 'test-id',
                recipients: [
                    { address: 'test-address-1', amount: 100 },
                    { address: 'test-address-2', amount: 200 }
                ],
                signature: 'test-signature'
            };

            const { req } = createMocks({
                method: 'POST',
                body: mockBody
            });

            const response = await startDistribution(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveProperty('status');
            expect(data.status).toBe('started');
        });

        it('should handle invalid distribution id', async () => {
            const mockBody = {
                distributionId: 'invalid-id',
                recipients: [],
                signature: 'test-signature'
            };

            const { req } = createMocks({
                method: 'POST',
                body: mockBody
            });

            const response = await startDistribution(req);
            expect(response.status).toBe(500);
        });
    });

    describe('GET /api/distribution/:id/report', () => {
        it('should return distribution report', async () => {
            const mockParams = { id: 'test-id' };
            const response = await getDistributionReport(
                new Request('http://localhost'),
                { params: mockParams }
            );
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveProperty('id');
            expect(data).toHaveProperty('status');
            expect(data).toHaveProperty('totalRecipients');
            expect(data).toHaveProperty('successfulTransfers');
            expect(data).toHaveProperty('failedTransfers');
            expect(data).toHaveProperty('totalAmount');
            expect(data).toHaveProperty('transactions');
        });

        it('should handle non-existent distribution', async () => {
            const mockParams = { id: 'non-existent-id' };
            const response = await getDistributionReport(
                new Request('http://localhost'),
                { params: mockParams }
            );
            expect(response.status).toBe(500);
        });
    });

    describe('GET /api/distribution/user/:wallet', () => {
        it('should return user distributions', async () => {
            const mockParams = { wallet: 'test-wallet' };
            const response = await getUserDistributions(
                new Request('http://localhost'),
                { params: mockParams }
            );
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toHaveProperty('distributions');
            expect(Array.isArray(data.distributions)).toBe(true);
        });

        it('should handle invalid wallet address', async () => {
            const mockParams = { wallet: 'invalid-wallet' };
            const response = await getUserDistributions(
                new Request('http://localhost'),
                { params: mockParams }
            );
            expect(response.status).toBe(500);
        });
    });
}); 