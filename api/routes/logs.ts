
import express from 'express';
import prisma from '../prisma.ts';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const logs = await prisma.log.findMany({
            orderBy: { timestamp: 'desc' },
            take: 1000
        });
        res.json(logs.map(log => ({
            ...log,
            metadata: log.metadata ? JSON.parse(log.metadata) : null
        })));
    } catch (e) {
        res.status(500).json({ message: 'Failed to fetch logs' });
    }
});

router.post('/', async (req, res) => {
    const { username, action, details, metadata } = req.body;

    try {
        // Try to find the user to link the log
        const user = await prisma.user.findUnique({ where: { username: username || '' } });

        const newLog = await prisma.log.create({
            data: {
                username: username || 'anonymous',
                action,
                details,
                metadata: metadata ? JSON.stringify(metadata) : null,
                userId: user?.id
            }
        });

        res.status(201).json(newLog);
    } catch (e) {
        console.error('Log creation error:', e);
        res.status(500).json({ message: 'Failed to create log' });
    }
});

router.delete('/', async (req, res) => {
    try {
        await prisma.log.deleteMany();
        res.status(204).send();
    } catch (e) {
        res.status(500).json({ message: 'Failed to clear logs' });
    }
});

export default router;
