import {
  Button,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
} from "@mantine/core";
import { signUp } from "./actions";

export default function LoginPage() {
  return (
    <Container size={420} my={40}>
      <Title ta="center">Sign up</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form action={signUp}>
          <TextInput
            name="firstName"
            label="First Name"
            placeholder="Your first name"
            required
            mt="md"
          />
          <TextInput
            name="lastName"
            label="Last Name"
            placeholder="Your last name"
            required
            mt="md"
          />
          <TextInput
            name="email"
            label="Email"
            placeholder="you@mantine.dev"
            mt="md"
            required
          />
          <PasswordInput
            name="password"
            label="Password"
            placeholder="Your password"
            required
            mt="md"
          />
          <Button type="submit" fullWidth mt="xl">
            Sign up
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
