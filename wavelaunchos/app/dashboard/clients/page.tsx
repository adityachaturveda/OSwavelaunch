import { ClientsTable } from "@/components/clients/clients-table";
import { getClientsForList } from "@/lib/data/server-clients";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await getClientsForList();

  return <ClientsTable clients={clients} />;
}
