import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { config } from '../config/env';

export default function Welcome({ setActiveTab }) {
  useEffect(() => {
    if (setActiveTab) setActiveTab('dashboard');
  }, [setActiveTab]);

  const handleEbayConnect = () => {
    const { clientId, ruName } = config;
    const scopes = [
      'https://api.ebay.com/oauth/api_scope/sell.fulfillment.readonly',
      'https://api.ebay.com/oauth/api_scope/sell.fulfillment',
    ];
    const scope = scopes.join(' ');
    const state = crypto.randomUUID();
    localStorage.setItem('ebay_state', state);
    const url =
      `https://auth.sandbox.ebay.com/oauth2/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(ruName)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scope)}` +
      `&state=${state}`;
    window.location.href = url;
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-100 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.06)]">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.6fr_1.4fr] lg:p-12">
            <div className="space-y-6">
              <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                Inventory Hub
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Welcome to your smarter stock control workspace.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                Manage products, monitor sales, and keep your online store running smoothly with a clean dashboard built for everyday operations.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleEbayConnect}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Connect eBay
                </button>
                <Link
                  to="/"
                  className="text-sm font-semibold text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline"
                >
                  Go to dashboard
                </Link>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Live stock</p>
                  <p className="mt-1 text-sm text-slate-500">Track inventory levels instantly.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Sales insight</p>
                  <p className="mt-1 text-sm text-slate-500">Review performance at a glance.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-700">Store ready</p>
                  <p className="mt-1 text-sm text-slate-500">Keep your business moving forward.</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-slate-50 p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-semibold text-slate-900">What you can do here</h2>
              <div className="mt-5 space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-700">Product management</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Add updates, organize listings, and stay on top of your catalog with ease.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-700">Sales overview</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Monitor revenue, trends, and profits from one simple view.
                  </p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-700">Store operations</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Keep orders, stock, and daily tasks aligned for a smoother workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
