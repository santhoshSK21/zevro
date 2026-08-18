// Bypassing MongoDB completely for Vercel Static POC
export default async function dbConnect() {
  return true;
}
