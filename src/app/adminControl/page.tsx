import { redirect } from 'next/navigation';
import dbConnect from '../../lib/mongodb';
import { StoreConfig } from '../../models/StoreConfig';

export const dynamic = 'force-dynamic';

export default async function AdminControlRoot() {
  try {
    await dbConnect();
    const config = await StoreConfig.findOne().lean();
    if (config && config.setupCompleted) {
      redirect('/adminControl/dashboard');
    }
  } catch (error) {
    // Fallback if DB connects fail
  }
  redirect('/adminControl/setup');
}
