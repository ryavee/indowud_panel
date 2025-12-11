// src/Pages/PrivacyPolicy.jsx
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo_Indowud.png"; // adjust path if needed

const teal = "#169698";

export default function PrivacyPolicy() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#E6F8F6] text-gray-800 flex flex-col">
            {/* Header (theme like Login) */}
            <header className="bg-gradient-to-r from-[#169698] to-[#128083] shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                <img src={logo} alt="Indowud logo" className="w-10 h-10 object-contain" />
                            </div>
                            <div className="hidden sm:flex flex-col leading-none">
                                <span className="text-white text-sm font-bold tracking-wide">INDOWUD NFC PRIVATE LIMITED</span>
                            </div>
                        </div>

                        {/* Desktop nav */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/privacy-policy" className="text-sm font-semibold text-white">Privacy Policy</Link>
                        </nav>

                        
                    </div>

                   
                </div>
            </header>

            {/* HERO */}
            <div className="bg-white/0 border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                                Privacy Policy
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Last updated: <span className="font-medium text-gray-800">{new Date().toLocaleDateString()}</span>
                            </p>
                            <p className="mt-4 max-w-2xl text-sm text-gray-700">
                                This policy explains how Indowud collects, uses and protects your personal information when you use our services.
                            </p>
                        </div>

                        {/* Intentionally removed Print / Download buttons */}
                        <div className="hidden sm:flex items-center gap-3">
                            {/* placeholder left intentionally empty to preserve layout */}
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* LEFT: TOC */}
                    <aside className="md:col-span-1">
                        <div className="sticky top-24 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3">On this page</h3>

                            <nav className="text-sm space-y-2">
                                <a href="#intro" className="block text-gray-600 hover:text-teal-600">Introduction</a>
                                <a href="#data" className="block text-gray-600 hover:text-teal-600">Data we collect</a>
                                <a href="#location" className="block text-gray-600 hover:text-teal-600">Location Information</a>
                                <a href="#use" className="block text-gray-600 hover:text-teal-600">How we use data</a>
                                <a href="#cookies" className="block text-gray-600 hover:text-teal-600">Cookies & Tracking</a>
                                <a href="#sharing" className="block text-gray-600 hover:text-teal-600">Sharing & Third Parties</a>
                                <a href="#security" className="block text-gray-600 hover:text-teal-600">Security</a>
                                <a href="#rights" className="block text-gray-600 hover:text-teal-600">Your rights</a>
                                <a href="#changes" className="block text-gray-600 hover:text-teal-600">Changes</a>
                                <a href="#contact" className="block text-gray-600 hover:text-teal-600">Contact</a>
                            </nav>

                        </div>
                    </aside>

                    {/* RIGHT: CONTENT */}
                    <article className="md:col-span-3 space-y-6">
                        <section id="intro" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">Introduction</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Indowud ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains the types of personal information we collect, why we collect it, and how you can exercise your rights.
                            </p>
                        </section>

                        <section id="data" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Data we collect</h2>
                            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-2">
                                <li><strong>Account information:</strong> name, email, phone, hashed password.</li>
                                <li><strong>Profile & usage:</strong> profile images, preferences, activity logs.</li>
                                <li><strong>Transaction data:</strong> purchases, redemptions, invoices.</li>
                                <li><strong>Device & log data:</strong> IP address, browser, cookies, timestamps.</li>
                            </ul>
                        </section>

                        <section id="location" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Location Information</h2>

                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                Our app collects and uses your device’s location information to provide certain features
                                and improve your overall experience. This may include both foreground and, if permitted
                                by you, background location data.
                            </p>

                            <h3 className="text-sm font-semibold text-gray-800 mb-2">1. What Location Data We Collect</h3>
                            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-2 mb-4">
                                <li><strong>Approximate location:</strong> based on network or Wi-Fi signals.</li>
                                <li><strong>Precise location:</strong> GPS and network-based data.</li>
                                <li><strong>Background location:</strong> only if you explicitly grant permission.</li>
                            </ul>

                            <h3 className="text-sm font-semibold text-gray-800 mb-2">2. Why We Collect Location Data</h3>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                We use your location to provide accurate nearby services, offers, and rewards; enable
                                location-based features; and improve app performance.
                                If background location is enabled, the app may continue to collect location data even
                                when closed or not actively in use, strictly for the purposes listed above.
                            </p>

                            <h3 className="text-sm font-semibold text-gray-800 mb-2">3. How We Use Location Data</h3>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                Your location data is used only for:
                            </p>
                            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-2 mb-4">
                                <li>Showing relevant offers, rewards, or nearby features</li>
                                <li>Enhancing app performance and location-based functionality</li>
                            </ul>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                We do <strong>not</strong> sell, share, or disclose your location data to third parties
                                for advertising or marketing.
                            </p>

                            <h3 className="text-sm font-semibold text-gray-800 mb-2">4. User Control Over Location Data</h3>
                            <ul className="list-disc ml-5 text-sm text-gray-700 space-y-2 mb-4">
                                <li>Enable or disable location access at any time in your device settings</li>
                                <li>Withdraw permission for background location use</li>
                                <li>Continue using the app with limited functionality without granting location access</li>
                            </ul>

                            <h3 className="text-sm font-semibold text-gray-800 mb-2">5. Data Storage and Retention</h3>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                Location data is retained only as long as necessary to provide the features mentioned
                                above. When no longer required, the data is securely deleted or anonymized.
                            </p>

                            <h3 className="text-sm font-semibold text-gray-800 mb-2">6. Third-Party Services</h3>
                            <p className="text-sm text-gray-700 leading-relaxed mb-4">
                                We may use third-party tools (such as analytics or crash reporting services) that process
                                anonymized or aggregated data. These services do <strong>not</strong> access your
                                precise or background location.
                            </p>

                            <h3 className="text-sm font-semibold text-gray-800 mb-2">7. Consent</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Location access — including background location — is requested only after displaying a
                                clear in-app disclosure explaining why the data is needed and how it will be used. You
                                may accept or decline the request at any time.
                            </p>
                        </section>


                        <section id="use" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">How we use data</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                We use your information to deliver and improve our services, process transactions, provide support, personalize your experience, detect fraud and for analytics.
                            </p>
                        </section>

                        <section id="cookies" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Cookies & tracking</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                Indowud uses cookies and similar technologies to remember preferences, enable features and analyze site usage. You can control cookies via your browser settings.
                            </p>
                        </section>

                        <section id="sharing" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Sharing & third parties</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                We may share data with trusted service providers (hosting, payments, analytics) or where required by law. We do not sell personal information for advertising.
                            </p>
                        </section>

                        <section id="security" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Security</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                We implement industry-standard measures to protect personal data, but no system is entirely secure. Please keep your account credentials private and use a strong password.
                            </p>
                        </section>

                        <section id="rights" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Your rights</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                You may have the right to access, correct, port, or delete your personal information depending on your jurisdiction. Contact us to make a request.
                            </p>
                        </section>

                        <section id="changes" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Changes to this policy</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                We may update this policy occasionally. We will post the revised date at the top of the page when we do.
                            </p>
                        </section>

                        <section id="contact" className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact</h2>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                For questions about this Privacy Policy, contact us at:
                                <br />
                                <span className="font-medium text-gray-800">support@indowud.com</span>
                            </p>
                        </section>


                    </article>
                </div>
            </main>

            {/* Colored footer bar */}
            <footer className="mt-auto">
                <div className="bg-white border-t border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col md:flex-row md:justify-between items-center gap-3">
                            <div className="text-xs text-gray-500">
                                Privacy Policy — Indowud NFC Pvt. Ltd.
                            </div>
                            <div className="text-xs text-gray-500">
                                <Link to="/contact" className="hover:underline">Contact</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Colored band at bottom */}
                <div className="h-8" style={{ background: "linear-gradient(90deg,#169698,#128083)" }} />
            </footer>

            {/* smooth scroll */}
            <style>{`html { scroll-behavior: smooth; } @media print { nav a[href^="#"], .md\\:hidden { display: none !important; } .sticky { position: static !important; } }`}</style>
        </div>
    );
}
