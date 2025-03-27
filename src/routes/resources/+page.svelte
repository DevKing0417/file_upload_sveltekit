<script lang="ts">
  import { onMount } from 'svelte';
  import type { Resource } from '@prisma/client';
  import UploadModal from './UploadModal.svelte';

  let resources: Resource[] = [];
  let showUploadModal = false;

  onMount(async () => {
    await loadResources();
  });

  async function loadResources() {
    const response = await fetch('/api/resources');
    resources = await response.json();
  }

  async function handleUploadSuccess() {
    showUploadModal = false;
    await loadResources();
  }
</script>

<div class="px-4 sm:px-6 lg:px-8">
  <div class="sm:flex sm:items-center">
    <div class="sm:flex-auto">
      <div class="flex space-x-4 mb-4">
        <button class="bg-gray-200 px-4 py-2 rounded-md text-sm font-medium text-gray-700">All</button>
        <button class="hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium text-gray-700">Videos</button>
        <button class="hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium text-gray-700">Documents</button>
        <button class="hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium text-gray-700">Lessons</button>
        <button class="hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium text-gray-700">Archive</button>
      </div>
    </div>
    <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto"
        on:click={() => showUploadModal = true}
      >
        Upload
      </button>
    </div>
  </div>
  <div class="mt-8 flex flex-col">
    <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table class="min-w-full divide-y divide-gray-300">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Content Title</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Path</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">View Count</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Uploaded By</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Provider</th>
                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                  <span class="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              {#each resources as resource}
                <tr>
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{resource.title}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Mentoring Path</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{resource.viewCount}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{resource.uploadedBy}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{resource.provider}</td>
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{resource.fileType}</td>
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <button class="text-primary hover:text-primary-hover">View<span class="sr-only">, {resource.title}</span></button>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>

{#if showUploadModal}
  <UploadModal
    on:close={() => showUploadModal = false}
    on:success={handleUploadSuccess}
  />
{/if} 