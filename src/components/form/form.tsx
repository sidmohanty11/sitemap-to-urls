import { $, component$, useComputed$, useSignal } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { validateUrl } from "~/helpers";
import ClipboardSVG from "~/media/clipboard.svg";

export default component$(() => {
  const url = useSignal<string>("");
  const loading = useSignal<boolean>(false);
  const sitemapUrls = useSignal<string[]>();
  const errors = useSignal<string[]>([]);
  const regexString = useSignal<string>("");
  const outputFormat = useSignal<"json" | "text">("json");
  const pathnamesOnly = useSignal<boolean>(false);

  const output = useComputed$(() => {
    let computedUrls = sitemapUrls.value;
    if (regexString.value) {
      const regexExp = new RegExp(regexString.value);
      computedUrls = sitemapUrls.value?.filter((url) => regexExp.test(url));
    }
    if (pathnamesOnly.value) {
      computedUrls = computedUrls?.map((url) => {
        return new URL(url).pathname;
      });
    }
    if (outputFormat.value === "json") {
      return JSON.stringify(computedUrls, null, 2);
    } else {
      return computedUrls?.join("\n");
    }
  });

  const fetchAndSerializeSitemap = server$(async (url: string) => {
    const res = await fetch(url);
    const text = await res.text();

    const urls = text
      .split("<loc>")
      .filter((_, idx) => idx !== 0)
      .map((url) => url.split("</loc>")[0]);

    return urls;
  });

  const copyToClipboard = $(() => {
    if (!output.value) {
      return;
    }
    navigator.clipboard.writeText(output.value).then(() => {
      alert("Content copied to clipboard!");
    });
  });

  const handleSubmit = $(async () => {
    errors.value = [];
    if (validateUrl(url.value)) {
      loading.value = true;
      try {
        const urls = await fetchAndSerializeSitemap(url.value);
        sitemapUrls.value = urls;
      } catch (e) {
        errors.value = [
          "There was an error fetching your sitemap, please try again.",
        ];
      }
      loading.value = false;
    } else {
      errors.value = ["Please enter a valid sitemap URL"];
      loading.value = false;
    }
  });

  return (
    <div class="w-full flex flex-col items-center justify-center">
      <div class="w-full flex flex-col items-center justify-center space-y-4">
        <input
          class="border p-2 w-2/3 focus:outline-stone-600"
          type="text"
          bind:value={url}
          placeholder="Enter your sitemap URL here"
          onKeyDown$={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
        <button
          disabled={loading.value}
          class={`text-white py-2 px-4 ml-2 ${loading.value ? "bg-neutral-500" : "bg-teal-600 hover:bg-teal-700"}`}
          onClick$={handleSubmit}
        >
          {loading.value ? "Loading..." : "Submit"}
        </button>
      </div>
      {errors.value.length > 0 && (
        <div class="w-full mt-4 text-sm text-red-600 text-center">
          {errors.value.map((error, idx) => (
            <div key={idx}>{error}</div>
          ))}
        </div>
      )}
      <div class="w-2/3 flex items-center justify-center space-x-4 mt-4">
        <input
          class="border p-2 w-full focus:outline-stone-600"
          type="text"
          bind:value={regexString}
          placeholder="Enter a regex to filter URLs"
        />
        <div class="flex items-center space-x-2">
          <input
            type="radio"
            id="json"
            name="output-format"
            value="json"
            checked={outputFormat.value === "json"}
            onChange$={() => {
              outputFormat.value = "json";
            }}
          />
          <label for="json">JSON</label>
        </div>
        <div class="flex items-center space-x-2">
          <input
            type="radio"
            name="output-format"
            id="text"
            value="text"
            checked={outputFormat.value === "text"}
            onChange$={() => {
              outputFormat.value = "text";
            }}
          />
          <label for="text">Text</label>
        </div>
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            id="pathnames-only"
            bind:checked={pathnamesOnly}
          />
          <label for="pathnames-only">Only Pathnames</label>
        </div>
      </div>
      <div class="w-full flex items-center justify-center">
        <pre class="mt-4 w-2/3 h-96 overflow-y-scroll border p-2 relative">
          {sitemapUrls.value && (
            <button
              class="absolute top-0 right-0 p-2 border shadow-sm hover:bg-teal-50"
              onClick$={copyToClipboard}
            >
              <img src={ClipboardSVG} class="w-8 h-8" alt="Copy to Clipboard" />
            </button>
          )}
          {output.value}
        </pre>
      </div>
    </div>
  );
});
