import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import Hero from "~/components/hero/hero";
import Form from "~/components/form/form";

export default component$(() => {
  return (
    <div class="container mx-auto flex flex-col h-full items-center justify-center p-5 my-10">
      <Hero />
      <Form />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sitemap to URLs",
  meta: [
    {
      name: "description",
      content:
        "Get all the URLs from a sitemap in a single click. Format them however you want.",
    },
  ],
};
