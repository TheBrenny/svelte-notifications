import { SvelteComponent } from 'svelte'

export type TNotificationType =
	| 'default'
	| 'danger'
	| 'warning'
	| 'info'
	| 'success'

export interface TNotifier {
	send(message: string, type: TNotificationType, timeout?: number): void
	danger(message: string, timeout?: number): void
	warning(message: string, timeout?: number): void
	info(message: string, timeout?: number): void
	success(message: string, timeout?: number): void
}

export interface ITheme {
	danger: string
	success: string
	warning: string
	info: string
	default: string
}

type IProps = { themes?: ITheme; timeout?: number; persist?: boolean; showProgress?: boolean; icon?: SvelteComponent }

type IToast = {
	id: string;
	message: string;
	background: string;
	persist: boolean;
	timeout: number;
	showProgress: boolean;
	icon: Component | null;
	width: string;
}

export class NotificationDisplay extends SvelteComponent<IProps> { }
export const notifier: TNotifier