import RedirectButton from "@/app/components/redirectButton";
import {auth} from "@/auth";
import {prisma} from "@/prisma";
import {hasPermission} from "@/utils/permissions";
import {
  Badge,
  Card,
  Group,
  Text,
  Grid,
  GridCol,
  Container,
} from "@mantine/core";
import {Role} from "@prisma/client";

export default async function HomePage() {
  const session = await auth();
  const errorTypes = await prisma.errorType.findMany();

  return (
    <div>
      <Container
        fluid
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "space-between",
          marginBottom: "16px",
        }}
      >
        <Text fw={700} size="xl">
          Error types
        </Text>
        {hasPermission(session?.user.role as Role, "errortype", "create") && (
          <RedirectButton url="/dashboard/errortypes/new/">
            Create new error type
          </RedirectButton>
        )}
      </Container>
      <Grid>
      {errorTypes.map((errorType) => (
  <GridCol span={{ base: 12, md: 6, lg: 3 }} key={errorType.id}>
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={500}>{errorType.name}</Text>
        <Badge color="red" autoContrast>
          Severity: {errorType.severity}
        </Badge>
      </Group>

      <RedirectButton
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        url={"/dashboard/errortypes/" + errorType.id}
      >
        View details
      </RedirectButton>
      

      {hasPermission(session?.user.role as Role, "errortype", "delete") && (
          <RedirectButton color="red" 
          url={`/dashboard/errortypes/delete?id=${errorType.id}`}
          >
            Delete
          </RedirectButton>
        )}
    </Card>
  </GridCol>
))}

      </Grid>
    </div>
  );
}
