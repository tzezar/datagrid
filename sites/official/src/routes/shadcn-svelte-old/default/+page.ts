export const ssr = false;


import { generateUsers } from "./generate-users";

export const load = async () => {
    const users = generateUsers(100000);
    return { users };
  };