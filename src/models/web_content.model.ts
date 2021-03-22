export interface WebItem {
	url: string
	zoom?: number
	scroll_to?: number
	prepend_element_by_class_to_body?: string
	prepend_element_by_id_to_body?: string
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
