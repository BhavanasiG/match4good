import {Auth0Client} from "@auth0/nextjs-auth0/server"

/**
 * A helper method to quickly get the account type of the current logged in user.
 * @returns If logged in, it returns the account type, otherwise it returns null
 */
export async function getAccountType(): Promise<string | null> {
    // todo: save this somewhere, enum?
    const roles = ["individual", "organization"];

    const session = await auth0.getSession();
    const scopes = session?.tokenSet.scope?.split(" ");

    const scope = scopes?.find((scope) => roles.includes(scope));

    return scope ?? null;
}

export const auth0 = new Auth0Client();