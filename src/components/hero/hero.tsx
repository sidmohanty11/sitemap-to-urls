import { component$ } from "@builder.io/qwik";
import SitesSVG from "~/media/sites.svg";

export default component$(() => {
  return (
    <div class="max-w-5xl pb-10 text-center md:pb-16">
      <div class="flex justify-center items-center">
        <img src={SitesSVG} class="w-32 h-32" alt="Paint" />
        <h1 class="font-heading leading-tighter text-5xl font-bold tracking-tighter text-gray-90 md:text-6xl">
          Sitemap <span class="text-neutral-600">to</span> URLs
        </h1>
      </div>
      <div class="mx-auto max-w-3xl">
        <p class="text-muted mb-6 text-xl font-light">
          Get all the URLs from a sitemap in a single click. Format them however
          you want.
        </p>
      </div>
    </div>
  );
});
