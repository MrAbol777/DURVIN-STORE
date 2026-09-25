export function createMockOrderNumber() {
  const dateSegment = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const randomSegment = Math.floor(100000 + Math.random() * 900000);
  return `DVS-${dateSegment}-${randomSegment}`;
}
