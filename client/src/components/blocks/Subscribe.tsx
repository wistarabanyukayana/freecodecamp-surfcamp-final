"use client";
import type { SubscribeProps, SubscribeState } from "@/types";
import { useActionState } from "react";
import { subscribeAction } from "@/data/actions";

const INITIAL_STATE: SubscribeState = {
  zodErrors: null,
  strapiErrors: null,
  errorMessage: null,
  successMessage: null,
};

export function Subscribe({
  headline,
  content,
  placeholder,
  buttonText,
}: Readonly<SubscribeProps>) {
  const [formState, formAction] = useActionState(
    subscribeAction,
    INITIAL_STATE
  );

  console.log("Form state:", formState);
  const zodErrors = formState?.zodErrors;
  const strapiErrors = formState?.strapiErrors?.message;

  const errorMessage =
    zodErrors?.email?.[0] || strapiErrors || formState?.errorMessage;
  const successMessage = formState?.successMessage;

  return (
    <section className="newsletter container">
      <div className="newsletter__info">
        <h4>{headline}</h4>
        <p className="copy">{content}</p>
      </div>
      <form className="newsletter__form" action={formAction}>
        <input
          name="email"
          type="text"
          placeholder={errorMessage || successMessage || placeholder}
          className={`newsletter__email ${
            errorMessage ? "newsletter__email--error" : ""
          }`}
        />
        <button
          type="submit"
          className="newsletter__subscribe btn btn--turquoise btn--medium"
        >
          {buttonText}
        </button>
      </form>
    </section>
  );
}
