<script>
	import { links } from '$lib/hrefs';
	import ShowcaseDatagrid from './_components/showcase-datagrid/showcase-datagrid.svelte';
</script>

<div></div>

<section class="pb-12 lg:py-24">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="mb-14 text-center">
			<h2 class="py-5 text-center text-4xl font-bold">Powerfull Datagrid with Advanced Features</h2>
			<p class="text-secondary-foreground mx-auto max-w-md text-lg font-normal md:max-w-2xl">
				Powerful. Flexible. Developer-friendly.
			</p>
		</div>
		<!-- Updated grid layout -->
		<div class="grid w-full grid-cols-1 justify-items-center gap-8 gap-x-8 lg:grid-cols-4">
			<div class="group relative w-full max-w-sm text-center">
				<div
					class="mx-auto mb-5 flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg bg-orange-50 transition-all duration-500 group-hover:bg-orange-600"
				>
					<svg
						class="stroke-orange-600 transition-all duration-500 group-hover:stroke-white"
						width="30"
						height="30"
						viewBox="0 0 30 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M10 27.5L15 25M15 25V21.25M15 25L20 27.5M8.75 14.375L12.5998 11.0064C13.1943 10.4862 14.1163 10.6411 14.5083 11.327L15.4917 13.048C15.8837 13.7339 16.8057 13.8888 17.4002 13.3686L21.25 10M2.5 2.5H27.5M26.25 2.5V13.25C26.25 17.0212 26.25 18.9069 25.0784 20.0784C23.9069 21.25 22.0212 21.25 18.25 21.25H11.75C7.97876 21.25 6.09315 21.25 4.92157 20.0784C3.75 18.9069 3.75 17.0212 3.75 13.25V2.5"
							stroke=""
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
				</div>
				<h4 class="mb-3 text-lg font-medium capitalize">Blazing-Fast Performance</h4>
				<p class="text-secondary-foreground text-sm font-normal">
					Handles hundreds of thousands of rows effortlessly. Never compromise on speed, even with
					complex operations.
				</p>
			</div>
			<div class="group relative w-full max-w-sm text-center">
				<div
					class="mx-auto mb-5 flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg bg-pink-50 transition-all duration-500 group-hover:bg-pink-600"
				>
					<svg
						class="stroke-pink-600 transition-all duration-500 group-hover:stroke-white"
						width="30"
						height="30"
						viewBox="0 0 30 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M2.5 7.5C2.5 4.73858 4.73858 2.5 7.5 2.5C10.2614 2.5 12.5 4.73858 12.5 7.5C12.5 10.2614 10.2614 12.5 7.5 12.5C4.73858 12.5 2.5 10.2614 2.5 7.5Z"
							stroke=""
							stroke-width="2"
						></path>
						<path
							d="M2.5 22.5C2.5 20.143 2.5 18.9645 3.23223 18.2322C3.96447 17.5 5.14298 17.5 7.5 17.5C9.85702 17.5 11.0355 17.5 11.7678 18.2322C12.5 18.9645 12.5 20.143 12.5 22.5C12.5 24.857 12.5 26.0355 11.7678 26.7678C11.0355 27.5 9.85702 27.5 7.5 27.5C5.14298 27.5 3.96447 27.5 3.23223 26.7678C2.5 26.0355 2.5 24.857 2.5 22.5Z"
							stroke=""
							stroke-width="2"
						></path>
						<path
							d="M17.5 7.5C17.5 5.14298 17.5 3.96447 18.2322 3.23223C18.9645 2.5 20.143 2.5 22.5 2.5C24.857 2.5 26.0355 2.5 26.7678 3.23223C27.5 3.96447 27.5 5.14298 27.5 7.5C27.5 9.85702 27.5 11.0355 26.7678 11.7678C26.0355 12.5 24.857 12.5 22.5 12.5C20.143 12.5 18.9645 12.5 18.2322 11.7678C17.5 11.0355 17.5 9.85702 17.5 7.5Z"
							stroke=""
							stroke-width="2"
						></path>
						<path
							d="M17.5 22.5C17.5 19.7386 19.7386 17.5 22.5 17.5C25.2614 17.5 27.5 19.7386 27.5 22.5C27.5 25.2614 25.2614 27.5 22.5 27.5C19.7386 27.5 17.5 25.2614 17.5 22.5Z"
							stroke=""
							stroke-width="2"
						></path>
					</svg>
				</div>
				<h4 class="mb-3 text-lg font-medium capitalize">Developer-Friendly API</h4>
				<p class="text-secondary-foreground text-sm font-normal">
					Built with TypeScript for superior type safety and autocompletion. Comprehensive
					documentation and starter templates get you up and running in minutes.
				</p>
			</div>
			<div class="group relative w-full max-w-sm text-center">
				<div
					class="mx-auto mb-5 flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg bg-teal-50 transition-all duration-500 group-hover:bg-teal-600"
				>
					<svg
						class="stroke-teal-600 transition-all duration-500 group-hover:stroke-white"
						width="30"
						height="30"
						viewBox="0 0 30 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M3.75 26.25H26.25M6.25 22.875C4.86929 22.875 3.75 21.8676 3.75 20.625V12.75C3.75 11.5074 4.86929 10.5 6.25 10.5C7.63071 10.5 8.75 11.5074 8.75 12.75V20.625C8.75 21.8676 7.63071 22.875 6.25 22.875ZM15 22.875C13.6193 22.875 12.5 21.8676 12.5 20.625V9.375C12.5 8.13236 13.6193 7.125 15 7.125C16.3807 7.125 17.5 8.13236 17.5 9.375V20.625C17.5 21.8676 16.3807 22.875 15 22.875ZM23.75 22.875C22.3693 22.875 21.25 21.8676 21.25 20.625V6C21.25 4.75736 22.3693 3.75 23.75 3.75C25.1307 3.75 26.25 4.75736 26.25 6V20.625C26.25 21.8676 25.1307 22.875 23.75 22.875Z"
							stroke=""
							stroke-width="2"
							stroke-linecap="round"
						></path>
					</svg>
				</div>
				<h4 class="mb-3 text-lg font-medium capitalize">Headless Core & Prebuilt Enhanced Wrapper</h4>
				<p class="text-secondary-foreground text-sm font-normal">
					The Headless Core offers complete flexibility for building a custom data grid from scratch, while the Prebuilt Enhanced Wrapper provides a feature-rich, styled solution with built-in sorting, pagination, and more, ready for quick deployment.
				</p>
			</div>
			<!-- class="group relative w-full text-center max-md:mx-auto max-md:max-w-sm md:w-2/5 lg:w-1/4" -->
			<div class="group relative w-full max-w-sm text-center">
				<div
					class="mx-auto mb-5 flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg bg-orange-50 transition-all duration-500 group-hover:bg-orange-600"
				>
					<svg
						class="stroke-orange-600 transition-all duration-500 group-hover:stroke-white"
						width="30"
						height="30"
						viewBox="0 0 30 30"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M15.4167 12.0833V21.25M5.41667 21.25V20.8333C5.41667 19.262 5.41667 18.4763 5.90482 17.9882C6.39298 17.5 7.17865 17.5 8.75 17.5H22.0833C23.6547 17.5 24.4404 17.5 24.9285 17.9882C25.4167 18.4763 25.4167 19.262 25.4167 20.8333V21.25M15.4167 9.16667C13.8453 9.16667 13.0596 9.16667 12.5715 8.67851C12.0833 8.19036 12.0833 7.40468 12.0833 5.83333C12.0833 4.26198 12.0833 3.47631 12.5715 2.98816C13.0596 2.5 13.8453 2.5 15.4167 2.5C16.988 2.5 17.7737 2.5 18.2618 2.98816C18.75 3.47631 18.75 4.26198 18.75 5.83333C18.75 7.40468 18.75 8.19036 18.2618 8.67851C17.7737 9.16667 16.988 9.16667 15.4167 9.16667ZM7.08333 25.8333C7.08333 26.7538 6.33714 27.5 5.41667 27.5C4.49619 27.5 3.75 26.7538 3.75 25.8333C3.75 24.9129 4.49619 24.1667 5.41667 24.1667C6.33714 24.1667 7.08333 24.9129 7.08333 25.8333ZM17.0833 25.8333C17.0833 26.7538 16.3371 27.5 15.4167 27.5C14.4962 27.5 13.75 26.7538 13.75 25.8333C13.75 24.9129 14.4962 24.1667 15.4167 24.1667C16.3371 24.1667 17.0833 24.9129 17.0833 25.8333ZM27.0833 25.8333C27.0833 26.7538 26.3371 27.5 25.4167 27.5C24.4962 27.5 23.75 26.7538 23.75 25.8333C23.75 24.9129 24.4962 24.1667 25.4167 24.1667C26.3371 24.1667 27.0833 24.9129 27.0833 25.8333Z"
							stroke=""
							stroke-width="2"
							stroke-linecap="round"
						></path>
					</svg>
				</div>
				<h4 class="mb-3 text-lg font-medium capitalize">Complete Control</h4>
				<p class="text-secondary-foreground text-sm font-normal">
					Embracing the ShadCN philosophy, you hold full authority over your code. Customize and modify every aspect to suit your needs—nothing is off-limits!
				</p>
			</div>
		</div>
	</div>
</section>

<div class="mx-auto max-w-[90rem]">
	<ShowcaseDatagrid />
</div>

<section class="body-font">
	<div class="container mx-auto flex flex-wrap items-center px-5 py-12 lg:py-24">
		<div
			class="mb-10 border-b border-gray-200 pb-10 md:mb-0 md:w-1/2 md:border-b-0 md:border-r md:py-8 md:pr-12"
		>
			<h1 class="title-font mb-2 text-2xl font-medium sm:text-3xl">Displaying data made easy</h1>
			<p class="text-base leading-relaxed">
				Are you looking for a powerful datagrid packed with functionality, yet easy to customize,
				and as a plug-and-play component? Well, you couldn't have come to a better place!
			</p>
			<a
				class="mt-4 inline-flex items-center text-orange-500"
				href={'/headless/quick-start/getting-started'}
			>
				Learn More
				<svg
					fill="none"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					class="ml-2 h-4 w-4"
					viewBox="0 0 24 24"
				>
					<path d="M5 12h14M12 5l7 7-7 7"></path>
				</svg>
			</a>
		</div>
		<div class="flex flex-col md:w-1/2 md:pl-12 w-full">
			<h2 class="title-font mb-3 text-sm font-semibold tracking-wider">QUICK START</h2>
			<nav class="-mb-1 grid grid-cols-1 list-none gap-y-2 text-sm ">
				<a href="/headless/quick-start/overview">Overview</a>
				<a href="/headless/quick-start/getting-started">Getting started</a>
				<br/>
				<a href="/enhanced/overview">Enhanced datagrid overview</a>
			</nav>
		</div>
	</div>
</section>
