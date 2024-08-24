// auth.ts
import { IncomingMessage, ServerResponse } from "http";
import { verify, sign } from "jsonwebtoken";
import { hashSync, compareSync } from "bcrypt";

const secret = "your_secret_key"; // Replace with your actual secret key

interface UserPayload {
  id: string;
  permissions: { [key: string]: boolean };
}

interface User {
  id: string;
  passwordHash: string;
  permissions: {
    upload?: boolean;
    canExecute?: boolean;
    canUpload?: boolean;
  };
}

interface UserDatabase {
  [username: string]: User;
}

const mockUserDatabase: UserDatabase = {
  user1: {
    id: "user1",
    passwordHash: hashSync("password123", 10),
    permissions: {
      upload: true,
    },
  },
  admin: {
    id: "admin",
    passwordHash: hashSync("adminpassword", 10),
    permissions: {},
  },
};

export const authenticate = (
  req: IncomingMessage,
  res: ServerResponse,
  next: Function,
  requiredPermission?: string[]
) => {
  if (!requiredPermission || requiredPermission == undefined || requiredPermission.length == 0) {
    next();
    return true;
  }
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: "Unauthorized" }));
    return false;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: "Unauthorized" }));
    return false;
  }

  verify(token, secret, (err, user) => {
    if (err) {
      res.statusCode = 403;
      res.end(JSON.stringify({ message: "Forbidden" }));
      return false;
    }

    (req as any).user = user as UserPayload;

    let allowed = true;
    if (requiredPermission)
      requiredPermission.forEach((perm) => {
        if (!(user as UserPayload).permissions[perm]) allowed = false;
      });

    if (requiredPermission && !allowed) {
      res.statusCode = 403;
      res.end(
        JSON.stringify({ message: "Forbidden: Insufficient Permissions" })
      );
      return false;
    }

    next();
    return true;
  });
};

export const login = (username: string, password: string) => {
  const user: User | undefined = mockUserDatabase[username];
  if (!user) return null;

  const passwordValid = compareSync(password, user.passwordHash);
  if (!passwordValid) return null;

  const token = sign({ id: user.id, permissions: user.permissions }, secret, {
    expiresIn: "1h",
  });

  return token;
};
