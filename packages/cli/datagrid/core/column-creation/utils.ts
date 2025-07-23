export function setNestedValue(obj: any, path: string, value: any): any {
	if (!path) return obj;

	const keys = path.split('.');
	const lastKey = keys.pop();

	let nested = { ...obj };
	let current = nested;

	for (const key of keys) {
		current[key] = { ...current[key] };
		current = current[key];
	}

	if (lastKey) current[lastKey] = value;

	return nested;
}

/**
 * Retrieves a nested value from an object using dot notation path.
 * 
 * @param {T} obj The object to retrieve the value from.
 * @param {string} path The dot notation path specifying the nested value.
 * @returns {any} The value found at the given path in the object.
 * 
 * @example
 * getNestedValue({ user: { profile: { name: 'John' } } }, 'user.profile.name'); // 'John'
 */
export function getNestedValue<T>(obj: T, path: string): any {
  return path.split('.').reduce((acc: any, key: string) => acc?.[key], obj);
}