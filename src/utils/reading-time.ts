export function readingTime(body: string): string {
  const chinese = (body.match(/[一-鿿㐀-䶿]/g) || []).length;
  const english = (body.match(/[a-zA-Z]+/g) || []).length;
  const minutes = Math.ceil(chinese / 300 + english / 200);
  return minutes <= 1 ? "1 分钟" : `${minutes} 分钟`;
}
