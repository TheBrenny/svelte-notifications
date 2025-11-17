
import {notification} from './store.js'
import {tick} from 'svelte'

async function toaster(node, sessionKey) {
	const unsubscribe = notification.subscribe(value => {
		if(!value) return;

		node.dispatchEvent(new CustomEvent('notify', {detail: value}));
		notification.set();
	});

	await tick();
	if(sessionKey !== null) {
		try {
			const existing = JSON.parse(sessionStorage.getItem(sessionKey));
			for(const n of existing) notification.set(n);
		} catch {} finally {
			try {sessionStorage.removeItem(sessionKey);} catch {}
		}
	}

	return {
		destroy: unsubscribe
	};
}

export {toaster}
