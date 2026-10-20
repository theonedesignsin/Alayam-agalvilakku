import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const translations = {
  en: {
    'brand.name': 'Alayam',
    // Header
    'nav.home': 'Home',
    'nav.shop': 'Shop',
    'nav.cart': 'Cart',
    'nav.about': 'About Us',
    'nav.certifications': 'Certifications',
    'nav.gallery': 'Gallery',

    // Products page
    'products.title': 'Our Collection',
    'products.subtitle': 'Explore our complete range of 34 handcrafted clay oil lamps — each one a unique piece of Indian heritage.',

    // Product Detail
    'product.notFound': 'Product Not Found',
    'product.notFoundDesc': "The lamp you're looking for doesn't exist.",
    'product.browseAll': 'Browse All Lamps',
    'product.quantity': 'Quantity',
    'product.buyNow': 'Buy Now',
    'product.addToCart': 'Add to Cart',
    'product.handmade': 'Handmade',
    'product.ecoFriendly': 'Eco-Friendly',
    'product.securePackaging': 'Secure Packaging',
    'product.panIndiaDelivery': 'Pan-India Delivery',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your Cart is Empty',
    'cart.emptyDesc': 'Discover our handcrafted clay oil lamps and add some warmth to your home.',
    'cart.browseLamps': 'Browse Lamps',
    'cart.item': 'item',
    'cart.items': 'items',
    'cart.orderSummary': 'Order Summary',
    'cart.checkout': 'Proceed to Checkout',
    'cart.continueShopping': '← Continue Shopping',

    // Checkout
    'checkout.title': 'Checkout',
    'checkout.noItems': 'No items to checkout',
    'checkout.noItemsDesc': 'Add some lamps to your cart first.',
    'checkout.deliveryInfo': 'Delivery Information',
    'checkout.fullName': 'Full Name',
    'checkout.phone': 'Phone Number',
    'checkout.email': 'Email Address',
    'checkout.address': 'Delivery Address',
    'checkout.city': 'City',
    'checkout.state': 'State',
    'checkout.selectState': 'Select State',
    'checkout.pincode': 'PIN Code',
    'checkout.sendWhatsApp': 'Send Order on WhatsApp',
    'checkout.success': 'Order Sent Successfully!',
    'checkout.thankYou': 'Thank you for your order,',
    'checkout.successMsg': "Your order has been sent via WhatsApp. We'll confirm your order and arrange delivery. You'll receive updates at",
    'checkout.continueShopping': 'Continue Shopping',
    'checkout.backHome': 'Back to Home',

    // Validation
    'validation.nameRequired': 'Name is required',
    'validation.phoneRequired': 'Phone is required',
    'validation.phoneInvalid': 'Enter a valid 10-digit Indian phone number',
    'validation.emailRequired': 'Email is required',
    'validation.emailInvalid': 'Enter a valid email',
    'validation.addressRequired': 'Address is required',
    'validation.cityRequired': 'City is required',
    'validation.stateRequired': 'State is required',
    'validation.pincodeRequired': 'PIN code is required',
    'validation.pincodeInvalid': 'Enter a valid 6-digit PIN code',

    // Footer
    'footer.since': 'Since 2002',
    'footer.tagline1': 'Handcrafted with love in India.',
    'footer.tagline2': 'Illuminating homes with the warmth of tradition.',
    'footer.quickLinks': 'Quick Links',
    'footer.allLamps': 'All Lamps',
    'footer.contact': 'Contact',
    'footer.copyright': 'All rights reserved.',
    'footer.craft': 'Each lamp is handcrafted by skilled artisans — no two pieces are exactly alike.',

    // Loading
    'loading.title': 'Alayam',

    // Product card
    'productCard.addToCart': 'Add to Cart',
    'productCard.buyNow': 'Buy Now',

    // Notification
    'notification.addedToCart': 'added to cart!',

    // Home page
    'home.hero.title1': 'Light Your',
    'home.hero.title2': 'Tradition',
    'home.hero.desc': 'Discover traditional clay diyas and beautifully designed Agal Vilakku lamps for daily pooja, festive celebrations and special occasions. Explore a variety of traditional and decorative designs to make every moment of worship special.',
    'home.hero.explore': 'Explore Vilakku',
    'home.hero.learnMore': 'Learn more',

    'home.featured.badge': 'Signature Collection',
    'home.featured.desc': 'A hand-shaped terracotta lantern inspired by the traditional lamps of Tamil homes and temples \u2014 a warm glow for worship and celebration.',
    'home.featured.viewDetails': 'View Full Details →',

    'home.heritage.badge': 'Our Heritage',
    'home.heritage.title': 'More Than a Lamp.',
    'home.heritage.p1': 'An Agal Vilakku is more than a source of light. It represents auspicious beginnings, warmth, devotion, and the timeless traditions passed from one generation to the next.',
    'home.heritage.p2': 'For centuries, the act of lighting a vilakku has been central to Tamil culture — welcoming divinity, marking celebrations, and bringing families together in the soft glow of sacred flame.',

    'home.tamil.title': 'A Heritage in Light',
    'home.tamil.p1': 'A tradition in every lamp.',
    'home.tamil.p2': 'A beauty in every light.',

    'home.why.title': 'Why Alayam',
    'home.why.subtitle': 'The essence of what makes every Alayam lamp special.',
    'home.why.f1Title': 'Handcrafted',
    'home.why.f1Desc': 'Made with attention to traditional form and detail.',
    'home.why.f2Title': 'Authentic',
    'home.why.f2Desc': 'Designed to preserve the timeless character of the Agal Vilakku.',
    'home.why.f3Title': 'Premium Quality',
    'home.why.f3Desc': 'Selected materials and careful finishing for lasting beauty.',
    'home.why.f4Title': 'Made for Every Occasion',
    'home.why.f4Desc': 'Perfect for pooja, festivals, celebrations, gifting, and everyday homes.',

    'home.occasion.title': 'For Every Sacred Moment',
    'home.occasion.subtitle': 'From daily worship to grand celebrations, an Agal Vilakku is always at the heart.',
    'home.occasion.pooja': 'Pooja',
    'home.occasion.deepavali': 'Deepavali',
    'home.occasion.karthigai': 'Karthigai Deepam',
    'home.occasion.weddings': 'Weddings',
    'home.occasion.housewarming': 'Housewarming',
    'home.occasion.gifting': 'Gifting',

    'home.cta.label': 'Find Your Traditional Lamp',
    'home.cta.title': 'Bring a Traditional Glow to Your Home',
    'home.cta.desc': 'Explore Alayam\'s collection of clay diyas and Agal Vilakku for daily pooja, festivals and special occasions. Browse the available designs to find the right fit for your needs.',
    'home.cta.shopNow': 'Explore All Products',

    'home.cat.badge': 'Find Your Favourite Design',
    'home.cat.title': 'Shop Traditional Clay Diyas & Agal Vilakku',
    'home.cat.subtitle': 'Explore traditional clay lamps for daily pooja, festive celebrations and auspicious occasions. Choose designs that bring a warm, traditional touch to your home and place of worship.',
    'home.cat.c1Title': 'Agal Vilakku',
    'home.cat.c1Desc': 'Traditional clay lamps for daily prayers, rituals and devotional spaces.',
    'home.cat.c1Link': 'Shop Agal Vilakku →',
    'home.cat.c2Title': 'Traditional Clay Diyas',
    'home.cat.c2Desc': 'Classic clay diyas for your pooja room, home altar and festive décor.',
    'home.cat.c2Link': 'Explore Clay Diyas →',
    'home.cat.c3Title': 'Decorative Clay Lamps',
    'home.cat.c3Desc': 'Explore decorative lamp styles for festivals, family gatherings and special occasions.',
    'home.cat.c3Link': 'View Designs →',
    'home.cat.c4Title': 'Festival Clay Diyas',
    'home.cat.c4Desc': 'Find traditional lamps to complement your festival pooja and celebrations.',
    'home.cat.c4Link': 'Shop Festival Collection →',
    'home.about.title': 'A Traditional Glow for Everyday Worship',
    'home.about.p1': 'At Alayam Pooja Products, we bring together traditional clay diyas and Agal Vilakku designs for people who value the warmth and meaning of lighting a lamp. Whether you are preparing for daily pooja or a festive occasion, explore lamp designs that complement your devotional traditions.',
    'home.about.p2': 'A lit diya is a familiar part of many Indian homes and places of worship. Our collection is intended to help you find clay lamps suited to your rituals, celebrations and home décor preferences.',
    'home.about.l1': 'Traditional clay diya and Agal Vilakku designs',
    'home.about.l2': 'Options for daily pooja and festive occasions',
    'home.about.l3': 'Decorative styles to suit different preferences',
    'home.about.cta': 'Browse Our Products',
    'home.why.f5Title': 'Traditional Appeal',
    'home.why.f5Desc': 'Discover clay lamp designs inspired by familiar pooja and festive traditions.',
    'home.why.f6Title': 'For Daily Pooja',
    'home.why.f6Desc': 'Explore lamp options for your regular prayers and devotional space.',
    'home.why.f7Title': 'Festive Décor',
    'home.why.f7Desc': 'Add a warm traditional touch to your home during festivals and celebrations.',
    'home.why.f8Title': 'Different Designs',
    'home.why.f8Desc': 'Browse available styles and select designs that suit your needs and occasion.',
    'home.occasion.navaratri': 'Navaratri',
    'home.occasion.more': 'More Festivals',
    'home.occasion.festivalText': 'Prepare for festivals and family celebrations with products suited to your rituals and traditions.',
    'home.occasion.shop': 'Shop Festival Collection →',
  },
  ta: {
    'brand.name': 'ஆலயம்',
    // Header
    'nav.home': 'முகப்பு',
    'nav.shop': 'கடை',
    'nav.cart': 'கூடை',
    'nav.about': 'எங்களைப் பற்றி',
    'nav.certifications': 'சான்றிதழ்கள்',
    'nav.gallery': 'படத்தொகுப்பு',

    // Products page
    'products.title': 'எங்கள் சேகரிப்பு',
    'products.subtitle': '34 கைவினை மண் விளக்குகளின் முழு வரிசையையும் ஆராயுங்கள் — ஒவ்வொன்றும் இந்திய பாரம்பரியத்தின் தனித்துவமான படைப்பு.',

    // Product Detail
    'product.notFound': 'தயாரிப்பு கிடைக்கவில்லை',
    'product.notFoundDesc': 'நீங்கள் தேடும் விளக்கு இல்லை.',
    'product.browseAll': 'அனைத்து விளக்குகளையும் பாருங்கள்',
    'product.quantity': 'எண்ணிக்கை',
    'product.buyNow': 'இப்போது வாங்குங்கள்',
    'product.addToCart': 'கூடையில் சேர்',
    'product.handmade': 'கைவினை',
    'product.ecoFriendly': 'சுற்றுச்சூழல் நட்பு',
    'product.securePackaging': 'பாதுகாப்பான பேக்கிங்',
    'product.panIndiaDelivery': 'அகில இந்திய டெலிவரி',

    // Cart
    'cart.title': 'பொருட்கள் கூடை',
    'cart.empty': 'உங்கள் கூடை காலியாக உள்ளது',
    'cart.emptyDesc': 'எங்கள் கைவினை மண் விளக்குகளைக் கண்டறிந்து உங்கள் வீட்டிற்கு அரவணைப்பைச் சேருங்கள்.',
    'cart.browseLamps': 'விளக்குகளைப் பாருங்கள்',
    'cart.item': 'பொருள்',
    'cart.items': 'பொருட்கள்',
    'cart.orderSummary': 'ஆர்டர் சுருக்கம்',
    'cart.checkout': 'செலுத்தத் தொடரவும்',
    'cart.continueShopping': '← தொடர்ந்து கடைக்கு',

    // Checkout
    'checkout.title': 'செலுத்து',
    'checkout.noItems': 'செலுத்த பொருட்கள் இல்லை',
    'checkout.noItemsDesc': 'முதலில் உங்கள் கூடையில் சில விளக்குகளை சேருங்கள்.',
    'checkout.deliveryInfo': 'டெலிவரி தகவல்',
    'checkout.fullName': 'முழு பெயர்',
    'checkout.phone': 'தொலைபேசி எண்',
    'checkout.email': 'மின்னஞ்சல் முகவரி',
    'checkout.address': 'டெலிவரி முகவரி',
    'checkout.city': 'நகரம்',
    'checkout.state': 'மாநிலம்',
    'checkout.selectState': 'மாநிலத்தைத் தேர்ந்தெடுக்கவும்',
    'checkout.pincode': 'அஞ்சல் குறியீடு',
    'checkout.sendWhatsApp': 'WhatsApp-ல் ஆர்டர் அனுப்பு',
    'checkout.success': 'ஆர்டர் வெற்றிகரமாக அனுப்பப்பட்டது!',
    'checkout.thankYou': 'உங்கள் ஆர்டருக்கு நன்றி,',
    'checkout.successMsg': 'உங்கள் ஆர்டர் WhatsApp மூலம் அனுப்பப்பட்டது. நாங்கள் உங்கள் ஆர்டரை உறுதிப்படுத்துவோம். தகவல் மின்னஞ்சல் வரும்:',
    'checkout.continueShopping': 'தொடர்ந்து ஷாப்பிங்',
    'checkout.backHome': 'முகப்பிற்கு செல்',

    // Validation
    'validation.nameRequired': 'பெயர் தேவை',
    'validation.phoneRequired': 'தொலைபேசி எண் தேவை',
    'validation.phoneInvalid': 'சரியான 10 இலக்க எண்ணை உள்ளிடவும்',
    'validation.emailRequired': 'மின்னஞ்சல் தேவை',
    'validation.emailInvalid': 'சரியான மின்னஞ்சலை உள்ளிடவும்',
    'validation.addressRequired': 'முகவரி தேவை',
    'validation.cityRequired': 'நகரம் தேவை',
    'validation.stateRequired': 'மாநிலம் தேவை',
    'validation.pincodeRequired': 'அஞ்சல் குறியீடு தேவை',
    'validation.pincodeInvalid': 'சரியான 6 இலக்க குறியீட்டை உள்ளிடவும்',

    // Footer
    'footer.since': '2002 முதல்',
    'footer.tagline1': 'இந்தியாவில் அன்போடு கைவினை.',
    'footer.tagline2': 'பாரம்பரியத்தின் அரவணைப்புடன் வீடுகளை ஒளிரச் செய்தல்.',
    'footer.quickLinks': 'விரைவு இணைப்புகள்',
    'footer.allLamps': 'அனைத்து விளக்குகள்',
    'footer.contact': 'தொடர்பு',
    'footer.copyright': 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    'footer.craft': 'ஒவ்வொரு விளக்கும் திறமையான கைவினைஞர்களால் தயாரிக்கப்படுகிறது — எந்த இரண்டு துண்டுகளும் ஒரே மாதிரி இருக்காது.',

    // Loading
    'loading.title': 'ஆலயம்',

    // Product card
    'productCard.addToCart': 'கூடையில் சேர்',
    'productCard.buyNow': 'இப்போது வாங்கு',

    // Notification
    'notification.addedToCart': 'கூடையில் சேர்க்கப்பட்டது!',

    // Home page
    'home.hero.title1': 'உங்கள் பாரம்பரியத்தை',
    'home.hero.title2': 'ஒளிரச் செய்யுங்கள்',
    'home.hero.desc': 'தினசரி பூஜை, பண்டிகை கொண்டாட்டங்கள் மற்றும் சிறப்பு நாட்களுக்கான பாரம்பரிய மண் தீபங்களையும் அழகிய அகல் விளக்குகளையும் கண்டறியுங்கள். ஒவ்வொரு வழிபாட்டு தருணத்தையும் சிறப்பாக்க பாரம்பரிய மற்றும் அலங்கார வடிவமைப்புகளை ஆராயுங்கள்.',
    'home.hero.explore': 'விளக்குகளை ஆராயுங்கள்',
    'home.hero.learnMore': 'மேலும் அறிக',

    'home.featured.badge': 'சிறப்புத் தொகுப்பு',
    'home.featured.desc': 'தமிழ் இல்லங்கள் மற்றும் கோயில்களின் பாரம்பரிய விளக்குகளால் ஈர்க்கப்பட்ட, கையால் வடிவமைக்கப்பட்ட மண் தொங்கு விளக்கு \u2014 வழிபாடு மற்றும் கொண்டாட்டத்திற்கு ஒரு சூடான ஒளி.',
    'home.featured.viewDetails': 'முழு விவரங்களைக் காண்க →',

    'home.heritage.badge': 'நமது மரபு',
    'home.heritage.title': 'ஒரு விளக்கிற்கும் மேலாக.',
    'home.heritage.p1': 'அகல் விளக்கு என்பது ஒளியின் ஆதாரத்திற்கும் மேலானது. இது மங்களகரமான தொடக்கங்கள், அரவணைப்பு, பக்தி மற்றும் தலைமுறைகளாக கடத்தப்படும் காலமற்ற மரபுகளைக் குறிக்கிறது.',
    'home.heritage.p2': 'பல நூற்றாண்டுகளாக, விளக்கேற்றுவது தமிழ் கலாச்சாரத்தின் மையமாக உள்ளது — தெய்வத்தை வரவேற்பது, கொண்டாட்டங்களைக் குறிப்பது மற்றும் புனித நெருப்பின் மென்மையான ஒளியில் குடும்பங்களை ஒன்றிணைப்பது.',

    'home.tamil.title': 'ஒளியில் ஒரு மரபு',
    'home.tamil.p1': 'ஒவ்வொரு விளக்கிலும் ஒரு பாரம்பரியம்.',
    'home.tamil.p2': 'ஒவ்வொரு ஒளியிலும் ஒரு அழகு.',

    'home.why.title': 'ஏன் ஆலயம்',
    'home.why.subtitle': 'ஒவ்வொரு ஆலயம் விளக்கையும் சிறப்பாக்குவது எது என்பதன் சாரம்.',
    'home.why.f1Title': 'கைவினை',
    'home.why.f1Desc': 'பாரம்பரிய வடிவம் மற்றும் விவரங்களுக்கு கவனத்துடன் செய்யப்பட்டது.',
    'home.why.f2Title': 'உண்மையான',
    'home.why.f2Desc': 'அகல் விளக்கின் காலமற்ற தன்மையைப் பாதுகாக்க வடிவமைக்கப்பட்டுள்ளது.',
    'home.why.f3Title': 'பிரீமியம் தரம்',
    'home.why.f3Desc': 'நீடித்த அழகுக்காக தேர்ந்தெடுக்கப்பட்ட பொருட்கள் மற்றும் கவனமாக முடித்தல்.',
    'home.why.f4Title': 'ஒவ்வொரு தருணத்திற்கும்',
    'home.why.f4Desc': 'பூஜை, பண்டிகைகள், கொண்டாட்டங்கள், பரிசளிப்பு மற்றும் வீடுகளுக்கு ஏற்றது.',

    'home.occasion.title': 'ஒவ்வொரு புனித தருணத்திற்கும்',
    'home.occasion.subtitle': 'தினசரி வழிபாடு முதல் பிரமாண்ட கொண்டாட்டங்கள் வரை, அகல் விளக்கு எப்போதும் இதயத்தில் உள்ளது.',
    'home.occasion.pooja': 'பூஜை',
    'home.occasion.deepavali': 'தீபாவளி',
    'home.occasion.karthigai': 'கார்த்திகை தீபம்',
    'home.occasion.weddings': 'திருமணங்கள்',
    'home.occasion.housewarming': 'புதுமனை புகுவிழா',
    'home.occasion.gifting': 'பரிசளிப்பு',

    'home.cta.label': 'உங்கள் பாரம்பரிய விளக்கைக் கண்டறியுங்கள்',
    'home.cta.title': 'உங்கள் வீட்டிற்கு பாரம்பரிய ஒளியைக் கொண்டுவாருங்கள்',
    'home.cta.desc': 'தினசரி பூஜை, பண்டிகைகள் மற்றும் சிறப்பு நாட்களுக்கான ஆலயத்தின் மண் தீபங்கள் மற்றும் அகல் விளக்குகளைப் பாருங்கள். உங்கள் தேவைக்கு ஏற்ற வடிவமைப்பைக் கண்டறிய கிடைக்கும் வடிவமைப்புகளை உலாவுங்கள்.',
    'home.cta.shopNow': 'அனைத்து பொருட்களையும் காண்க',

    'home.cat.badge': 'உங்களுக்குப் பிடித்த வடிவமைப்பைக் கண்டறியுங்கள்',
    'home.cat.title': 'பாரம்பரிய மண் தீபங்கள் & அகல் விளக்குகளை வாங்குங்கள்',
    'home.cat.subtitle': 'தினசரி பூஜை, பண்டிகை கொண்டாட்டங்கள் மற்றும் மங்களகரமான நிகழ்வுகளுக்கான பாரம்பரிய மண் விளக்குகளை ஆராயுங்கள். உங்கள் வீட்டிற்கும் வழிபாட்டு இடத்திற்கும் அரவணைப்பான பாரம்பரிய அழகைச் சேர்க்கும் வடிவமைப்புகளைத் தேர்ந்தெடுங்கள்.',
    'home.cat.c1Title': 'அகல் விளக்கு',
    'home.cat.c1Desc': 'தினசரி பிரார்த்தனை, சடங்குகள் மற்றும் வழிபாட்டு இடங்களுக்கான பாரம்பரிய மண் விளக்குகள்.',
    'home.cat.c1Link': 'அகல் விளக்கை வாங்குங்கள் →',
    'home.cat.c2Title': 'பாரம்பரிய மண் தீபங்கள்',
    'home.cat.c2Desc': 'உங்கள் பூஜை அறை, வீட்டு பீடம் மற்றும் பண்டிகை அலங்காரத்திற்கான கிளாசிக் மண் தீபங்கள்.',
    'home.cat.c2Link': 'மண் தீபங்களை ஆராயுங்கள் →',
    'home.cat.c3Title': 'அலங்கார மண் விளக்குகள்',
    'home.cat.c3Desc': 'பண்டிகைகள், குடும்ப ஒன்றுகூடல்கள் மற்றும் சிறப்பு நிகழ்வுகளுக்கான அலங்கார விளக்கு பாணிகளை ஆராயுங்கள்.',
    'home.cat.c3Link': 'வடிவமைப்புகளைக் காண்க →',
    'home.cat.c4Title': 'பண்டிகை மண் தீபங்கள்',
    'home.cat.c4Desc': 'உங்கள் பண்டிகை பூஜை மற்றும் கொண்டாட்டங்களுக்குப் பொருத்தமான பாரம்பரிய விளக்குகளைக் கண்டறியுங்கள்.',
    'home.cat.c4Link': 'பண்டிகைத் தொகுப்பை வாங்குங்கள் →',
    'home.about.title': 'தினசரி வழிபாட்டிற்கு ஒரு பாரம்பரிய ஒளி',
    'home.about.p1': 'ஆலயம் பூஜை பொருட்களில், விளக்கேற்றுவதன் அரவணைப்பையும் அர்த்தத்தையும் மதிப்பவர்களுக்காக பாரம்பரிய மண் தீபங்களையும் அகல் விளக்கு வடிவமைப்புகளையும் ஒன்றிணைக்கிறோம். தினசரி பூஜைக்கோ பண்டிகைக்கோ தயாராகும்போது, உங்கள் வழிபாட்டு மரபுகளுக்கு ஏற்ற விளக்குகளை ஆராயுங்கள்.',
    'home.about.p2': 'ஏற்றிய தீபம் பல இந்திய இல்லங்களிலும் வழிபாட்டு இடங்களிலும் பழக்கமான ஒரு பகுதி. உங்கள் சடங்குகள், கொண்டாட்டங்கள் மற்றும் வீட்டு அலங்கார விருப்பங்களுக்கு ஏற்ற மண் விளக்குகளைக் கண்டறிய எங்கள் தொகுப்பு உதவும்.',
    'home.about.l1': 'பாரம்பரிய மண் தீபம் மற்றும் அகல் விளக்கு வடிவமைப்புகள்',
    'home.about.l2': 'தினசரி பூஜை மற்றும் பண்டிகைகளுக்கான தேர்வுகள்',
    'home.about.l3': 'வெவ்வேறு விருப்பங்களுக்கு ஏற்ற அலங்கார பாணிகள்',
    'home.about.cta': 'எங்கள் பொருட்களைப் பாருங்கள்',
    'home.why.f5Title': 'பாரம்பரிய அழகு',
    'home.why.f5Desc': 'பழக்கமான பூஜை மற்றும் பண்டிகை மரபுகளால் ஈர்க்கப்பட்ட மண் விளக்கு வடிவமைப்புகளைக் கண்டறியுங்கள்.',
    'home.why.f6Title': 'தினசரி பூஜைக்கு',
    'home.why.f6Desc': 'உங்கள் வழக்கமான பிரார்த்தனைக்கும் வழிபாட்டு இடத்திற்கும் ஏற்ற விளக்குகளை ஆராயுங்கள்.',
    'home.why.f7Title': 'பண்டிகை அலங்காரம்',
    'home.why.f7Desc': 'பண்டிகைகள் மற்றும் கொண்டாட்டங்களின் போது உங்கள் வீட்டிற்கு அரவணைப்பான பாரம்பரிய அழகைச் சேர்க்கவும்.',
    'home.why.f8Title': 'பல்வேறு வடிவமைப்புகள்',
    'home.why.f8Desc': 'கிடைக்கும் பாணிகளைப் பார்த்து, உங்கள் தேவைக்கும் நிகழ்விற்கும் ஏற்றதைத் தேர்ந்தெடுங்கள்.',
    'home.occasion.navaratri': 'நவராத்திரி',
    'home.occasion.more': 'மேலும் பண்டிகைகள்',
    'home.occasion.festivalText': 'உங்கள் சடங்குகள் மற்றும் மரபுகளுக்கு ஏற்ற பொருட்களுடன் பண்டிகைகளுக்கும் குடும்ப கொண்டாட்டங்களுக்கும் தயாராகுங்கள்.',
    'home.occasion.shop': 'பண்டிகைத் தொகுப்பை வாங்குங்கள் →',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem('agal-vilakku-lang') || 'en';
    } catch {
      return 'en';
    }
  });

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('agal-vilakku-lang', lang);
    } catch {
      // localStorage unavailable
    }
  }, []);

  // Sync data-lang attribute on <html> for CSS font switching
  useEffect(() => {
    document.documentElement.setAttribute('data-lang', language);
    document.documentElement.setAttribute('lang', language === 'ta' ? 'ta' : 'en');
  }, [language]);

  const t = useCallback((key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

export default LanguageContext;
