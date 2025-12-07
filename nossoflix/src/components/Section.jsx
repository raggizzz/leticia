export default function Section({ id, title, subtitle, children, accentColor = 'red' }) {
    const accentColors = {
        red: 'from-red-600 to-pink-600',
        pink: 'from-pink-600 to-purple-600',
        purple: 'from-purple-600 to-blue-600',
        gold: 'from-yellow-500 to-orange-500',
    };

    return (
        <section id={id} className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mb-10 sm:mb-14">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`w-1.5 h-12 rounded-full bg-gradient-to-b ${accentColors[accentColor]}`}></div>
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white">
                                {title}
                            </h2>
                            {subtitle && (
                                <p className="text-gray-400 text-lg mt-1">{subtitle}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section Content */}
                {children}
            </div>
        </section>
    );
}
