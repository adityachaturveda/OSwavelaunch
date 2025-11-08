import { ClientStatus } from "@/lib/generated/prisma/enums";

export const CLIENT_STATUS = [
  ClientStatus.ACTIVE,
  ClientStatus.INACTIVE,
] as const satisfies readonly ClientStatus[];

export type ClientStatusValue = ClientStatus;

export const CLIENT_STATUS_LABELS: Record<ClientStatusValue, string> = {
  [ClientStatus.ACTIVE]: "Active",
  [ClientStatus.INACTIVE]: "Inactive",
};

export const CLIENT_STATUS_ARRAY: ClientStatusValue[] = [...CLIENT_STATUS];
