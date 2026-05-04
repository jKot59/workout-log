export function transformDateToUserFriendly(date: string) {
  return `${new Date(date).toLocaleDateString().replace(/\//g, '.')} ${new Date(date).toLocaleTimeString()}`;
}
