<script>
	import { onMount, tick } from "svelte";
	import { notification } from "./store.js";
    import {fade} from "svelte/transition";

	/** @type {import("./index.d.ts").ITheme} */
	export let themes = {
		danger: "#bb2124",
		success: "#22bb33",
		warning: "#f0ad4e",
		info: "#5bc0de",
		default: "#aaaaaa",
	};

	export let timeout = 5000;
	/** @type {null|string} */
	export let sessionKey = null;

	/** @type {Array<import("./index.d.ts").IToast>} */
	let toasts = [];

	/** @param {string} id @param {"paused"|"running"} state */
	function hover(id, state) {
		return () => {
			/** @type {null | Element & ({style?: {animationPlayState?: string}}|{})}*/
			let p = document.querySelector(`.progress[data-toast-id="${id}"]`)
			// @ts-ignore
			if(p?.style?.animationPlayState !== undefined) p.style.animationPlayState = state;
		}
	}

	/** @param {Object} param0 @param {{message:string,type:import("./index.d.ts").TNotificationType, options: import("./index.d.ts").IProps}} param0.detail */
	function createToast({ detail }) {
		const { message, type, options = {} } = detail;
		const background = themes[type] || themes.default;
		const persist = options.persist ?? false;
		const computedTimeout = options.persist ? 0 : options.timeout || timeout;
		const id = Math.random()
			.toString(36)
			.replace(/[^a-z]+/g, "");
		const showProgress = options.showProgress ?? true;
		const icon = options.icon ?? null;

		try {
			if (sessionKey !== null)
				sessionStorage.setItem(sessionKey, JSON.stringify([...JSON.parse(sessionStorage.getItem(sessionKey) || "[]"), { ...detail, id }]));
		} catch (e) {}

		toasts = [
			{
				id,
				message,
				background,
				persist,
				timeout: computedTimeout,
				showProgress,
				icon,
				width: "100%",
			},
			...toasts,
		];
	}

	/** @param {import("./index.d.ts").IToast} toast */
	function maybePurge(toast) {
		!toast.persist && purge(toast.id);
	}

	/** @param {import("./index.d.ts").IToast} toast */
	function maybePurgeAfterTimeout(toast) {
		setTimeout(() => maybePurge(toast), toast.timeout);
	}

	/** @param {string} id */
	function purge(id) {
		/** @param {import("./index.d.ts").IToast} t */
		const filter = (t) => t.id !== id;
		toasts = toasts.filter(filter);
		if (sessionKey !== null) {
			try {
				sessionStorage.setItem(sessionKey, JSON.stringify(JSON.parse(sessionStorage.getItem(sessionKey) || "[]").filter(filter)));
			} catch {}
		}
	}

	/**
	 * @type {HTMLUListElement}
	 */
	let toaster;
	onMount(async () => {
		const unsubscribe = notification.subscribe((value) => {
			if (!value) return;

			createToast({detail:value})
			notification.set(undefined);
		});

		await tick();
		if (sessionKey !== null) {
			try {
				const existing = JSON.parse(sessionStorage.getItem(sessionKey) ?? "{}");
				for (const n of existing) notification.set(n);
			} catch {
			} finally {
				try {
					sessionStorage.removeItem(sessionKey);
				} catch {}
			}
		}

		return {
			destroy: unsubscribe,
		};
	});
</script>

<ul class="toasts" bind:this={toaster}>
	{#each toasts as toast (toast.id)}
		<li class="toast" style="background: {toast.background};" out:fade={{duration:200}} on:mouseenter={hover(toast.id, "paused")} on:mouseleave={hover(toast.id, "running")}>
			<button class="close" on:click={() => purge(toast.id)}> ✕ </button>
			<div class="content">
				{#if toast.icon}
					<svelte:component this={toast.icon} />
				{/if}
				{toast.message}
			</div>
			{#if toast.showProgress}
				<div data-toast-id={toast.id} class="progress" style="animation-duration: {toast.timeout}ms;" on:animationend={() => maybePurge(toast)}></div>
			{:else}
				<span class="hidden">{maybePurgeAfterTimeout(toast)}</span>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.toasts {
		list-style: none;
		position: fixed;
		top: 0;
		right: 0;
		padding: 0;
		margin: 0;
		z-index: 9999;
	}

	.toasts > .toast {
		display: flex;
		align-items: center;
		position: relative;
		margin: 1vh 1vw;
		min-width: 98vw;
		position: relative;
		animation: animate-in 600ms forwards;
		color: #fff;
		min-height: 8vh;
	}

	.toasts > .toast > button {
		position: absolute;
		font-size: 18px;
		right: 0;
		margin: 6px;
		color: #fff;
		outline: none;
		border: 0;
		background-color: transparent;
		cursor: pointer;
	}

	.toasts > .toast > .content {
		padding: 1vw;
		display: flex;
		font-weight: 500;
		margin-right: 20px;
	}

	.toasts > .toast > .progress {
		position: absolute;
		bottom: 0;
		background-color: rgb(0, 0, 0, 0.3);
		height: 6px;
		width: 100%;
		animation-name: shrink;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
	}

	.toasts > .toast:before,
	.toasts > .toast:after {
		content: "";
		position: absolute;
		z-index: -1;
		top: 50%;
		bottom: 0;
		left: 1vw;
		right: 1vw;
		border-radius: 100px / 10px;
	}

	.toasts > .toast:after {
		right: 1vw;
		left: auto;
		transform: skew(8deg) rotate(3deg);
	}

	@keyframes animate-in {
		0%,
		60%,
		75%,
		90%,
		to {
			-webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
			animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
		}

		0% {
			opacity: 0;
			transform: translate3d(3000px, 0, 0);
		}

		60% {
			opacity: 1;
			transform: translate3d(-25px, 0, 0);
		}

		75% {
			transform: translate3d(10px, 0, 0);
		}

		90% {
			transform: translate3d(-5px, 0, 0);
		}

		to {
			transform: none;
		}
	}

	@keyframes shrink {
		0% {
			width: 98vw;
		}
		100% {
			width: 0;
		}
	}

	@media (min-width: 480px) {
		@keyframes animate-in {
			0%,
			60%,
			75%,
			90%,
			to {
				-webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
				animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
			}

			0% {
				opacity: 0;
				transform: translate3d(3000px, 0, 0);
			}

			60% {
				opacity: 1;
				transform: translate3d(-25px, 0, 0);
			}

			75% {
				transform: translate3d(10px, 0, 0);
			}

			90% {
				transform: translate3d(-5px, 0, 0);
			}

			to {
				transform: none;
			}
		}

		@keyframes shrink {
			0% {
				width: 40vw;
			}
			100% {
				width: 0;
			}
		}
	}

	@media screen and (min-width: 600px) {
		.toasts > .toast {
			min-width: 40vw;
			min-height: auto;
		}

		.toasts > .toast > .content {
			justify-content: flex-start;
		}
	}

	.hidden {
		display: none;
	}
</style>
