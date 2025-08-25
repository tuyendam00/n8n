import { getRoleScopes, PROJECT_OWNER_ROLE_SLUG } from '@n8n/permissions';
import type {
	GlobalRole,
	ProjectRole,
	CredentialSharingRole,
	WorkflowSharingRole,
	Scope,
} from '@n8n/permissions';

import { createMember } from './shared/db/users';
import type { SuperAgentTest } from './shared/types';
import * as utils from './shared/utils/';
import { GLOBAL_ADMIN_ROLE, GLOBAL_MEMBER_ROLE, GLOBAL_OWNER_ROLE } from '@n8n/db';
import { RoleDTO } from '@n8n/api-types';

const testServer = utils.setupTestServer({
	endpointGroups: ['role'],
});

let memberAgent: SuperAgentTest;

const expectedCategories = ['global', 'project', 'credential', 'workflow'] as const;
let expectedGlobalRoles: Array<RoleDTO>;
let expectedProjectRoles: Array<RoleDTO>;
let expectedCredentialRoles: Array<RoleDTO>;
let expectedWorkflowRoles: Array<RoleDTO>;

beforeAll(async () => {
	memberAgent = testServer.authAgentFor(await createMember());

	expectedGlobalRoles = [
		{
			...GLOBAL_OWNER_ROLE,
			scopes: GLOBAL_OWNER_ROLE.scopes.map((s) => s.slug),
			name: GLOBAL_OWNER_ROLE.displayName,
			role: GLOBAL_OWNER_ROLE.slug,
			licensed: true,
		},
		{
			...GLOBAL_ADMIN_ROLE,
			scopes: GLOBAL_ADMIN_ROLE.scopes.map((s) => s.slug),
			name: GLOBAL_ADMIN_ROLE.displayName,
			role: GLOBAL_ADMIN_ROLE.slug,
			licensed: false,
		},
		{
			...GLOBAL_MEMBER_ROLE,
			scopes: GLOBAL_MEMBER_ROLE.scopes.map((s) => s.slug),
			name: GLOBAL_MEMBER_ROLE.displayName,
			role: GLOBAL_MEMBER_ROLE.slug,
			licensed: true,
		},
	];
	expectedProjectRoles = [
		{
			name: 'Project Owner',
			role: PROJECT_OWNER_ROLE_SLUG,
			scopes: getRoleScopes(PROJECT_OWNER_ROLE_SLUG),
			licensed: true,
			description: 'Project Owner',
		},
		{
			name: 'Project Admin',
			role: 'project:admin',
			scopes: getRoleScopes('project:admin'),
			licensed: false,
			description: 'Project Admin',
		},
		{
			name: 'Project Editor',
			role: 'project:editor',
			scopes: getRoleScopes('project:editor'),
			licensed: false,
			description: 'Project Editor',
		},
	];
	expectedCredentialRoles = [
		{
			name: 'Credential Owner',
			role: 'credential:owner',
			scopes: getRoleScopes('credential:owner'),
			licensed: true,
			description: 'Credential Owner',
		},
		{
			name: 'Credential User',
			role: 'credential:user',
			scopes: getRoleScopes('credential:user'),
			licensed: true,
			description: 'Credential User',
		},
	];
	expectedWorkflowRoles = [
		{
			name: 'Workflow Owner',
			role: 'workflow:owner',
			scopes: getRoleScopes('workflow:owner'),
			licensed: true,
			description: 'Workflow Owner',
		},
		{
			name: 'Workflow Editor',
			role: 'workflow:editor',
			scopes: getRoleScopes('workflow:editor'),
			licensed: true,
			description: 'Workflow Editor',
		},
	];
});

describe('GET /roles/', () => {
	test('should return all role categories', async () => {
		const resp = await memberAgent.get('/roles/');

		expect(resp.status).toBe(200);

		const data: Record<string, string[]> = resp.body.data;

		const categories = [...Object.keys(data)];
		expect(categories.length).toBe(expectedCategories.length);
		expect(expectedCategories.every((c) => categories.includes(c))).toBe(true);
	});

	test('should return fixed global roles', async () => {
		const resp = await memberAgent.get('/roles/');

		expect(resp.status).toBe(200);
		for (const role of expectedGlobalRoles) {
			expect(resp.body.data.global).toContain(role);
		}
	});

	test('should return fixed project roles', async () => {
		const resp = await memberAgent.get('/roles/');

		expect(resp.status).toBe(200);
		for (const role of expectedProjectRoles) {
			expect(resp.body.data.project).toContainEqual(role);
		}
	});

	test('should return fixed credential sharing roles', async () => {
		const resp = await memberAgent.get('/roles/');

		expect(resp.status).toBe(200);
		for (const role of expectedCredentialRoles) {
			expect(resp.body.data.credential).toContainEqual(role);
		}
	});

	test('should return fixed workflow sharing roles', async () => {
		const resp = await memberAgent.get('/roles/');

		expect(resp.status).toBe(200);
		for (const role of expectedWorkflowRoles) {
			expect(resp.body.data.workflow).toContainEqual(role);
		}
	});
});
