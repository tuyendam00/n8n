import { z } from 'zod';

export const roleDtoSchema = z.object({
	role: z.string().min(1), // backwards compatibility for the UI
	slug: z.string().min(1),
	displayName: z.string().min(1),
	name: z.string().min(1), // backwards compatibility for the UI
	description: z.string().nullable(),
	systemRole: z.boolean(),
	roleType: z.enum(['global', 'project', 'workflow', 'credential']),
	licensed: z.boolean(),
	scopes: z.array(z.string()),
});

export type RoleDTO = z.infer<typeof roleDtoSchema>;
