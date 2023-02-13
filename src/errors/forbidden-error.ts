import { ApplicationError } from "@/protocols";

export function Forbidden(): ApplicationError {
  return {
    name: "Forbidden",
    message: "You don't have permission to access",
  };
}