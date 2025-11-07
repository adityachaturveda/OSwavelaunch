export enum ClientStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export const CLIENT_STATUS = [
  ClientStatusEnum.ACTIVE,
  ClientStatusEnum.INACTIVE,
] as const;

export type ClientStatusValue = (typeof CLIENT_STATUS)[number];

export const CLIENT_STATUS_LABELS: Record<ClientStatusValue, string> = {
  [ClientStatusEnum.ACTIVE]: "Active",
  [ClientStatusEnum.INACTIVE]: "Inactive",
};

export const CLIENT_STATUS_ARRAY: ClientStatusValue[] = [...CLIENT_STATUS];
