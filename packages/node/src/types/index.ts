export * from "./user";
export * from "./oauth";

/**
 * This is a base type for all entities in the application.
 */
export type BaseEntity = {
	id: string;
	createdAt: Date;
};

/**
 * This is a base type for all updatable entities in the application.
 */
export type UpdatableBaseEntity = BaseEntity & {
	updatedAt: Date;
};

/**
 * This is a utility type that excludes the properties of BaseEntity from T (UpdatableBaseEntity is same with `updatedAt` added, so it surely removes all BaseEntity fields).
 */
export type ExcludeBaseEntity<T> = Omit<T, keyof UpdatableBaseEntity>;

/**
 * This is a utility type that makes all properties of T required and allows nested objects to be optional as well.
 */
export type Nullable<T> = T | null;

/**
 * This is a utility type that makes all properties of T optional and allows nested objects to be nullable as well.
 */
export type Optional<T> = T | undefined;

/**
 * This is a utility type that makes all properties of T optional and allows nested objects to be optional and nullable as well.
 */
export type OptionalNullable<T> = T | undefined | null;

/**
 * This is a utility type that makes all properties of T optional and allows nested objects to be optional as well.
 */
export type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/**
 * This is a utility type that makes all properties of T required and allows nested objects to be required as well.
 */
export type DeepRequired<T> = {
	[K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};

/**
 * This is a utility type that makes all properties of T readonly and allows nested objects to be readonly as well.
 * It is useful for creating immutable types.
 */
export type DeepReadonly<T> = {
	[K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};

/**
 * This is a utility type that makes all properties of T writable and allows nested objects to be writable as well.
 * It is useful for creating mutable types.
 */
export type DeepWritable<T> = {
	[K in keyof T]: T[K] extends object ? DeepWritable<T[K]> : T[K];
};

export enum Currency {
	EUR = "EUR",
	USD = "USD",
	GBP = "GBP",
}

export enum Language {
	EN = "EN",
	DE = "DE",
	FR = "FR",
	ES = "ES",
	IT = "IT",
}

export type Location = {
	address: string;
	zipCode: string;
	city: string;
	country: string;
};

export type SortOrder = "asc" | "desc";

export type ArraySortOptions = {
	field: string;
	order: SortOrder;
};

export type ArrayPaginationOptions = {
	page?: number;
	limit?: number;
	offset: number;
};

export type FilterOperator =
	| "eq"
	| "ne"
	| "gt"
	| "lt"
	| "gte"
	| "lte"
	| "like"
	| "in"
	| "nin";

export type ArrayFilterOptions = {
	field: string;
	value: string;
	operator: FilterOperator;
};

export type ArrayResult<T> = {
	items: T[];
	total: number;
	page: number;
	limit: number;
};
