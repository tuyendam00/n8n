import { roleNamespaceSchema } from '@n8n/permissions/src/schemas.ee';
import { z } from 'zod';

export const createRoleDtoSchema = z.object({
	displayName: z.string().min(2).max(100),
	description: z.string().max(500).optional(),
	roleType: roleNamespaceSchema,
	scopes: z.array(z.string()),
});

export type CreateRoleDto = z.infer<typeof createRoleDtoSchema>;
