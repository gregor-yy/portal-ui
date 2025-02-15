export function generateId() {
    return 'uid-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}
