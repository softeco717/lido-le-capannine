// ===== DATI DEL MENU =====
const MENU_DATA = {
  categories: [
    { id: 'antipasti', name_it: '🦐 Antipasti', name_en: '🦐 Starters' },
    { id: 'primi',     name_it: '🍝 Primi',     name_en: '🍝 First Courses' },
    { id: 'secondi',   name_it: '🐟 Secondi',   name_en: '🐟 Main Courses' },
    { id: 'contorni',  name_it: '🥗 Contorni',  name_en: '🥗 Sides' },
    { id: 'pizze',     name_it: '🍕 Pizze',     name_en: '🍕 Pizzas' },
    { id: 'bibite',    name_it: '🥤 Bibite',    name_en: '🥤 Drinks' },
    { id: 'vini',      name_it: '🍷 Vini',      name_en: '🍷 Wines' }
  ],
  products: [
    // ANTIPASTI
    { id: 1, category: 'antipasti', name_it: 'Crudo di Parma e Bufala Campana D.o.p.', name_en: 'Parma Ham and Buffalo Mozzarella D.o.p.', desc_it: 'Crudo di Parma stagionato con Bufala Campana D.o.p.', desc_en: 'Aged Parma ham with Buffalo Mozzarella D.o.p.', price: 12.00, image: 'images/antipasti.webp' },
    { id: 2, category: 'antipasti', name_it: 'Insalata di Mare', name_en: 'Seafood Salad', desc_it: 'Fresca insalata di frutti di mare misti', desc_en: 'Fresh mixed seafood salad', price: 14.00, image: 'images/antipasti.webp' },
    { id: 3, category: 'antipasti', name_it: 'Soute di Cozze', name_en: 'Sautéed Mussels', desc_it: 'Cozze fresche saltate in padella con aglio e prezzemolo', desc_en: 'Fresh mussels sautéed with garlic and parsley', price: 13.00, image: 'images/antipasti.webp' },
    { id: 4, category: 'antipasti', name_it: 'Bassotto Beach', name_en: 'Bassotto Beach', desc_it: 'Il nostro piatto speciale: caldo e freddo, un\'esperienza unica', desc_en: 'Our special dish: hot and cold, a unique experience', price: 22.00, image: 'images/antipasti.webp' },
    { id: 5, category: 'antipasti', name_it: 'Cocktail di Gamberi', name_en: 'Prawn Cocktail', desc_it: 'Gamberi freschi in salsa cocktail', desc_en: 'Fresh prawns in cocktail sauce', price: 13.00, image: 'images/antipasti.webp' },
    { id: 6, category: 'antipasti', name_it: 'Gamberi in Tempura', name_en: 'Tempura Prawns', desc_it: 'Gamberi in pastella leggera di tempura', desc_en: 'Prawns in light tempura batter', price: 12.00, image: 'images/antipasti.webp' },
    { id: 7, category: 'antipasti', name_it: 'Crudo e Bufala', name_en: 'Ham and Buffalo', desc_it: 'Crudo di Parma con Bufala fresca', desc_en: 'Parma ham with fresh buffalo mozzarella', price: 13.00, image: 'images/antipasti.webp' },
    { id: 8, category: 'antipasti', name_it: 'Polipo e Patate', name_en: 'Octopus and Potatoes', desc_it: 'Polipo cotto a bassa temperatura con patate', desc_en: 'Slow-cooked octopus with potatoes', price: 14.00, image: 'images/antipasti.webp' },
    { id: 9, category: 'antipasti', name_it: 'Caprese', name_en: 'Caprese', desc_it: 'Pomodoro fresco, Bufala Campana D.o.p., basilico e olio EVO', desc_en: 'Fresh tomato, Buffalo Mozzarella D.o.p., basil and EVO oil', price: 10.00, image: 'images/antipasti.webp' },
    // PRIMI
    { id: 10, category: 'primi', name_it: 'Spaghetto quadrato allo scoglio', name_en: 'Square Spaghetti with Seafood', desc_it: 'Spaghetto quadrato con frutti di mare misti in salsa di pomodoro', desc_en: 'Square spaghetti with mixed seafood in tomato sauce', price: 17.00, image: 'images/primi.webp' },
    { id: 11, category: 'primi', name_it: 'Mezzo pacchero, Gamberi e Pistacchio', name_en: 'Pacchero with Prawns and Pistachio', desc_it: 'Mezzo pacchero con gamberi freschi e crema di pistacchio', desc_en: 'Pacchero pasta with fresh prawns and pistachio cream', price: 18.00, image: 'images/primi.webp' },
    { id: 12, category: 'primi', name_it: 'Pacchero All\'astice', name_en: 'Pacchero with Lobster', desc_it: 'Pacchero con astice fresco in salsa di pomodoro', desc_en: 'Pacchero pasta with fresh lobster in tomato sauce', price: 25.00, image: 'images/primi.webp' },
    // SECONDI
    { id: 13, category: 'secondi', name_it: 'Frittura di Calamari e Gamberetti', name_en: 'Fried Squid and Shrimp', desc_it: 'Frittura mista di calamari e gamberetti, croccante e dorata', desc_en: 'Mixed fried squid and shrimp, crispy and golden', price: 16.00, image: 'images/secondi.webp' },
    { id: 14, category: 'secondi', name_it: 'Grigliata al Bassotto Beach', name_en: 'Bassotto Beach Grill', desc_it: 'Grigliata mista di pesce fresco alla maniera del Bassotto Beach', desc_en: 'Mixed fresh fish grill in the Bassotto Beach style', price: 22.00, image: 'images/secondi.webp' },
    { id: 15, category: 'secondi', name_it: 'Tronchetto di Spada con cipolla caramellata', name_en: 'Swordfish with Caramelized Onion', desc_it: 'Tronchetto di pesce spada alla griglia con cipolla caramellata', desc_en: 'Grilled swordfish steak with caramelized onion', price: 18.00, image: 'images/secondi.webp' },
    { id: 16, category: 'secondi', name_it: 'Grigliata di Seppia', name_en: 'Grilled Cuttlefish', desc_it: 'Seppia fresca alla griglia con limone e prezzemolo', desc_en: 'Fresh grilled cuttlefish with lemon and parsley', price: 17.00, image: 'images/secondi.webp' },
    { id: 17, category: 'secondi', name_it: 'Spigola / Orata al forno', name_en: 'Sea Bass / Sea Bream', desc_it: 'Spigola o orata al forno, prezzo al 100gr', desc_en: 'Baked sea bass or sea bream, price per 100g', price: 5.00, image: 'images/secondi.webp' },
    // CONTORNI
    { id: 18, category: 'contorni', name_it: 'Patatine Stick', name_en: 'Stick Fries', desc_it: 'Patatine fritte a bastoncino, croccanti e dorate', desc_en: 'Crispy golden stick fries', price: 4.00, image: 'images/contorni.webp' },
    { id: 19, category: 'contorni', name_it: 'Patatine Dippers', name_en: 'Dipper Fries', desc_it: 'Patatine fritte a forma di dipper', desc_en: 'Dipper-shaped fries', price: 5.00, image: 'images/contorni.webp' },
    { id: 20, category: 'contorni', name_it: 'Verdure grigliate', name_en: 'Grilled Vegetables', desc_it: 'Verdure di stagione grigliate: zucchine, melanzane, peperoni', desc_en: 'Grilled seasonal vegetables: zucchini, eggplant, peppers', price: 6.00, image: 'images/contorni.webp' },
    { id: 21, category: 'contorni', name_it: 'Insalata verde', name_en: 'Green Salad', desc_it: 'Insalata verde fresca di stagione', desc_en: 'Fresh seasonal green salad', price: 4.00, image: 'images/contorni.webp' },
    { id: 22, category: 'contorni', name_it: 'Insalata di Pomodoro e cipolla', name_en: 'Tomato and Onion Salad', desc_it: 'Insalata di pomodori freschi con cipolla rossa', desc_en: 'Fresh tomato salad with red onion', price: 6.00, image: 'images/contorni.webp' },
    // PIZZE
    { id: 23, category: 'pizze', name_it: 'Margherita', name_en: 'Margherita', desc_it: 'Pomodoro san marzano D.o.p., Fior di latte, basilico', desc_en: 'San Marzano tomato D.o.p., Fior di latte, basil', price: 7.00, image: 'images/pizza.webp' },
    { id: 24, category: 'pizze', name_it: 'Salame', name_en: 'Salami', desc_it: 'Pom. san marzano D.o.p., Fior di latte, salsiccia di Calabria D.o.p.', desc_en: 'San Marzano tomato D.o.p., Fior di latte, Calabrian sausage D.o.p.', price: 16.00, image: 'images/pizza.webp' },
    { id: 25, category: 'pizze', name_it: 'Cardinale', name_en: 'Cardinale', desc_it: 'Pomodoro san marzano D.o.p., Fior di latte, Prosciutto Cotto', desc_en: 'San Marzano tomato D.o.p., Fior di latte, cooked ham', price: 10.00, image: 'images/pizza.webp' },
    { id: 26, category: 'pizze', name_it: 'Tropeana', name_en: 'Tropeana', desc_it: 'Pom. san marzano D.o.p., Fior di latte, Tonno pinna gialla, cipolla rossa di Tropea', desc_en: 'San Marzano tomato, Fior di latte, yellowfin tuna, Tropea red onion', price: 11.00, image: 'images/pizza.webp' },
    { id: 27, category: 'pizze', name_it: 'Napoli', name_en: 'Napoli', desc_it: 'Pom. san marzano D.o.p., Fior di latte, Olive nere, Capperi, filetti di Acciughe del cantabrico', desc_en: 'San Marzano tomato, Fior di latte, black olives, capers, Cantabrian anchovies', price: 11.00, image: 'images/pizza.webp' },
    { id: 28, category: 'pizze', name_it: 'Papà', name_en: 'Papà', desc_it: 'Pom. san marzano D.o.p., Fior di latte, Nduja di Spilinga, Cipolla rossa di Tropea, Guanciale di Suino nero di Calabria', desc_en: 'San Marzano tomato, Fior di latte, Nduja, Tropea red onion, Calabrian black pork cheek', price: 13.00, image: 'images/pizza.webp' },
    { id: 29, category: 'pizze', name_it: 'Silana', name_en: 'Silana', desc_it: 'Pom. san marzano D.o.p., Fior di latte, Salsiccia fresca calabrese, Funghi Porcini', desc_en: 'San Marzano tomato, Fior di latte, fresh Calabrian sausage, porcini mushrooms', price: 13.00, image: 'images/pizza.webp' },
    { id: 30, category: 'pizze', name_it: '4 Formaggi', name_en: '4 Cheeses', desc_it: 'Pom. san marzano D.o.p., Fior di latte, Gorgonzola, Provola affumicata, scaglie di Grano Padano', desc_en: 'San Marzano tomato, Fior di latte, Gorgonzola, smoked Provola, Grana Padano flakes', price: 12.00, image: 'images/pizza.webp' },
    { id: 31, category: 'pizze', name_it: 'Italiana', name_en: 'Italiana', desc_it: 'Fior di latte, Rucola, Crudo di Parma, Scaglie di Grana Padano, Datterino rosso', desc_en: 'Fior di latte, rocket, Parma ham, Grana Padano flakes, cherry tomatoes', price: 13.00, image: 'images/pizza.webp' },
    { id: 32, category: 'pizze', name_it: 'Cocktail', name_en: 'Cocktail', desc_it: 'Fior di latte, cocktail di Gamberi, Rucola', desc_en: 'Fior di latte, prawn cocktail, rocket', price: 15.00, image: 'images/pizza.webp' },
    { id: 33, category: 'pizze', name_it: 'Bimbo', name_en: 'Bimbo', desc_it: 'Pom. san marzano D.o.p., Fior di latte, Wuster e Patatine', desc_en: 'San Marzano tomato, Fior di latte, frankfurter and fries', price: 10.00, image: 'images/pizza.webp' },
    { id: 34, category: 'pizze', name_it: 'Mare', name_en: 'Mare', desc_it: 'Pom. san marzano D.o.p., Fior di latte, Frutti di mare', desc_en: 'San Marzano tomato, Fior di latte, mixed seafood', price: 15.00, image: 'images/pizza.webp' },
    { id: 35, category: 'pizze', name_it: 'Melissa', name_en: 'Melissa', desc_it: 'Focaccia morbida, Rucola, Crudo di Parma, Datterino rosso, Scaglie di Grana Padana, Bufala Campana D.o.p.', desc_en: 'Soft focaccia, rocket, Parma ham, cherry tomatoes, Grana Padana, Buffalo Mozzarella', price: 13.00, image: 'images/pizza.webp' },
    { id: 36, category: 'pizze', name_it: 'Clarissa', name_en: 'Clarissa', desc_it: 'Fior di Latte, Provola affumicata, Guanciale di Suino nero di Calabria, Cipolla Caramellata', desc_en: 'Fior di Latte, smoked Provola, Calabrian black pork cheek, caramelized onion', price: 13.00, image: 'images/pizza.webp' },
    { id: 37, category: 'pizze', name_it: 'Capricciosa', name_en: 'Capricciosa', desc_it: 'Pom. san marzano D.o.p., Fior di latte, Salsiccia Calabrese D.o.p., Prosciutto cotto, carciofi, champignon, olive nere', desc_en: 'San Marzano tomato, Fior di latte, Calabrian sausage, cooked ham, artichokes, mushrooms, black olives', price: 12.00, image: 'images/pizza.webp' },
    { id: 38, category: 'pizze', name_it: 'Roxy', name_en: 'Roxy', desc_it: 'Fior di Latte, Fiarelli, Salsiccia fresca Calabrese, scaglie di Grana Padano', desc_en: 'Fior di Latte, Fiarelli peppers, fresh Calabrian sausage, Grana Padano flakes', price: 14.00, image: 'images/pizza.webp' },
    { id: 39, category: 'pizze', name_it: 'Miele', name_en: 'Miele', desc_it: 'Fior di Latte, Guanciale di Suino nero di Calabria, Rucola, Salsina al Miele', desc_en: 'Fior di Latte, Calabrian black pork cheek, rocket, honey sauce', price: 12.00, image: 'images/pizza.webp' },
    { id: 40, category: 'pizze', name_it: 'Al Gambero', name_en: 'Al Gambero', desc_it: 'Pom. san marzano D.o.p., Fior di Latte, Gamberoni, Pancetta', desc_en: 'San Marzano tomato, Fior di Latte, king prawns, pancetta', price: 16.00, image: 'images/pizza.webp' },
    // BIBITE
    { id: 41, category: 'bibite', name_it: 'Acqua naturale', name_en: 'Still Water', desc_it: 'Acqua minerale naturale', desc_en: 'Natural mineral water', price: 2.50, image: 'images/contorni.webp' },
    { id: 42, category: 'bibite', name_it: 'Acqua frizzante', name_en: 'Sparkling Water', desc_it: 'Acqua minerale frizzante', desc_en: 'Sparkling mineral water', price: 2.50, image: 'images/contorni.webp' },
    { id: 43, category: 'bibite', name_it: 'Coca Cola', name_en: 'Coca Cola', desc_it: 'Coca Cola in lattina', desc_en: 'Coca Cola can', price: 3.00, image: 'images/contorni.webp' },
    { id: 44, category: 'bibite', name_it: 'Fanta', name_en: 'Fanta', desc_it: 'Fanta in lattina', desc_en: 'Fanta can', price: 3.00, image: 'images/contorni.webp' },
    { id: 45, category: 'bibite', name_it: 'Sprite', name_en: 'Sprite', desc_it: 'Sprite in lattina', desc_en: 'Sprite can', price: 3.00, image: 'images/contorni.webp' },
    { id: 46, category: 'bibite', name_it: 'Birra Ichnusa 0,20cl', name_en: 'Ichnusa Beer 0.20cl', desc_it: 'Birra Ichnusa non filtrata alla spina 0,20cl', desc_en: 'Unfiltered Ichnusa draft beer 0.20cl', price: 3.50, image: 'images/contorni.webp' },
    { id: 47, category: 'bibite', name_it: 'Birra Ichnusa 0,40cl', name_en: 'Ichnusa Beer 0.40cl', desc_it: 'Birra Ichnusa non filtrata alla spina 0,40cl', desc_en: 'Unfiltered Ichnusa draft beer 0.40cl', price: 6.00, image: 'images/contorni.webp' },
    { id: 48, category: 'bibite', name_it: 'Birra 33cl bottiglia', name_en: 'Beer 33cl bottle', desc_it: 'Birra in bottiglia 33cl', desc_en: 'Beer bottle 33cl', price: 3.00, image: 'images/contorni.webp' },
    // VINI
    { id: 49, category: 'vini', name_it: 'Vino bianco rosato frizzante', name_en: 'Sparkling Rosé White Wine', desc_it: 'Vino bianco rosato frizzante della casa', desc_en: 'House sparkling rosé white wine', price: 22.00, image: 'images/vini.webp' },
    { id: 50, category: 'vini', name_it: 'Vino Pecorello', name_en: 'Pecorello Wine', desc_it: 'Vino bianco Pecorello, vitigno autoctono calabrese', desc_en: 'Pecorello white wine, native Calabrian grape variety', price: 25.00, image: 'images/vini.webp' },
    { id: 51, category: 'vini', name_it: 'Vino rosato Cirò Zito', name_en: 'Cirò Zito Rosé Wine', desc_it: 'Vino rosato Cirò Zito, produzione calabrese', desc_en: 'Cirò Zito rosé wine, Calabrian production', price: 18.00, image: 'images/vini.webp' },
    { id: 52, category: 'vini', name_it: 'Vino bianco Cirò Zito', name_en: 'Cirò Zito White Wine', desc_it: 'Vino bianco Cirò Zito, produzione calabrese', desc_en: 'Cirò Zito white wine, Calabrian production', price: 18.00, image: 'images/vini.webp' },
    { id: 53, category: 'vini', name_it: 'Madre Goccia', name_en: 'Madre Goccia', desc_it: 'Vino bianco Madre Goccia, elegante e fresco', desc_en: 'Madre Goccia white wine, elegant and fresh', price: 25.00, image: 'images/vini.webp' },
    { id: 54, category: 'vini', name_it: 'Lumare Rosato', name_en: 'Lumare Rosé', desc_it: 'Vino rosato Lumare, fruttato e profumato', desc_en: 'Lumare rosé wine, fruity and fragrant', price: 25.00, image: 'images/vini.webp' }
  ]
};

// ===== LOCATIONS =====
const LOCATIONS = [
  { id: 'umbrella-1',  name_it: 'Ombrellone 1',  name_en: 'Umbrella 1' },
  { id: 'umbrella-2',  name_it: 'Ombrellone 2',  name_en: 'Umbrella 2' },
  { id: 'umbrella-3',  name_it: 'Ombrellone 3',  name_en: 'Umbrella 3' },
  { id: 'umbrella-4',  name_it: 'Ombrellone 4',  name_en: 'Umbrella 4' },
  { id: 'umbrella-5',  name_it: 'Ombrellone 5',  name_en: 'Umbrella 5' },
  { id: 'table-1',     name_it: 'Tavolo 1',       name_en: 'Table 1' },
  { id: 'table-2',     name_it: 'Tavolo 2',       name_en: 'Table 2' },
  { id: 'table-3',     name_it: 'Tavolo 3',       name_en: 'Table 3' }
];

function getLocationName(locationId, lang) {
  const loc = LOCATIONS.find(l => l.id === locationId);
  if (!loc) return locationId;
  return lang === 'en' ? loc.name_en : loc.name_it;
}
