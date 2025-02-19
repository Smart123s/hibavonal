export default async function ViewTicketPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  //TODO: check ijf authenticated user is allowed to view this ticket
  return (
    <div>
      <h1>{(await params).id}</h1>
    </div>
  );
}
