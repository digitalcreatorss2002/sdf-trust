// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
// 🔥 Import Recharts components
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 🔥 Sample data for the chart (You can update these numbers)
const impactData = [
    { year: '2019', beneficiaries: 120000 },
    { year: '2020', beneficiaries: 250000 },
    { year: '2021', beneficiaries: 400000 },
    { year: '2022', beneficiaries: 650000 },
    { year: '2023', beneficiaries: 850000 },
    { year: '2024', beneficiaries: 1050000 },
];

const ImpactAndEvidence = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <section className="bg-primary text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        Impact & Evidence
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg md:text-xl max-w-3xl mx-auto"
                    >
                        Measuring our success by the lives we touch and the communities we transform.
                    </motion.p>
                </div>
            </section>

            {/* Impact Dashboard */}
            <section id="dashboard" className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-text-primary text-center mb-12">Impact Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Lives Impacted', value: '1M+', icon: '👥', color: 'bg-blue-100 text-blue-600' },
                            { label: 'Communities Reached', value: '500+', icon: '🏘️', color: 'bg-green-100 text-green-600' },
                            { label: 'Projects Completed', value: '120+', icon: '✅', color: 'bg-purple-100 text-purple-600' },
                            { label: 'Active Volunteers', value: '10K+', icon: '🤝', color: 'bg-orange-100 text-orange-600' },
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center"
                            >
                                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <h3 className="text-4xl font-bold text-text-primary mb-2">{stat.value}</h3>
                                <p className="text-gray-600 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Beneficiaries Reached */}
            <section id="beneficiaries" className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-text-primary text-center mb-12">Beneficiaries Reached</h2>
                    <div className="bg-white rounded-3xl overflow-hidden shadow-lg flex flex-col md:flex-row border border-gray-100">
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-accent text-white">
                            <h3 className="text-2xl font-bold mb-4">Empowering the Vulnerable</h3>
                            <p className="mb-6 leading-relaxed">
                                Our programs are designed to reach the most marginalized communities. Over the past decade, we have successfully implemented diverse initiatives catering to children, women, and the elderly.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">👧</span>
                                    <span>500,000+ Children supported in education</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">👩</span>
                                    <span>300,000+ Women empowered with livelihoods</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">👴</span>
                                    <span>200,000+ Elderly provided with healthcare</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* 🔥 NEW CHART SECTION */}
                        <div className="md:w-1/2 bg-white min-h-87.5 p-6 md:p-10 flex flex-col justify-center relative">
                            <h4 className="text-lg font-serif font-bold text-text-primary mb-6 text-center">Growth of Beneficiaries (2019-2024)</h4>
                            <div className="w-full h-62.5 md:h-75">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={impactData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <defs>
                                            {/* Gradient matching your brand's primary color (#6a752b) */}
                                            <linearGradient id="colorBeneficiaries" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6a752b" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#6a752b" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        {/* Clean, minimal grid lines */}
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                        <XAxis 
                                            dataKey="year" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#9ca3af', fontSize: 12}} 
                                            dy={10} 
                                        />
                                        <YAxis 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#9ca3af', fontSize: 12}} 
                                            tickFormatter={(value) => `${value / 1000}k`} 
                                        />
                                        {/* Beautiful hover tooltip */}
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value) => [new Intl.NumberFormat('en-IN').format(value), 'Lives Impacted']}
                                            labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="beneficiaries" 
                                            stroke="#6a752b" 
                                            strokeWidth={3} 
                                            fillOpacity={1} 
                                            fill="url(#colorBeneficiaries)" 
                                            activeDot={{ r: 6, fill: '#6a752b', stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* States & Districts Covered & Sector-wise Impact */}
            <section id="coverage-impact" className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* States & Districts */}
                        <div id="coverage">
                            <h2 className="text-3xl font-bold text-text-primary mb-8">States & Districts Covered</h2>
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                <p className="text-gray-600 mb-6">
                                    Our footprint spans across multiple states, ensuring our interventions reach those who need them most regardless of geographical boundaries.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    {['Maharashtra', 'Karnataka', 'New Delhi', 'Rajasthan', 'Uttar Pradesh', 'Bihar', 'Odisha', 'West Bengal'].map(state => (
                                        <span key={state} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-medium text-sm">
                                            {state}
                                        </span>
                                    ))}
                                </div>
                                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-gray-700">Total States:</span>
                                        <span className="text-xl font-bold text-primary">15</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-gray-700">Total Districts:</span>
                                        <span className="text-xl font-bold text-primary">120+</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sector-wise Impact */}
                        <div id="sector-impact">
                            <h2 className="text-3xl font-bold text-text-primary mb-8">Sector-wise Impact</h2>
                            <div className="space-y-6">
                                {[
                                    { sector: 'Education', percentage: 40, color: 'bg-blue-500' },
                                    { sector: 'Healthcare', percentage: 30, color: 'bg-green-500' },
                                    { sector: 'Livelihoods', percentage: 20, color: 'bg-yellow-500' },
                                    { sector: 'Environment', percentage: 10, color: 'bg-teal-500' },
                                ].map(item => (
                                    <div key={item.sector} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="font-bold text-gray-700">{item.sector}</span>
                                            <span className="font-bold text-gray-500">{item.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                                            <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default ImpactAndEvidence;