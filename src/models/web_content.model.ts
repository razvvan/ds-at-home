export interface WebItem {
	url: string
	zoom?: number
	scroll_to?: number
}

export interface Group {
	links: WebItem[]
	name: string
}

export interface Settings {
	defaultGroup: number
}

export interface AppConfig {
	groups: Group[]
	settings: Settings
}
