// src/api/auth.ts
import { http } from "./http";
import type { User, Role } from "../types";

type BackendLoginResponse = {
  token: string;
  user: {
    user_id: number;
    name: string;
    email: string;
  };
};

type CheckAuthResponse = {
  message: string;
  user: {
    user_id: number;
    email: string;
    iat?: number;
    exp?: number;
  };
};

export async function loginApi(email: string, password: string) {
  const { data } = await http.post<BackendLoginResponse>("/auth/login", {
    email,
    password,
  });

  const token = data.token;
  const backendUser = data.user;

  const user: User = {
    id: backendUser.user_id,
    name: backendUser.name,
    email: backendUser.email,
  };

  return { token, user };
}

// user + role-ok betöltése token alapján
export async function meApi(): Promise<User> {
  const { data } = await http.post<CheckAuthResponse>("/checkauth", {});
  const payload = data.user;

  // user adatai lekérése
  const userResp = await http.get<{
    user_id: number;
    name: string;
    email: string;
    created_at: string;
  }>(`/users/${payload.user_id}`);

  const rolesResp = await http.get<Role[]>(`/users/${payload.user_id}/roles`);

  
  return {
    id: userResp.data.user_id,
    name: userResp.data.name,
    email: userResp.data.email,
    roles: rolesResp.data,
  };
}

export async function register(name: string, email: string, password: string) {
  const res = await http.post<User>("/users", {
    name,
    email,
    password,
  });
  return res.data;
}