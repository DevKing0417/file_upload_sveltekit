<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { z } from 'zod';

  const dispatch = createEventDispatcher();

  const categories = ['Leadership', 'Managing Complexity', 'Communication', 'Problem Solving'];
  const languages = ['en', 'it', 'es', 'fr', 'de'];
  const providers = ['Skilla', 'Linkedin', 'Pack', 'Mentor'];
  const roles = ['Mentor/Coach', 'Mentee/Coachee'];

  let title = '';
  let description = '';
  let category = '';
  let language = '';
  let provider = '';
  let selectedRoles: string[] = [];
  let file: FileList | null = null;
  let errors: Record<string, string> = {};

  const schema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(1000),
    category: z.string().min(1),
    language: z.string().min(1),
    provider: z.string().min(1),
    roles: z.array(z.string()).min(1),
    file: z.instanceof(FileList).refine((files) => files.length > 0, 'File is required')
  });

  async function handleSubmit() {
    try {
      const formData = new FormData();
      const data = {
        title,
        description,
        category,
        language,
        provider,
        roles: selectedRoles,
        file
      };

      schema.parse(data);
      errors = {};

      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('language', language);
      formData.append('provider', provider);
      formData.append('roles', JSON.stringify(selectedRoles));
      if (file?.[0]) {
        formData.append('file', file[0]);
      }

      const response = await fetch('/api/resources', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        dispatch('success');
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        errors = error.formErrors.fieldErrors;
      }
    }
  }
</script>

<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

<div class="fixed inset-0 z-10 overflow-y-auto">
  <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
    <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
      <div class="absolute right-0 top-0 pr-4 pt-4">
        <button
          type="button"
          class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          on:click={() => dispatch('close')}
        >
          <span class="sr-only">Close</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="sm:flex sm:items-start">
        <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
          <h3 class="text-lg font-semibold leading-6 text-gray-900">Upload Resource</h3>
          <form class="mt-6 space-y-4" on:submit|preventDefault={handleSubmit}>
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                bind:value={title}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                maxlength="200"
              />
              {#if errors.title}
                <p class="mt-1 text-sm text-red-600">{errors.title}</p>
              {/if}
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                bind:value={description}
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                maxlength="1000"
              />
              {#if errors.description}
                <p class="mt-1 text-sm text-red-600">{errors.description}</p>
              {/if}
            </div>

            <div>
              <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                bind:value={category}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="">Select a category</option>
                {#each categories as cat}
                  <option value={cat}>{cat}</option>
                {/each}
              </select>
              {#if errors.category}
                <p class="mt-1 text-sm text-red-600">{errors.category}</p>
              {/if}
            </div>

            <div>
              <label for="language" class="block text-sm font-medium text-gray-700">Language</label>
              <select
                id="language"
                bind:value={language}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="">Select a language</option>
                {#each languages as lang}
                  <option value={lang}>{lang.toUpperCase()}</option>
                {/each}
              </select>
              {#if errors.language}
                <p class="mt-1 text-sm text-red-600">{errors.language}</p>
              {/if}
            </div>

            <div>
              <label for="provider" class="block text-sm font-medium text-gray-700">Provider</label>
              <select
                id="provider"
                bind:value={provider}
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="">Select a provider</option>
                {#each providers as prov}
                  <option value={prov}>{prov}</option>
                {/each}
              </select>
              {#if errors.provider}
                <p class="mt-1 text-sm text-red-600">{errors.provider}</p>
              {/if}
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Roles</label>
              <div class="mt-2 space-y-2">
                {#each roles as role}
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      id={role}
                      value={role}
                      bind:group={selectedRoles}
                      class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label for={role} class="ml-2 text-sm text-gray-700">{role}</label>
                  </div>
                {/each}
              </div>
              {#if errors.roles}
                <p class="mt-1 text-sm text-red-600">{errors.roles}</p>
              {/if}
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">File</label>
              <div class="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label for="file-upload" class="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        type="file"
                        bind:files={file}
                        class="sr-only"
                      />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">PDF, TXT, Video, or Slides up to 10MB</p>
                </div>
              </div>
              {#if errors.file}
                <p class="mt-1 text-sm text-red-600">{errors.file}</p>
              {/if}
            </div>

            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                class="inline-flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Upload
              </button>
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
                on:click={() => dispatch('close')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div> 