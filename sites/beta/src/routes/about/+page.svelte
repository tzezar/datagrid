<script>
	import PageContainer from '$lib/blocks/page-container.svelte';
	import PageNotDone from '$lib/blocks/page-not-done.svelte';
	import PageTitle from '$lib/blocks/page-title.svelte';

	import profile from '$lib/assets/img/profile.jpg';
	import doggo from '$lib/assets/img/doggo2.jpg';
	import video from '$lib/assets/video/video.mp4';
</script>

<!-- <PageNotDone /> -->

<PageContainer class="mx-auto flex max-w-screen-2xl flex-col gap-20 lg:pt-14 py-6 pb-14">
	<section class="">
		<div class="container mx-auto flex flex-col px-5">
			<div class="mx-auto lg:w-4/6">
				<img src={doggo} alt="" class="h-[500px] max-h-64 w-[1200px] object-cover object-center" />
				<div class="mt-20 flex flex-col sm:flex-row">
					<div class="text-center sm:w-1/3 sm:py-8 sm:pr-8">
						<div class="inline-flex h-24 w-24 items-center justify-center rounded-full">
							<img src={profile} alt="profile img" class="h-full w-full rounded-full" />
						</div>
						<div class="flex flex-col items-center justify-center text-center">
							<h2 class="title-font mt-4 text-lg font-medium">Sebastian "Tzezar" Drozd</h2>
							<div class="mb-4 mt-2 h-1 w-12 rounded bg-orange-500"></div>
							<p class="text-base">What man is a man who does not make the world better.</p>
						</div>
					</div>
					<div
						class="mt-4 border-t border-gray-200 pt-4 text-center sm:mt-0 sm:w-2/3 sm:border-l sm:border-t-0 sm:py-8 sm:pl-8 sm:text-left"
					>
						<p class="mb-4 text-justify text-lg leading-relaxed">
							When creating this datagrid, I kept in mind performance, ease of customization, but
							most importantly, ease of use. Reaching back when many years ago I started programming
							in react, it was impossible to find a ready-made datagrid that met all my
							expectations. Headless solutions were terribly hard for that moment to understand.
							Several factors contributed to this fact: poor documentation and the general
							complexity of datagrids. But data has to be displayed somehow, right?
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="body-font">
		<div class="container mx-auto flex flex-col px-5">
			<div class=" bg-primary-foreground mx-auto p-6 lg:w-4/6">
				<div class="flex flex-col sm:flex-row">
					<div class="text-center sm:py-8 sm:pr-8">
						<p class="text-lg leading-relaxed lg:text-center">
							Feel free to contact me if you have any questions and if you find this project useful
							then please leave a star on github. I'm currently facing unemployment and financial
							problems, and this might help me find some work. Thank you ❤️
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
	<section class="body-font mx-auto lg:w-4/6">
		<div class=" mx-auto px-6 2xl:px-14">
			<div class="-mx-4 -mb-10 flex flex-wrap 2xl:text-center ">
				<div class=" px-4 2xl:w-1/2">
					<h2 class="title-font mb-3 mt-6 text-2xl font-medium">Some informations</h2>
					<p class="text-justify text-lg leading-relaxed">
						This is not the first datagrid I have built. Given my previous experience, I think I
						have created something really decent and useful. I have spent many hours on this and
						hope that it will not be time wasted and that it will be useful to someone else. It will
						be used in several companies, so bug fixes and further support are rather guaranteed.
						Documentation will be created gradually in my spare time, now I unfortunately have some
						other activities. Unfortunately, because I planned to write everything at once.
					</p>
				</div>
				<div class=" px-4 2xl:w-1/2">
					<h2 class="title-font mb-3 mt-6 text-2xl font-medium">Current Version</h2>
					<p class="text-justify text-lg leading-relaxed">
						Datagrid is currently in Beta version. It is totally usable, but documentation needs to
						be created, one bug needs to be fixed and the code needs to be cleaned up. I'm making it
						available now so that you can familiarize yourself with the project, maybe already
						implement it into some cool ideas. I would greatly appreciate your help in improving
						this project, especially in implementing virtualization, which I have a problem with on
						svelte 5.
					</p>
				</div>
			</div>
		</div>
	</section>
</PageContainer>
