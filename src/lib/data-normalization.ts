/**
 * Recursively converts all keys of an object or array of objects to camelCase.
 * This is useful for handling PascalCase responses from C# backends.
 */
export function normalizeKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => normalizeKeys(v));
  } else if (obj !== null && obj !== undefined && obj.constructor === Object) {
    return Object.keys(obj).reduce(
      (result, key) => {
        const value = obj[key];
        const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
        
        // Handle nested objects/arrays
        const normalizedValue = normalizeKeys(value);
        
        return {
          ...result,
          [camelKey]: normalizedValue,
        };
      },
      {},
    );
  }
  return obj;
}
