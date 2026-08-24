import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prismaClient';
import { requireAuth, requireRole } from '../middleware/auth';
import { hashPassword } from '../utils/password';

export const staffRouter = Router();
staffRouter.use(requireAuth);

staffRouter.get('/dentists', async (req, res, next) => {
  try {
    const dentists = await prisma.user.findMany({
      where: { tenantId: req.user!.tenantId, role: 'DENTIST' },
      select: { id: true, name: true },
    });
    res.json(dentists);
  } catch (err) {
    next(err);
  }
});

const staffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['ADMIN', 'DENTIST', 'FRONT_DESK']),
});

staffRouter.post('/', requireRole('ADMIN'), async (req, res, next) => {
  try {
    const data = staffSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: {
        tenantId: req.user!.tenantId,
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      },
    });

    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
});
