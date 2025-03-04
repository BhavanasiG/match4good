jest.mock("prisma", () => ({
  __esModule: true,
  getUser: jest.fn(async () => {
    return { username: "test_user", user_id: "test_user", id: 1 };
  }),
}));

import { createOrg, CreateOrgFormData } from "./actions";

describe("organization creation form", () => {
  it("works when given correct data", async () => {
    const data: CreateOrgFormData = { name: "Oxfam", description: "" };
    const org = { id: 1, name: "Oxfam", description: "" };

    prisma.organization.create.mockResolvedValue(org);

    const res = await createOrg(data);

    expect(res).toBe(org);
    expect(getUser).toHaveBeenCalledTimes(1);
    expect(prisma.organization.create).toHaveBeenCalledTimes(1);
  });
});
