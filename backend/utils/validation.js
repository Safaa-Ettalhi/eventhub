import { z } from 'zod';

// Login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Event validation
export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  location: z.string().min(1, 'Location is required').max(255, 'Location too long'),
  eventDate: z.string().datetime('Invalid date format'),
  maxParticipants: z.number().int().positive('Max participants must be positive'),
  status: z.enum(['draft', 'published', 'cancelled']).optional(),
});

export const eventUpdateSchema = eventSchema.partial();

export const eventStatusSchema = z.object({
  status: z.enum(['draft', 'published', 'cancelled'], {
    errorMap: () => ({ message: 'Status must be draft, published, or cancelled' }),
  }),
});

// Participant validation
export const participantSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(200, 'Name too long'),
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  phone: z.string().max(50, 'Phone too long').optional(),
});

export const participantUpdateSchema = participantSchema.partial();

// Registration validation
export const registrationSchema = z.object({
  eventId: z.string().uuid('Invalid event ID'),
  participantId: z.string().uuid('Invalid participant ID'),
  status: z.enum(['pending', 'confirmed', 'cancelled']).optional(),
});

export const registrationStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled'], {
    errorMap: () => ({ message: 'Status must be pending, confirmed, or cancelled' }),
  }),
});

// User validation (for admin only)
export const userSchema = z.object({
  email: z.string().email('Invalid email format').max(255, 'Email too long'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'staff'], {
    errorMap: () => ({ message: 'Role must be admin or staff' }),
  }),
  fullName: z.string().min(1, 'Full name is required').max(200, 'Name too long'),
});

export const userUpdateSchema = z.object({
  email: z.string().email('Invalid email format').max(255, 'Email too long').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['admin', 'staff']).optional(),
  fullName: z.string().min(1, 'Full name is required').max(200, 'Name too long').optional(),
});

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation error',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(error);
    }
  };
};
