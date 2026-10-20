import { useLanguage } from '../../store/LanguageContext';
import { SITE_NAME, BUSINESS } from '../../config';

// Real, visible text about what the shop sells and where. Google ranks pages on content like this.
const FAQ = {
  en: [
    ['What is an Agal Vilakku?', 'Agal Vilakku is a traditional Tamil clay oil lamp (diya) used for daily pooja, festivals and temple rituals. Ours are hand-shaped terracotta lamps made in Virudhachalam.'],
    ['Where can I buy handmade diya lamps in Virudhachalam and Cuddalore?', 'Visit Alayam Pooja Products at Aladi Road, MRK Nagar, Virudhachalam, Cuddalore district, or order online on this website and WhatsApp.'],
    ['Do you deliver across India?', 'Yes. We ship handmade diyas and pooja products across Tamil Nadu and all of India with secure packaging.'],
    ['Which lamps are best for Deepavali and Karthigai Deepam?', 'Our festive terracotta diyas, lotus diyas, star diyas and gift boxes are popular for Deepavali, Karthigai Deepam, housewarming and weddings.'],
    ['Do you sell wholesale or bulk diyas?', 'Yes, we supply bulk and wholesale clay diyas for temples, shops, events and return gifts. Message us on WhatsApp for rates.'],
    ['What products can I explore at Alayam Pooja Products?', 'You can browse the products listed on the Alayam Pooja Products website, including available clay diya and Agal Vilakku designs. Check each product page for current details.'],
    ['Are clay diyas suitable for daily pooja?', 'Traditional clay diyas are commonly used for daily pooja and devotional rituals. Choose a lamp suitable for your intended use and follow safe lamp-lighting practices.'],
    ['Can I find lamps for festivals and special occasions?', 'Explore the available product designs for festival pooja, home décor and special occasions. Product availability may vary, so check the current catalogue.'],
    ['How do I check product details and availability?', 'Visit the products page and open the relevant product listing to review its description and availability. If anything is unclear, contact Alayam Pooja Products before placing an order.'],
    ['How can I contact Alayam Pooja Products?', 'Use the contact details in the website footer, or message us on WhatsApp, for product questions and orders.'],
  ],
  ta: [
    ['அகல் விளக்கு என்றால் என்ன?', 'அகல் விளக்கு என்பது தினசரி பூஜை, பண்டிகைகள் மற்றும் கோயில் வழிபாடுகளில் பயன்படுத்தப்படும் பாரம்பரிய தமிழ் மண் விளக்கு. எங்கள் விளக்குகள் விருத்தாசலத்தில் கையால் செய்யப்பட்டவை.'],
    ['விருத்தாசலம், கடலூரில் கைவினை அகல் விளக்கு எங்கே வாங்கலாம்?', 'கடலூர் மாவட்டம், விருத்தாசலம், ஆலடி சாலை, MRK நகரில் உள்ள ஆலயம் பூஜை பொருட்கள் கடையைப் பார்வையிடலாம் அல்லது இந்த இணையதளம் மற்றும் வாட்ஸ்அப் வழியாக ஆர்டர் செய்யலாம்.'],
    ['இந்தியா முழுவதும் டெலிவரி உண்டா?', 'ஆம். பாதுகாப்பான பேக்கிங்குடன் தமிழ்நாடு மற்றும் இந்தியா முழுவதும் அனுப்புகிறோம்.'],
    ['தீபாவளி, கார்த்திகை தீபத்திற்கு எந்த விளக்குகள் சிறந்தவை?', 'எங்கள் பண்டிகை மண் அகல் விளக்குகள், தாமரை விளக்குகள், நட்சத்திர விளக்குகள் மற்றும் பரிசுப் பெட்டிகள் மிகவும் பிரபலம்.'],
    ['மொத்த விலையில் அகல் விளக்கு கிடைக்குமா?', 'ஆம், கோயில்கள், கடைகள், நிகழ்ச்சிகள் மற்றும் திருமண பரிசுகளுக்கு மொத்தமாக வழங்குகிறோம். விலைக்கு வாட்ஸ்அப்பில் தொடர்பு கொள்ளவும்.'],
    ['ஆலயம் பூஜை பொருட்களில் என்னென்ன பொருட்களைப் பார்க்கலாம்?', 'ஆலயம் பூஜை பொருட்கள் இணையதளத்தில் உள்ள மண் தீபங்கள் மற்றும் அகல் விளக்கு வடிவமைப்புகளைப் பார்க்கலாம். தற்போதைய விவரங்களுக்கு ஒவ்வொரு பொருளின் பக்கத்தையும் பார்க்கவும்.'],
    ['தினசரி பூஜைக்கு மண் தீபங்கள் ஏற்றதா?', 'பாரம்பரிய மண் தீபங்கள் தினசரி பூஜை மற்றும் வழிபாட்டு சடங்குகளில் பொதுவாகப் பயன்படுத்தப்படுகின்றன. உங்கள் பயன்பாட்டிற்கு ஏற்ற விளக்கைத் தேர்ந்தெடுத்து, பாதுகாப்பாக விளக்கேற்றவும்.'],
    ['பண்டிகை மற்றும் சிறப்பு நாட்களுக்கான விளக்குகள் கிடைக்குமா?', 'பண்டிகை பூஜை, வீட்டு அலங்காரம் மற்றும் சிறப்பு நிகழ்வுகளுக்கான வடிவமைப்புகளைப் பார்க்கவும். பொருட்களின் இருப்பு மாறக்கூடும் என்பதால் தற்போதைய பட்டியலைச் சரிபார்க்கவும்.'],
    ['பொருளின் விவரங்களையும் இருப்பையும் எப்படி அறிவது?', 'பொருட்கள் பக்கத்திற்குச் சென்று, அந்தப் பொருளைத் திறந்து விளக்கம், விலை மற்றும் இருப்பைப் பார்க்கவும். ஏதேனும் தெளிவில்லை என்றால் ஆர்டர் செய்வதற்கு முன் எங்களைத் தொடர்பு கொள்ளவும்.'],
    ['ஆலயம் பூஜை பொருட்களை எப்படி தொடர்பு கொள்வது?', 'பொருட்கள் மற்றும் ஆர்டர் குறித்த கேள்விகளுக்கு இணையதளத்தின் அடிப்பகுதியில் உள்ள தொடர்பு விவரங்களைப் பயன்படுத்தவும் அல்லது வாட்ஸ்அப்பில் செய்தி அனுப்பவும்.'],
  ],
};

export default function LocalSeoSection() {
  const { language } = useLanguage();
  const ta = language === 'ta';
  const faq = FAQ[language] || FAQ.en;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.en.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ];

  return (
    <section className="section local-seo" aria-labelledby="local-seo-title">
      <div className="container local-seo__inner">
        {/* FAQ structured data only (page meta is set by Home) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <h2 id="local-seo-title" className="section-title">
          {ta ? 'விருத்தாசலம், கடலூரில் அகல் விளக்கு & பூஜை பொருட்கள்' : 'Agal Vilakku & Pooja Products in Virudhachalam, Cuddalore'}
        </h2>
        <div className="divider" />
        <p className="section-subtitle local-seo__intro">
          {ta
            ? 'ஆலயம் பூஜை பொருட்கள் (V Square Manufacturing Traders) விருத்தாசலத்தில் கையால் செய்யப்பட்ட மண் அகல் விளக்குகள், தீபாவளி விளக்குகள், கார்த்திகை தீப விளக்குகள், தாமரை விளக்குகள், விநாயகர் விளக்குகள் மற்றும் பூஜை பரிசுப் பெட்டிகளை வழங்குகிறது. கடலூர், ஆலடி, விருத்தாசலம் மற்றும் தமிழ்நாடு முழுவதும் டெலிவரி.'
            : `${SITE_NAME} (${BUSINESS.legalName}) in Virudhachalam makes and sells handmade clay agal vilakku, Deepavali diyas, Karthigai Deepam lamps, lotus diyas, Ganesha diyas and pooja gift boxes. We serve Virudhachalam, Cuddalore, Aladi, Vriddhachalam and customers across Tamil Nadu and India.`}
        </p>
        <h3 id="faq" className="local-seo__faq-title">{ta ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்' : 'Frequently Asked Questions'}</h3>
        <div className="local-seo__faq">
          {faq.map(([q, a]) => (
            <details key={q} className="local-seo__item">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
