
export default function ContactPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
            {/* 5. Contact */}
            <section className="py-20 px-6 bg-white dark:bg-slate-950">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900 dark:text-white">Get In Touch</h2>
                    <p className="text-xl text-slate-600 dark:text-slate-400 mb-12">
                        Interested in working together? Feel free to reach out for collaborations or just a friendly hello.
                    </p>

                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">Email</span>
                            <a href="mailto:your.email@example.com" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">your.email@example.com</a>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">LinkedIn</span>
                            <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">linkedin.com/in/yourprofile</a>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">Location</span>
                            <span className="text-slate-600 dark:text-slate-400">City, Country</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
