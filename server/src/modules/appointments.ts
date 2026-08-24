import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prismaClient';
import { requireAuth, requireRole } from '../middleware/auth';

export const appointmentsRouter = Router();
appointmentsRouter.use(requireAuth);

const appointmentSchema = z.object({
  patientId: z.string().uuid(),
  dentistId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
  durationMinutes: z.number().int().positive().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

appointmentsRouter.get('/', async (req, res, next) => {
  try {
    const { date, dentistId } = req.query;
    const where: Record<string, unknown> = { tenantId: req.user!.tenantId };

    if (typeof date === 'string') {
      const start = new Date(date);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      where.scheduledAt = { gte: start, lt: end };
    }
    if (typeof dentistId === 'string') {
      where.dentistId = dentistId;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
        dentist: { select: { id: true, name: true } },
      },
    });

    res.json(appointments);
  } catch (err) {
    next(err);
  }
});

appointmentsRouter.post('/', requireRole('ADMIN', 'FRONT_DESK'), async (req, res, next) => {
  try {
    const data = appointmentSchema.parse(req.body);

    const [patient, dentist] = await Promise.all([
      prisma.patient.findFirst({ where: { id: data.patientId, tenantId: req.user!.tenantId } }),
      prisma.user.findFirst({ where: { id: data.dentistId, tenantId: req.user!.tenantId, role: 'DENTIST' } }),
    ]);
    if (!patient) return res.status(400).json({ error: 'Unknown patient' });
    if (!dentist) return res.status(400).json({ error: 'Unknown dentist' });

    const appointment = await prisma.appointment.create({
      data: {
        tenantId: req.user!.tenantId,
        patientId: data.patientId,
        dentistId: data.dentistId,
        scheduledAt: new Date(data.scheduledAt),
        durationMinutes: data.durationMinutes ?? 30,
        reason: data.reason,
        notes: data.notes,
      },
    });

    res.status(201).json(appointment);
  } catch (err) {
    next(err);
  }
});

const statusSchema = z.object({
  status: z.enum(['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW']),
});

appointmentsRouter.patch('/:id/status', requireRole('ADMIN', 'FRONT_DESK', 'DENTIST'), async (req, res, next) => {
  try {
    const { status } = statusSchema.parse(req.body);

    const existing = await prisma.appointment.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });
    if (!existing) return res.status(404).json({ error: 'Appointment not found' });

    const appointment = await prisma.appointment.update({
      where: { id: existing.id },
      data: { status },
    });

    res.json(appointment);
  } catch (err) {
    next(err);
  }
});
