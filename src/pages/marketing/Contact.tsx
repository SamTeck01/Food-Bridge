import ContactHero from '../../components/contact/hero';
import CTASection from '../../components/homepage/CTASection';
import FAQSection from '../../components/homepage/FAQSection';

const Contact = () => {

    return (
        <div className="min-h-screen bg-[#FFFDF2] font-[Questrial]">
            <div className="relative flex flex-col bg-bottom bg-no-repeat bg-contain lg:bg-cover">
                <div className="h-12 lg:h-[4rem]" /> 
                <ContactHero />
            </div>
            
            <main> 
                <div className="px-4 md:px-[3rem]">
                    <FAQSection />
                </div>
                <CTASection />
            </main>
        </div>
    );
};

export default Contact;