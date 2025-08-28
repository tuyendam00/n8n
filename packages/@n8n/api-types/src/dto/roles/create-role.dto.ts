import { z } from 'zod';

export const createRoleDtoSchema = z.object({
	displayName: z.string().min(2).max(100),
	description: z.string().max(500).optional(),
	roleType: z.enum(['project']),
	scopes: z.array(z.string()),
});

export type CreateRoleDto = z.infer<typeof createRoleDtoSchema>;
