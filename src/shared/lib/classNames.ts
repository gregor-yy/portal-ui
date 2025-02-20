type ClassValue = string | number | boolean | null | undefined | { [key: string]: boolean };

export const classNames = (...args: ClassValue[]): string => {
  return args
    .map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        return Object.keys(arg)
          .filter(key => arg[key as keyof typeof arg])
          .join(' ');
      }
      if (typeof arg === 'string' || typeof arg === 'number') {
        return arg.toString();
      }
      return '';
    })
    .filter(Boolean) 
    .join(' ');
}
