"use server";
import { EventSubscribeState, SubscribeState } from "@/types";
import { z } from "zod";
import {
  EventsSubscribeProps,
  eventsSubscribeService,
  subscribeService,
} from "./services";

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

const eventsSubscribeSchema = z.object({
  firstName: z.string().min(1, {
    message: "Please enter your first name",
  }),
  lastName: z.string().min(1, {
    message: "Please enter your last name",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  telephone: z
    .string()
    .min(1, { message: "Please enter your phone number" })
    .regex(
      /^(\+\d{1,3}[-.]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
      {
        message: "Please enter a valid phone number",
      }
    ),
});

export async function eventsSubscribeAction(
  prevState: EventSubscribeState,
  formData: FormData
): Promise<EventSubscribeState> {
  const formDataObject = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    eventId: formData.get("eventId"),
  };

  const validatedFields = eventsSubscribeSchema.safeParse(formDataObject);

  if (!validatedFields.success) {
    return {
      ...prevState,
      zodErrors: validatedFields.error.flatten().fieldErrors,
      strapiErrors: null,
      formData: {
        ...formDataObject,
      },
    };
  }

  const dataToSend: EventsSubscribeProps = {
    ...validatedFields.data,
    event: {
      connect: [formDataObject.eventId as string],
    },
  };

  const responseData = await eventsSubscribeService(dataToSend);

  if (!responseData) {
    return {
      ...prevState,
      strapiErrors: null,
      zodErrors: null,
      errorMessage: "Ops! Something went wrong. Please try again.",
    };
  }

  if (responseData.error) {
    return {
      ...prevState,
      strapiErrors: responseData.error,
      zodErrors: null,
      formData: {
        ...formDataObject,
      },
      errorMessage: "Failed to Subscribe.",
    };
  }

  return {
    ...prevState,
    zodErrors: null,
    strapiErrors: null,
    errorMessage: null,
    formData: null,
    successMessage: "Successfully Subscribed!",
  };
}
