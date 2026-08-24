import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prismaClient';
import { requireAuth, requireRole } from '../middleware/auth';
import { recordAudit } from '../utils/audit';

export const patientsRouter = Router();
patientsRouter.use(requireAuth);

const patientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal('')),
  dob: z.string().datetime().optional(),
  address: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  medicalHistory: z.string().optional(),
  consentGiven: z.boolean().optional(),
});

patientsRouter.get('/', async (req, res, next) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;

    const patients = await prisma.patient.findMany({
      where: {
        tenantId: req.user!.tenantId,
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' as const } },
                { lastName: { contains: search, mode: 'insensitive' as const } },
                { phone: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        createdAt: true,
      },
    });

    res.json(patients);
  } catch (err) {
    next(err);
  }
});

patientsRouter.get('/:id', async (req, res, next) => {
  try {
    const patient = await prisma.patient.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    await recordAudit({
      tenantId: req.user!.tenantId,
      userId: req.user!.userId,
      action: 'PATIENT_VIEW',
      entityType: 'Patient',
      entityId: patient.id,
    });

    res.json(patient);
  } catch (err) {
    next(err);
  }
});

patientsRouter.post('/', requireRole('ADMIN', 'FRONT_DESK'), async (req, res, next) => {
  try {
    const data = patientSchema.parse(req.body);

    const patient = await prisma.patient.create({
      data: {
        tenantId: req.user!.tenantId,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email || undefined,
        dob: data.dob ? new Date(data.dob) : undefined,
        address: data.address,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        medicalHistory: data.medicalHistory,
        consentGiven: data.consentGiven ?? false,
        consentGivenAt: data.consentGiven ? new Date() : undefined,
      },
    });

    await recordAudit({
      tenantId: req.user!.tenantId,
      userId: req.user!.userId,
      action: 'PATIENT_CREATE',
      entityType: 'Patient',
      entityId: patient.id,
    });

    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
});

patientsRouter.put('/:id', requireRole('ADMIN', 'FRONT_DESK', 'DENTIST'), async (req, res, next) => {
  try {
    const data = patientSchema.partial().parse(req.body);

    const existing = await prisma.patient.findFirst({
      where: { id: req.params.id, tenantId: req.user!.tenantId },
    });
    if (!existing) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    const patient = await prisma.patient.update({
      where: { id: existing.id },
      data: {
        ...data,
        email: data.email || undefined,
        dob: data.dob ? new Date(data.dob) : undefined,
        consentGivenAt: data.consentGiven && !existing.consentGiven ? new Date() : undefined,
      },
    });

    await recordAudit({
      tenantId: req.user!.tenantId,
      userId: req.user!.userId,
      action: 'PATIENT_UPDATE',
      entityType: 'Patient',
      entityId: patient.id,
    });

    res.json(patient);
  } catch (err) {
    next(err);
  }
});
