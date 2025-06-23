"use server";
import { SubscribeState } from "@/types";
import { z } from "zod";
import { subscribeService } from "./services";

const subscribeSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
});

export async function subscribeAction(
  prevState: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  console.log("Our first server action");
  const email = formData.get("email");

  const validatedFields = subscribeSchema.safeParse({
    email: email,
  });

  if (!validatedFields.success) {
    console.dir(validatedFields.error.flatten().fieldErrors, { depth: null });

    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
    };
  }

  const responseData = await subscribeService(validatedFields.data.email);

  if (!responseData) {
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: null,
      errorMessage: "Oops! Something went wrong. Please try again later.",
    };
  }

  if (responseData.error) {
    console.error("Strapi error:", responseData.error);
    return {
      ...prevState,
      zodErrors: null,
      strapiErrors: responseData.error,
      errorMessage: "Failed to subscribe.",
    };
  }

  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    errorMessage: null,
    successMessage: "Succesfully subscribed to the newsletter!",
  };
}
