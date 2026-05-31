import { zodResolver } from "@hookform/resolvers/zod";
// import Image from 'next/image';
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import { LoginUserInput, loginUserSchema } from "@/lib/user-schema";

import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Container,
  LoadingOverlay,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import classes from "./FormLogin.module.css";

export function FormLogin({ csrfToken }: { csrfToken?: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/backboard";

  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<LoginUserInput> = async (values) => {
    try {
      setSubmitting(true);

      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        redirectTo: callbackUrl,
      });

      setSubmitting(false);

      if (!res?.error) {
        toast.success("successfully logged in");
        router.push(callbackUrl);
      } else {
        reset({ password: "" });
        const message = "invalid email or password";
        toast.error(message);
        setError(message);
      }
    } catch (error: any) {
      toast.error(error.message);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className={classes.wrapper}>
      <Paper className={classes.form} radius={0} p={30} m={0}>
        <LoadingOverlay
          visible={submitting}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form onSubmit={handleSubmit(onSubmitHandler)}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          {error && (
            <p style={{ color: "var(--mantine-color-red-9)" }}>{error}</p>
          )}
          <Title
            order={2}
            className={classes.title}
            ta="center"
            mt="md"
            mb={50}
            size={"h3"}
          >
            Backboard Basketball!
          </Title>

          <TextInput
            type="email"
            label="Email address"
            {...register("email")}
            disabled={submitting}
            placeholder="hello@gmail.com"
            size="md"
          />
          {errors["email"] && (
            <span style={{ color: "var(--mantine-color-red-9)" }}>
              {errors["email"]?.message as string}
            </span>
          )}
          <PasswordInput
            type="password"
            label="Password"
            {...register("password")}
            disabled={submitting}
            placeholder="Your password"
            mt="md"
            size="md"
          />
          {errors["password"] && (
            <span style={{ color: "var(--mantine-color-red-9)" }}>
              {errors["password"]?.message as string}
            </span>
          )}
          {/* <Checkbox label="Keep me logged in" mt="xl" size="md" /> */}
          <Button
            type="submit"
            style={{ backgroundColor: `${submitting ? "#ccc" : "#fff"}` }}
            disabled={submitting}
            fullWidth
            mt="xl"
            size="md"
          >
            {submitting ? "loading..." : "Sign In"}
          </Button>

          {/* <Text ta="center" mt="md">
            Don&apos;t have an account?{" "}
            <Anchor<"a">
              href="#"
              fw={700}
              onClick={(event) => event.preventDefault()}
            >
              Register
            </Anchor>
          </Text> */}
        </form>
      </Paper>
    </Box>
  );
}
