import DonationForm from "./Donateform";

const Donate = () => {
  return (
    <div className="bg-bg-color min-h-screen pb-24">
      {/* Hero */}
      <section className="bg-accent text-white py-20 relative overflow-hidden h-100">
        <div className="absolute inset-0  opacity-60">
           <img src="banner/donate-page.png" className="w-full h-full object-cover" alt="Background" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white mt-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">Invest in Sustainable Change</h1>
          <p className="text-xl max-w-2xl mx-auto text-blue-50">Your donation directly empowers marginalized communities. Together, we can build a thriving, equitable future.</p>
        </div>
      </section>

      <DonationForm/>
    </div>
  );
};

export default Donate;
