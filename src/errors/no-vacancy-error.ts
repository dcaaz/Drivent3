import { ApplicationError } from "@/protocols";

export function noVacancyInTheRoom(): ApplicationError {
  return {
    name: "NoVacancy",
    message: "No vacancy in the room",
  };
}