import { generateUsers } from "./generate-users";

export const load = async () => {
    const users = generateUsers(1000);
    return { users };
  };