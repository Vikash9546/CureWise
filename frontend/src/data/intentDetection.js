
// ============================================================
//  intentDetection.js  –  200-category NLP Intent Engine
// ============================================================

// ── 1. INTENT DEFINITIONS ────────────────────────────────────
export const INTENTS = {
    // ── EMERGENCY (checked first, always) ──
    emergency_chest_pain: { group: 'emergency', priority: 1, keywords: ['severe chest pain', 'heart attack', 'crushing chest', 'chest is crushing'] },
    emergency_stroke: { group: 'emergency', priority: 1, keywords: ['stroke', 'face drooping', 'arm weakness', 'sudden confusion', 'slurred speech'] },
    emergency_paralysis: { group: 'emergency', priority: 1, keywords: ['sudden paralysis', 'cant move', 'body not moving', 'paralysed'] },
    emergency_bleeding: { group: 'emergency', priority: 1, keywords: ['severe bleeding', 'wont stop bleeding', 'blood loss'] },
    emergency_high_fever: { group: 'emergency', priority: 1, keywords: ['very high fever', '105 fever', '104 fever', 'fever emergency', 'burning up'] },
    emergency_breathing: { group: 'emergency', priority: 1, keywords: ['cant breathe', 'cannot breathe', 'shortness of breath', 'choking', 'suffocating'] },
    emergency_suicide: { group: 'emergency', priority: 1, keywords: ['suicidal', 'want to die', 'kill myself', 'end my life', 'suicide'] },
    emergency_dehydration: { group: 'emergency', priority: 1, keywords: ['severe dehydration', 'not urinating', 'no urine', 'extreme thirst'] },
    emergency_allergy: { group: 'emergency', priority: 1, keywords: ['allergic reaction', 'anaphylaxis', 'throat swelling', 'face swelling', 'epipen'] },
    emergency_poison: { group: 'emergency', priority: 1, keywords: ['poisoning', 'swallowed poison', 'overdose', 'toxic', 'ingested chemical'] },

    // ── GENERAL SYMPTOMS ──
    symptom_headache: { group: 'symptom', priority: 5, keywords: ['headache', 'head hurts', 'head pain', 'head ache'] },
    symptom_migraine: { group: 'symptom', priority: 5, keywords: ['migraine', 'throbbing head', 'light sensitivity with headache'] },
    symptom_fever: { group: 'symptom', priority: 5, keywords: ['fever', 'high temperature', 'temperature high', 'feeling hot', 'burning up slightly'] },
    symptom_cold: { group: 'symptom', priority: 5, keywords: ['cold', 'runny nose', 'sneezing', 'stuffy nose', 'nasal congestion'] },
    symptom_cough: { group: 'symptom', priority: 5, keywords: ['cough', 'coughing', 'dry cough', 'wet cough', 'persistent cough'] },
    symptom_sore_throat: { group: 'symptom', priority: 5, keywords: ['sore throat', 'throat pain', 'throat hurts', 'scratchy throat'] },
    symptom_body_pain: { group: 'symptom', priority: 5, keywords: ['body pain', 'body ache', 'muscle pain', 'body is aching', 'all over pain'] },
    symptom_fatigue: { group: 'symptom', priority: 5, keywords: ['fatigue', 'tired', 'exhausted', 'no energy', 'always sleepy', 'weakness'] },
    symptom_dizziness: { group: 'symptom', priority: 5, keywords: ['dizzy', 'dizziness', 'lightheaded', 'vertigo', 'spinning feeling'] },
    symptom_nausea: { group: 'symptom', priority: 5, keywords: ['nausea', 'nauseous', 'feel like vomiting', 'queasy'] },
    symptom_vomiting: { group: 'symptom', priority: 5, keywords: ['vomiting', 'throwing up', 'vomit'] },
    symptom_diarrhea: { group: 'symptom', priority: 5, keywords: ['diarrhea', 'loose stools', 'watery stools', 'runny stomach'] },
    symptom_constipation: { group: 'symptom', priority: 5, keywords: ['constipation', 'cant poop', 'hard stools', 'no bowel movement'] },
    symptom_stomach_pain: { group: 'symptom', priority: 5, keywords: ['stomach pain', 'stomach ache', 'abdominal pain', 'belly pain', 'tummy pain'] },
    symptom_bloating: { group: 'symptom', priority: 5, keywords: ['bloating', 'bloated', 'gassy', 'gas problem', 'stomach full'] },
    symptom_chest_discomfort: { group: 'symptom', priority: 3, keywords: ['chest discomfort', 'chest pressure', 'tight chest', 'mild chest pain'] },
    symptom_sweating: { group: 'symptom', priority: 5, keywords: ['excessive sweating', 'too much sweating', 'night sweats', 'sweating a lot'] },
    symptom_chills: { group: 'symptom', priority: 5, keywords: ['chills', 'shivering', 'feeling cold', 'goosebumps fever'] },

    // ── HEART & BLOOD ──
    heart_high_bp: { group: 'heart', priority: 4, keywords: ['high blood pressure', 'hypertension', 'bp high', 'blood pressure high'] },
    heart_low_bp: { group: 'heart', priority: 4, keywords: ['low blood pressure', 'hypotension', 'bp low', 'feeling faint low bp'] },
    heart_cholesterol: { group: 'heart', priority: 4, keywords: ['high cholesterol', 'cholesterol', 'ldl', 'hdl', 'lipid profile'] },
    heart_palpitations: { group: 'heart', priority: 4, keywords: ['heart palpitations', 'heart racing', 'heartbeat fast', 'rapid heartbeat'] },
    heart_irregular: { group: 'heart', priority: 4, keywords: ['irregular heartbeat', 'arrhythmia', 'skipping beats', 'uneven heartbeat'] },
    heart_chest_tight: { group: 'heart', priority: 4, keywords: ['chest tightness', 'tight chest', 'pressure in chest', 'angina'] },
    heart_stroke_aware: { group: 'heart', priority: 4, keywords: ['stroke awareness', 'stroke prevention', 'signs of stroke'] },
    heart_circulation: { group: 'heart', priority: 4, keywords: ['blood circulation', 'poor circulation', 'circulation problem', 'numb hands', 'numb feet'] },
    heart_varicose: { group: 'heart', priority: 4, keywords: ['varicose veins', 'spider veins', 'leg veins', 'vein pain'] },
    heart_anemia: { group: 'heart', priority: 4, keywords: ['anemia', 'anaemia', 'low hemoglobin', 'haemoglobin low'] },
    heart_iron: { group: 'heart', priority: 4, keywords: ['iron deficiency', 'low iron', 'need iron'] },
    heart_blood_sugar: { group: 'heart', priority: 4, keywords: ['blood sugar control', 'sugar level', 'glucose control', 'glycemic'] },
    heart_heartburn: { group: 'heart', priority: 4, keywords: ['heartburn', 'acid reflux', 'gerd', 'burning in chest after eating'] },
    heart_triglycerides: { group: 'heart', priority: 4, keywords: ['triglycerides', 'high triglycerides', 'blood fat'] },
    heart_blood_clot: { group: 'heart', priority: 4, keywords: ['blood clot', 'clotting', 'dvt', 'thrombosis'] },

    // ── MENTAL HEALTH ──
    mental_stress: { group: 'mental', priority: 4, keywords: ['stressed', 'stress', 'under pressure', 'too much stress', 'overwhelmed'] },
    mental_anxiety: { group: 'mental', priority: 4, keywords: ['anxiety', 'anxious', 'nervous all the time', 'anxious feeling', 'panic'] },
    mental_depression: { group: 'mental', priority: 4, keywords: ['depressed', 'depression', 'feeling hopeless', 'no joy', 'empty feeling'] },
    mental_panic: { group: 'mental', priority: 4, keywords: ['panic attack', 'panic attacks', 'sudden fear', 'heart racing anxiety'] },
    mental_insomnia: { group: 'mental', priority: 4, keywords: ['insomnia', 'cant sleep', 'sleep problem', 'trouble sleeping', 'no sleep'] },
    mental_overthinking: { group: 'mental', priority: 5, keywords: ['overthinking', 'cant stop thinking', 'racing thoughts', 'mental loop'] },
    mental_mood_swings: { group: 'mental', priority: 5, keywords: ['mood swings', 'mood changes', 'emotional roller coaster', 'irritable moods'] },
    mental_burnout: { group: 'mental', priority: 5, keywords: ['burnout', 'burnt out', 'burned out', 'exhausted mentally', 'no motivation work'] },
    mental_numbness: { group: 'mental', priority: 5, keywords: ['emotional numbness', 'feel nothing', 'no emotions', 'numb emotionally'] },
    mental_social_anxiety: { group: 'mental', priority: 4, keywords: ['social anxiety', 'scared of people', 'fear of crowds', 'social phobia'] },
    mental_motivation: { group: 'mental', priority: 5, keywords: ['lack of motivation', 'no motivation', 'unmotivated', 'cant get started'] },
    mental_brain_fog: { group: 'mental', priority: 5, keywords: ['brain fog', 'foggy mind', 'cant think clearly', 'mental clarity'] },
    mental_memory: { group: 'mental', priority: 5, keywords: ['memory issues', 'forgetful', 'poor memory', 'cant remember'] },
    mental_concentration: { group: 'mental', priority: 5, keywords: ['concentration issues', 'cant focus', 'focus problem', 'attention issue'] },
    mental_anger: { group: 'mental', priority: 5, keywords: ['anger control', 'anger issues', 'anger management', 'lose temper', 'rage'] },
    mental_loneliness: { group: 'mental', priority: 5, keywords: ['loneliness', 'feel lonely', 'isolated', 'no friends', 'alone feeling'] },
    mental_grief: { group: 'mental', priority: 4, keywords: ['grief', 'grieving', 'lost someone', 'coping with loss', 'mourning'] },
    mental_trauma: { group: 'mental', priority: 4, keywords: ['trauma', 'ptsd', 'traumatic experience', 'flashbacks', 'past trauma'] },
    mental_confidence: { group: 'mental', priority: 5, keywords: ['self confidence', 'low confidence', 'self esteem', 'believe in myself'] },
    mental_relaxation: { group: 'mental', priority: 5, keywords: ['relaxation techniques', 'how to relax', 'calm down', 'relaxation methods'] },

    // ── DIET & NUTRITION ──
    diet_weight_loss: { group: 'diet', priority: 5, keywords: ['weight loss', 'lose weight', 'slim down', 'reduce weight', 'fat loss'] },
    diet_weight_gain: { group: 'diet', priority: 5, keywords: ['weight gain', 'gain weight', 'underweight', 'too thin'] },
    diet_plant_based: { group: 'diet', priority: 5, keywords: ['plant based diet', 'vegan diet', 'vegetarian diet', 'plant based'] },
    diet_keto: { group: 'diet', priority: 5, keywords: ['keto diet', 'ketogenic', 'low carb high fat', 'ketosis'] },
    diet_intermittent: { group: 'diet', priority: 5, keywords: ['intermittent fasting', '16:8 fasting', 'fasting diet', 'time restricted eating'] },
    diet_detox: { group: 'diet', priority: 5, keywords: ['detox diet', 'body cleanse', 'detox plan', 'detoxification'] },
    diet_protein: { group: 'diet', priority: 5, keywords: ['protein sources', 'protein intake', 'high protein food', 'need more protein'] },
    diet_vitamin: { group: 'diet', priority: 5, keywords: ['vitamin deficiency', 'lacking vitamins', 'low vitamin'] },
    diet_vitamin_d: { group: 'diet', priority: 5, keywords: ['vitamin d', 'vitamin d deficiency', 'low vitamin d', 'sunshine vitamin'] },
    diet_vitamin_b12: { group: 'diet', priority: 5, keywords: ['vitamin b12', 'b12 deficiency', 'low b12', 'cobalamin'] },
    diet_calcium: { group: 'diet', priority: 5, keywords: ['calcium intake', 'calcium deficiency', 'low calcium', 'need calcium'] },
    diet_fiber: { group: 'diet', priority: 5, keywords: ['fiber rich foods', 'dietary fiber', 'need more fiber', 'high fiber diet'] },
    diet_gut: { group: 'diet', priority: 5, keywords: ['gut health', 'gut issues', 'leaky gut', 'digestive health', 'microbiome'] },
    diet_probiotics: { group: 'diet', priority: 5, keywords: ['probiotics', 'good bacteria', 'probiotic food', 'fermented food'] },
    diet_hydration: { group: 'diet', priority: 5, keywords: ['hydration', 'drink more water', 'dehydrated', 'water intake'] },
    diet_sugar_cravings: { group: 'diet', priority: 5, keywords: ['sugar cravings', 'sugar addiction', 'craving sweets', 'too much sugar'] },
    diet_snacks: { group: 'diet', priority: 5, keywords: ['healthy snacks', 'snack ideas', 'snacking', 'healthy munching'] },
    diet_meal_plan: { group: 'diet', priority: 5, keywords: ['meal planning', 'balanced meal', 'meal prep', 'diet plan'] },
    diet_anti_inflammatory: { group: 'diet', priority: 5, keywords: ['anti inflammatory diet', 'inflammation diet', 'reduce inflammation food'] },
    diet_immunity_food: { group: 'diet', priority: 5, keywords: ['immunity foods', 'immune boosting food', 'eat for immunity'] },
    diet_iron_food: { group: 'diet', priority: 5, keywords: ['iron rich foods', 'foods high in iron', 'iron food sources'] },
    diet_breakfast: { group: 'diet', priority: 5, keywords: ['healthy breakfast', 'morning meal', 'breakfast ideas', 'what to eat morning'] },
    diet_dinner: { group: 'diet', priority: 5, keywords: ['healthy dinner', 'dinner ideas', 'what to eat at night', 'dinner meal'] },
    diet_superfoods: { group: 'diet', priority: 5, keywords: ['superfoods', 'super foods', 'power foods', 'nutrient dense foods'] },
    diet_organic: { group: 'diet', priority: 5, keywords: ['organic food', 'organic benefits', 'why eat organic', 'organic vs normal'] },

    // ── NATURAL REMEDIES & HERBS ──
    herb_turmeric: { group: 'remedy', priority: 5, keywords: ['turmeric', 'haldi', 'curcumin', 'turmeric benefits'] },
    herb_ginger: { group: 'remedy', priority: 5, keywords: ['ginger', 'adrak', 'ginger benefits', 'ginger tea'] },
    herb_tulsi: { group: 'remedy', priority: 5, keywords: ['tulsi', 'holy basil', 'tulsi benefits', 'tulsi tea'] },
    herb_ashwagandha: { group: 'remedy', priority: 5, keywords: ['ashwagandha', 'withania', 'ashwagandha benefits'] },
    herb_aloe_vera: { group: 'remedy', priority: 5, keywords: ['aloe vera', 'aloe gel', 'aloe vera juice', 'aloe benefits'] },
    herb_neem: { group: 'remedy', priority: 5, keywords: ['neem', 'neem leaves', 'neem benefits', 'neem oil'] },
    herb_garlic: { group: 'remedy', priority: 5, keywords: ['garlic', 'lahsun', 'garlic benefits', 'raw garlic'] },
    herb_honey: { group: 'remedy', priority: 5, keywords: ['honey remedies', 'raw honey', 'honey benefits', 'manuka honey'] },
    herb_lemon: { group: 'remedy', priority: 5, keywords: ['lemon water', 'lemon benefits', 'lemon juice', 'warm lemon'] },
    herb_green_tea: { group: 'remedy', priority: 5, keywords: ['green tea', 'green tea benefits', 'matcha', 'antioxidant tea'] },
    herb_chamomile: { group: 'remedy', priority: 5, keywords: ['chamomile', 'chamomile tea', 'chamomile benefits'] },
    herb_peppermint: { group: 'remedy', priority: 5, keywords: ['peppermint oil', 'peppermint', 'mint oil', 'peppermint benefits'] },
    herb_eucalyptus: { group: 'remedy', priority: 5, keywords: ['eucalyptus oil', 'eucalyptus', 'eucalyptus benefits'] },
    herb_herbal_tea: { group: 'remedy', priority: 5, keywords: ['herbal tea', 'herbal teas', 'which herbal tea', 'best herbal tea'] },
    herb_essential_oils: { group: 'remedy', priority: 5, keywords: ['essential oils', 'aromatherapy', 'essential oil benefits'] },
    herb_ayurveda: { group: 'remedy', priority: 5, keywords: ['ayurveda', 'ayurvedic', 'ayurvedic medicine', 'ayurvedic treatment'] },
    herb_naturopathy: { group: 'remedy', priority: 5, keywords: ['naturopathy', 'natural healing', 'naturopath'] },
    herb_detox_drinks: { group: 'remedy', priority: 5, keywords: ['detox drinks', 'detox water', 'cleansing drinks', 'detox juice'] },
    herb_immunity_herbs: { group: 'remedy', priority: 5, keywords: ['herbal immunity', 'immune herbs', 'immunity booster herb'] },
    herb_natural_antibiotic: { group: 'remedy', priority: 5, keywords: ['natural antibiotic', 'herbal antibiotic', 'nature antibiotic foods'] },
    herb_herbal_pain: { group: 'remedy', priority: 5, keywords: ['herbal pain relief', 'natural pain relief', 'herb for pain'] },
    herb_cold_remedy: { group: 'remedy', priority: 5, keywords: ['home remedy cold', 'natural cold remedy', 'cold treatment home', 'kadha'] },
    herb_sleep_aid: { group: 'remedy', priority: 5, keywords: ['natural sleep aid', 'herb for sleep', 'sleep remedy', 'melatonin food'] },
    herb_skin_care: { group: 'remedy', priority: 5, keywords: ['herbal skin care', 'natural skin care', 'skin herbs'] },
    herb_hair_care: { group: 'remedy', priority: 5, keywords: ['herbal hair care', 'natural hair remedy', 'hair herbs', 'hair oil'] },

    // ── SKIN & HAIR ──
    skin_acne: { group: 'skin', priority: 5, keywords: ['acne', 'breakout', 'pimple', 'acne treatment'] },
    skin_pimples: { group: 'skin', priority: 5, keywords: ['pimples', 'whiteheads', 'blackheads', 'spots on face'] },
    skin_oily: { group: 'skin', priority: 5, keywords: ['oily skin', 'skin too oily', 'greasy face', 'sebum'] },
    skin_dry: { group: 'skin', priority: 5, keywords: ['dry skin', 'skin dryness', 'flaky skin', 'rough skin'] },
    skin_dark_circles: { group: 'skin', priority: 5, keywords: ['dark circles', 'under eye dark', 'puffy eyes', 'eye bags'] },
    skin_wrinkles: { group: 'skin', priority: 5, keywords: ['wrinkles', 'fine lines', 'anti aging skin', 'aging skin'] },
    skin_pigmentation: { group: 'skin', priority: 5, keywords: ['pigmentation', 'dark spots', 'hyperpigmentation', 'uneven skin tone'] },
    skin_eczema: { group: 'skin', priority: 5, keywords: ['eczema', 'atopic dermatitis', 'eczema treatment', 'skin rash'] },
    skin_psoriasis: { group: 'skin', priority: 5, keywords: ['psoriasis', 'skin plaques', 'scaly skin', 'psoriasis treatment'] },
    hair_fall: { group: 'skin', priority: 5, keywords: ['hair fall', 'hair loss', 'losing hair', 'hair shedding'] },
    hair_dandruff: { group: 'skin', priority: 5, keywords: ['dandruff', 'flaky scalp', 'scalp flakes', 'dandruff treatment'] },
    hair_growth: { group: 'skin', priority: 5, keywords: ['hair growth', 'grow hair faster', 'hair regrowth', 'hair growth tips'] },
    hair_split_ends: { group: 'skin', priority: 5, keywords: ['split ends', 'hair damage', 'damaged hair tips'] },
    hair_greying: { group: 'skin', priority: 5, keywords: ['premature greying', 'white hair young', 'grey hair early', 'premature gray'] },
    hair_scalp: { group: 'skin', priority: 5, keywords: ['scalp itching', 'itchy scalp', 'scalp irritation'] },
    skin_face_mask: { group: 'skin', priority: 5, keywords: ['face mask', 'natural face mask', 'diy face mask', 'home face mask'] },
    skin_sunscreen: { group: 'skin', priority: 5, keywords: ['sunscreen', 'spf', 'sun protection', 'sunblock'] },
    skin_allergy: { group: 'skin', priority: 5, keywords: ['skin allergy', 'allergic skin', 'rash allergy', 'contact dermatitis'] },
    skin_anti_aging: { group: 'skin', priority: 5, keywords: ['anti aging', 'anti-aging', 'look younger', 'reverse aging skin'] },
    skin_glow: { group: 'skin', priority: 5, keywords: ['natural glow', 'glowing skin', 'skin glow tips', 'bright skin'] },

    // ── LIFESTYLE & FITNESS ──
    life_exercise: { group: 'lifestyle', priority: 5, keywords: ['exercise routine', 'workout plan', 'exercise tips', 'fitness routine'] },
    life_yoga: { group: 'lifestyle', priority: 5, keywords: ['yoga', 'yoga for beginners', 'yoga poses', 'yoga benefits'] },
    life_meditation: { group: 'lifestyle', priority: 5, keywords: ['meditation', 'meditate', 'mindfulness', 'meditation guide'] },
    life_breathing: { group: 'lifestyle', priority: 5, keywords: ['breathing exercises', 'pranayama', 'breathwork', 'deep breathing'] },
    life_morning: { group: 'lifestyle', priority: 5, keywords: ['morning routine', 'morning habits', 'morning ritual', 'wake up routine'] },
    life_sleep: { group: 'lifestyle', priority: 5, keywords: ['sleep hygiene', 'better sleep', 'sleep quality', 'good sleep habits'] },
    life_posture: { group: 'lifestyle', priority: 5, keywords: ['posture', 'posture correction', 'bad posture', 'sitting posture'] },
    life_back_pain: { group: 'lifestyle', priority: 5, keywords: ['back pain', 'lower back pain', 'back pain exercise', 'back pain relief'] },
    life_neck_pain: { group: 'lifestyle', priority: 5, keywords: ['neck pain', 'neck stiffness', 'neck relief', 'stiff neck'] },
    life_joint_pain: { group: 'lifestyle', priority: 5, keywords: ['joint pain', 'joint ache', 'sore joints', 'joint inflammation'] },
    life_arthritis: { group: 'lifestyle', priority: 5, keywords: ['arthritis', 'rheumatoid', 'arthritis pain', 'arthritis care'] },
    life_walking: { group: 'lifestyle', priority: 5, keywords: ['walking benefits', 'daily walk', 'how much to walk', 'walk for health'] },
    life_running: { group: 'lifestyle', priority: 5, keywords: ['running tips', 'jogging', 'how to run', 'running for health'] },
    life_stretching: { group: 'lifestyle', priority: 5, keywords: ['stretching routine', 'flexibility', 'stretch exercises', 'daily stretches'] },
    life_home_workout: { group: 'lifestyle', priority: 5, keywords: ['home workout', 'workout at home', 'no gym exercise', 'home fitness'] },
    life_immunity_habits: { group: 'lifestyle', priority: 5, keywords: ['immunity boosting habits', 'build immunity', 'strong immune system'] },
    life_cold_shower: { group: 'lifestyle', priority: 5, keywords: ['cold shower', 'cold shower benefits', 'ice bath'] },
    life_sunlight: { group: 'lifestyle', priority: 5, keywords: ['sunlight exposure', 'morning sunlight', 'sunshine benefits'] },
    life_screen_time: { group: 'lifestyle', priority: 5, keywords: ['screen time', 'too much screen', 'screen time management', 'digital eye'] },
    life_digital_detox: { group: 'lifestyle', priority: 5, keywords: ['digital detox', 'phone detox', 'social media detox', 'unplug'] },
    life_healthy_habits: { group: 'lifestyle', priority: 5, keywords: ['healthy habits', 'habit building', 'build good habits'] },
    life_sedentary: { group: 'lifestyle', priority: 5, keywords: ['sedentary lifestyle', 'sitting too much', 'inactive lifestyle'] },
    life_office: { group: 'lifestyle', priority: 5, keywords: ['office health', 'desk health', 'work health tips', 'office wellness'] },
    life_balance: { group: 'lifestyle', priority: 5, keywords: ['work life balance', 'life balance', 'balance work personal'] },
    life_stress_habits: { group: 'lifestyle', priority: 5, keywords: ['stress management habits', 'daily stress relief', 'cope with stress'] },

    // ── WOMEN'S HEALTH ──
    womens_pcos: { group: 'womens', priority: 4, keywords: ['pcos', 'polycystic ovary', 'pcos symptoms', 'pcos help'] },
    womens_pcod: { group: 'womens', priority: 4, keywords: ['pcod', 'polycystic ovarian disease', 'pcod symptoms'] },
    womens_period_pain: { group: 'womens', priority: 4, keywords: ['menstrual pain', 'period pain', 'period cramps', 'dysmenorrhea'] },
    womens_irregular: { group: 'womens', priority: 4, keywords: ['irregular periods', 'missed period', 'late period', 'inconsistent cycle'] },
    womens_hormonal: { group: 'womens', priority: 4, keywords: ['hormonal imbalance', 'hormone imbalance', 'hormone issues', 'hormones off'] },
    womens_pms: { group: 'womens', priority: 4, keywords: ['pms', 'premenstrual syndrome', 'pre period symptoms', 'pms mood'] },
    womens_menopause: { group: 'womens', priority: 4, keywords: ['menopause', 'perimenopause', 'hot flashes', 'end of periods'] },
    womens_fertility: { group: 'womens', priority: 4, keywords: ['fertility support', 'trying to conceive', 'ovulation', 'fertility tips'] },
    womens_pregnancy: { group: 'womens', priority: 4, keywords: ['pregnancy nutrition', 'pregnant diet', 'pregnancy tips', 'eating while pregnant'] },
    womens_postpartum: { group: 'womens', priority: 4, keywords: ['postpartum', 'after delivery', 'postnatal', 'postpartum depression'] },
    womens_breast: { group: 'womens', priority: 4, keywords: ['breast health', 'breast pain', 'breast lump', 'breast care'] },
    womens_thyroid: { group: 'womens', priority: 4, keywords: ['thyroid', 'hypothyroid', 'hyperthyroid', 'thyroid issues', 'thyroid women'] },
    womens_iron: { group: 'womens', priority: 4, keywords: ['iron deficiency women', 'low iron women', 'anemia women'] },
    womens_vaginal: { group: 'womens', priority: 4, keywords: ['vaginal health', 'vaginal discharge', 'vaginal infection', 'intimate health'] },
    womens_uti: { group: 'womens', priority: 4, keywords: ['uti', 'urinary tract infection', 'burning urination', 'frequent uti'] },
    womens_hair_fall: { group: 'womens', priority: 4, keywords: ['hair fall women', 'female hair loss', 'hair thinning women'] },
    womens_bone: { group: 'womens', priority: 4, keywords: ['bone density women', 'osteoporosis', 'weak bones women'] },
    womens_calcium: { group: 'womens', priority: 4, keywords: ['calcium deficiency women', 'calcium women', 'need calcium female'] },
    womens_period_mood: { group: 'womens', priority: 4, keywords: ['mood swings period', 'emotional during period', 'pms mood', 'period emotions'] },
    womens_pcos_weight: { group: 'womens', priority: 4, keywords: ['weight gain pcos', 'pcos weight management', 'pcos obesity', 'pcos fat'] },

    // ── MEN'S HEALTH ──
    mens_testosterone: { group: 'mens', priority: 4, keywords: ['testosterone', 'low testosterone', 'testosterone boost', 'testosterone health'] },
    mens_hair_loss: { group: 'mens', priority: 4, keywords: ['hair loss men', 'male baldness', 'male pattern baldness', 'hair loss male'] },
    mens_prostate: { group: 'mens', priority: 4, keywords: ['prostate', 'prostate health', 'enlarged prostate', 'prostate issues'] },
    mens_erectile: { group: 'mens', priority: 4, keywords: ['erectile health', 'erectile dysfunction', 'ed', 'sexual health men'] },
    mens_stamina: { group: 'mens', priority: 4, keywords: ['stamina improvement', 'increase stamina', 'low stamina', 'endurance men'] },
    mens_muscle: { group: 'mens', priority: 4, keywords: ['muscle gain', 'build muscle', 'muscle building', 'gain muscle men'] },
    mens_belly_fat: { group: 'mens', priority: 4, keywords: ['belly fat', 'lose belly fat', 'reduce belly', 'stomach fat men'] },
    mens_stress: { group: 'mens', priority: 4, keywords: ['stress men', 'male stress', 'men mental health', 'man stress'] },
    mens_heart: { group: 'mens', priority: 4, keywords: ['heart risk men', 'heart disease men', 'cardiac risk male'] },
    mens_sleep: { group: 'mens', priority: 4, keywords: ['sleep issues men', 'men insomnia', 'male sleep problems'] },

    // ── CHILD & ELDERLY ──
    child_immunity: { group: 'child', priority: 4, keywords: ['child immunity', 'kid immunity', 'kids immune', 'child immune system'] },
    child_nutrition: { group: 'child', priority: 4, keywords: ['child nutrition', 'kids nutrition', 'baby food', 'toddler diet', 'children diet'] },
    child_growth: { group: 'child', priority: 4, keywords: ['child growth', 'growth concerns', 'child height', 'stunted growth'] },
    child_obesity: { group: 'child', priority: 4, keywords: ['childhood obesity', 'overweight child', 'obese kid', 'kid weight problem'] },
    elder_joint: { group: 'elderly', priority: 4, keywords: ['elderly joint pain', 'old age joint', 'senior joint pain'] },
    elder_memory: { group: 'elderly', priority: 4, keywords: ['memory elderly', 'old age memory', 'dementia', 'alzheimer', 'senior forgetfulness'] },
    elder_bone: { group: 'elderly', priority: 4, keywords: ['bone health elderly', 'osteoporosis elderly', 'senior bone health'] },
    elder_diabetes: { group: 'elderly', priority: 4, keywords: ['diabetes elderly', 'old age diabetes', 'senior diabetes'] },
    elder_sleep: { group: 'elderly', priority: 4, keywords: ['sleep elderly', 'old age sleep', 'senior sleep', 'insomnia elderly'] },
    elder_fall: { group: 'elderly', priority: 4, keywords: ['fall prevention', 'prevent falls elderly', 'senior balance', 'old age falls'] },

    // ── FALLBACK ──
    general: { group: 'general', priority: 10, keywords: [] }
};

// ── 2. RESPONSE TEMPLATES ────────────────────────────────────
export const RESPONSES = {
    // Emergency
    emergency: `🚨 **EMERGENCY ALERT**\n\nThis sounds like a medical emergency. **Please call emergency services (112 / 911) immediately or ask someone nearby for help.**\n\n⚠️ Do NOT delay seeking professional help.\n\nIf this is about suicidal thoughts: You matter. Please call **iCall: 9152987821** (India) or text a crisis line. You are not alone. 💙`,

    // Symptom groups
    symptom_headache: `🤕 **Headache Relief Tips**\n\n- Stay hydrated (dehydration is a major cause)\n- Rest in a dark, quiet room\n- Apply peppermint oil on temples\n- Try "4-7-8" breathing to release tension\n\n**Natural Remedies:** Ginger tea, Lavender oil, Magnesium-rich foods\n\n💡 If headaches are frequent or severe, consult a doctor.`,
    symptom_migraine: `🌀 **Migraine Support**\n\n- Lie in a dark, cool, quiet room\n- Apply cold/warm compress to forehead\n- Avoid screens and bright lights\n- Stay hydrated\n\n**Triggers to watch:** Stress, lack of sleep, certain foods (caffeine, chocolate)\n**Natural Aid:** Magnesium supplements, Butterbur herb, Riboflavin (B2)\n\n💡 Track your migraine diary to find patterns.`,
    symptom_fever: `🌡️ **Managing Fever Naturally**\n\n- Rest and hydrate (water, coconut water, ORS)\n- Use a damp cool cloth on forehead\n- Tulsi + ginger tea can help\n- Wear light, breathable clothing\n\n⚠️ Seek medical help if fever is above 103°F (39.4°C) or lasts more than 3 days.`,
    symptom_cold: `🤧 **Natural Cold Remedies**\n\n- Steam inhalation with eucalyptus oil\n- Tulsi-ginger-honey kadha (twice daily)\n- Saline nasal rinse\n- Rest and stay warm\n\n**Foods that help:** Garlic, Vitamin C (citrus, amla), Chicken broth`,
    symptom_cough: `😮‍💨 **Cough Relief Naturally**\n\n- Honey + warm water (best cough suppressant)\n- Ginger tea with black pepper\n- Salt water gargle\n- Steam inhalation\n\n💡 Dry cough? Try Licorice (mulethi) tea. Wet cough? Focus on steam and postural drainage.\n⚠️ Persistent cough (>3 weeks) — consult a doctor.`,
    symptom_sore_throat: `🗣️ **Sore Throat Relief**\n\n- Warm salt water gargle (3x/day)\n- Honey + lemon in warm water\n- Turmeric milk (golden milk)\n- Tulsi tea\n\n**Avoid:** Cold drinks, talking loudly, spicy food`,
    symptom_fatigue: `😴 **Fighting Fatigue Naturally**\n\n- Check Iron, B12, Vitamin D levels\n- Ashwagandha (adaptogen for energy)\n- 7-9 hours of quality sleep\n- Short 10-min walks to boost circulation\n\n**Energy foods:** Bananas, nuts, oats, dates, dark chocolate`,
    symptom_dizziness: `💫 **Dizziness Tips**\n\n- Sit or lie down immediately\n- Sip water slowly (dehydration is common cause)\n- Deep slow breaths\n- Avoid sudden head movements\n\n💡 Frequent dizziness may need a doctor — could be inner ear, BP, or anemia related.`,
    symptom_nausea: `🤢 **Nausea Relief**\n\n- Sip ginger tea or chew raw ginger\n- Peppermint tea\n- Eat small, bland foods (toast, banana, rice)\n- Acupressure on P6 point (inner wrist)\n\n**Avoid:** Strong smells, fatty/greasy foods, lying flat`,
    symptom_stomach_pain: `🫁 **Stomach Pain Relief**\n\n- Hot water bag on abdomen\n- Fennel (saunf) tea for cramps\n- Ajwain (carom seeds) + warm water for indigestion\n- Light BRAT diet (Banana, Rice, Applesauce, Toast)\n\n⚠️ Severe or sudden pain: seek medical attention.`,
    symptom_bloating: `🎈 **Beat Bloating**\n\n- Sip warm water or fennel tea after meals\n- Walk 10 minutes post-meal\n- Avoid carbonated drinks and cruciferous veggies if sensitive\n- Probiotics (curd, fermented foods)\n\n**Yoga:** Pawanmuktasana (Wind-Relieving Pose) works wonders!`,
    symptom_diarrhea: `🚽 **Managing Diarrhea**\n\n- ORS (Oral Rehydration Solution) — stay hydrated!\n- BRAT diet: Banana, Rice, Applesauce, Toast\n- Curd/yogurt for good bacteria\n- Avoid dairy, spicy, oily foods\n\n⚠️ If diarrhea lasts more than 2 days or there is blood, see a doctor immediately.`,
    symptom_constipation: `💩 **Relieve Constipation Naturally**\n\n- Drink 8+ glasses of water daily\n- High-fiber foods: flaxseeds, prunes, figs, papaya\n- Triphala powder (1 tsp warm water at night)\n- Morning walk + warm water on waking\n\n**Avoid:** Processed foods, excess cheese, meat`,

    // Heart & Blood
    heart: `❤️ **Heart & Blood Health Guidance**\n\nI'm happy to help. Here are general heart health tips:\n\n- Reduce salt and saturated fats\n- Exercise 30 min/day (walking is great)\n- Garlic, Hibiscus tea, Flaxseeds support heart health\n- Manage stress (a major heart risk factor)\n\n💡 For specific concerns like high BP, cholesterol, or palpitations, I can give more targeted advice. What would you like to know more about?`,

    // Mental Health
    mental: `🧠 **I Hear You — You're Not Alone**\n\nIt's okay to feel this way. Your mental health matters deeply.\n\n**Immediate Relief Technique:** Try the **4-7-8 Breath**:\n- Inhale for 4 counts\n- Hold for 7 counts\n- Exhale slowly for 8 counts\n(Repeat 3 times)\n\n**Natural Aids:**\n- Ashwagandha — reduces cortisol (stress hormone)\n- Chamomile tea — calms the nervous system\n- Omega-3 rich foods — supports brain health\n\n**Also helpful:** Journaling, morning sunlight, digital detox, 20-min daily walk\n\n💙 If feelings are overwhelming, please speak to a counselor. Would you like to explore more tips?`,

    // Diet & Nutrition
    diet: `🥗 **Nutrition & Diet Guidance**\n\nHere are key principles for optimal health:\n\n- **Eat the rainbow** — varied colorful vegetables & fruits\n- **Protein at every meal** — legumes, eggs, dairy, lean meats\n- **Healthy fats** — nuts, seeds, avocado, olive oil\n- **Minimize** ultra-processed food, added sugar, refined carbs\n- **Hydrate** — 8-10 glasses of water daily\n\n💡 Want advice on weight loss, vitamin deficiencies, specific diets (keto, plant-based), or meal planning? Just ask!`,

    // Natural Remedies
    remedy: `🌿 **Natural Remedies & Herbs**\n\nNature has powerful solutions! Here are some popular ones:\n\n- 🟡 **Turmeric** — anti-inflammatory, antioxidant\n- 🫚 **Ginger** — digestion, nausea, immunity\n- 🌱 **Ashwagandha** — stress, energy, hormones\n- 🍃 **Tulsi** — respiratory health, immunity\n- 🧄 **Garlic** — heart health, natural antibiotic\n\nTell me which herb or remedy you'd like to learn more about, and I'll give you full benefits, usage, and precautions!`,

    // Skin & Hair
    skin: `✨ **Skin & Hair Care Naturally**\n\nNatural skincare tips:\n\n- Aloe Vera gel — soothes, hydrates, heals acne\n- Turmeric + honey face mask — brightens skin\n- Neem — anti-bacterial for acne-prone skin\n- Coconut/castor oil — promotes hair growth\n- Stay hydrated — skin reflects your water intake\n\n💡 Tell me your specific concern (acne, dark circles, hair fall, dandruff etc.) and I'll give you a targeted natural routine!`,

    // Lifestyle & Fitness
    lifestyle: `🧘 **Lifestyle & Fitness Tips**\n\nBuilding healthy habits is life-changing:\n\n- **Morning routine:** Warm water + sunlight + light movement\n- **Exercise:** 30 min of moderate activity (walk, yoga, swim)\n- **Sleep:** 7-9 hours, consistent bedtime\n- **Meditation:** Even 10 minutes reduces stress significantly\n- **Limit:** Screen time, junk food, alcohol\n\n🏃 What's your current challenge? Exercise routine, yoga, sleep, or something else?`,

    // Women's Health
    womens: `👩 **Women's Wellness Guidance**\n\nWomen's health needs special care at every stage:\n\n- **PCOS/PCOD:** Diet (low carb, high fiber), spearmint tea, exercise\n- **Period pain:** Heat therapy, ginger tea, magnesium\n- **Hormonal balance:** Flaxseeds, Shatavari, reduce sugar & dairy\n- **Thyroid:** Selenium, zinc, iodine-rich foods, stress management\n- **Bone health:** Calcium + Vitamin D + weight-bearing exercise\n\n💡 Want me to dive deeper into any specific women's health topic?`,

    // Men's Health
    mens: `👨 **Men's Health & Wellness**\n\nKey areas to focus on:\n\n- **Testosterone:** Sleep, zinc, healthy fats, strength training\n- **Heart health:** Cardio, low sodium, no smoking\n- **Prostate:** Lycopene (tomatoes), pumpkin seeds, green tea\n- **Stamina:** Ashwagandha, Shilajit, proper rest\n- **Mental health:** Men often suppress feelings — it's okay to talk!\n\n💪 Tell me which area you'd like to focus on!`,

    // Child Health
    child: `👶 **Child & Youth Health**\n\nHealthy children, healthy future:\n\n- **Immunity:** Vitamin C, Zinc, Tulsi, sleep, outdoor play\n- **Nutrition:** Balanced diet with all food groups; limit junk\n- **Growth:** Protein, milk, eggs, sunlight for Vitamin D\n- **Obesity:** Reduce screen time, increase outdoor activity, healthy snacks\n\n💡 Ask me about specific child health concerns!`,

    // Elderly Health
    elderly: `🧓 **Senior & Elderly Health**\n\nSpecial care for golden years:\n\n- **Joint health:** Omega-3, turmeric, warm water therapy, gentle yoga\n- **Memory:** Brahmi, Ashwagandha, puzzles, social interaction\n- **Bone density:** Calcium, Vitamin D, walking, balance exercises\n- **Diabetes:** Low glycemic diet, regular monitoring, stress control\n- **Fall prevention:** Balance exercises, proper lighting, remove trip hazards\n\n🌟 How can I help you or a loved one today?`,

    // ── Chip-specific responses ──
    heart_high_bp: `🫀 **Managing High Blood Pressure Naturally**

- Reduce salt to <5g/day
- DASH diet: fruits, veggies, whole grains, low-fat dairy
- Garlic (1–2 raw cloves daily) lowers BP significantly
- Hibiscus tea — shown to reduce systolic BP
- Magnesium-rich foods: spinach, almonds, banana

**Lifestyle:** 30-min daily walk, 4-7-8 breathing, reduce caffeine & alcohol

💡 Consistently above 140/90 → consult your doctor.`,

    heart_cholesterol: `🧈 **Lowering Cholesterol Naturally**

- **Soluble fiber:** oats, beans, lentils, apples
- **Healthy fats:** olive oil, avocado, walnuts, flaxseeds
- **Avoid:** trans fats, fried food, processed meats
- **Garlic + Turmeric** — both reduce LDL naturally
- **Green tea** — Catechins lower total cholesterol

**Exercise:** 150 min/week of moderate cardio is highly effective

💡 Get a lipid profile test every 6 months if at risk.`,

    heart_stroke_aware: `🧠 **Stroke — Know the FAST Signs**

**F** — **Face drooping** (one side numb or drooping)
**A** — **Arm weakness** (one arm drifts down)
**S** — **Speech slurred** (confused, can't speak clearly)
**T** — **Time to call 112** (act immediately!)

**Prevention:** Control BP & cholesterol, no smoking, daily walking, manage stress

⚠️ Every minute counts — don't wait with stroke symptoms.`,

    life_meditation: `🧘 **Meditation Guide for Beginners**

**5-Minute Starter:**
1. Sit comfortably, close your eyes
2. Inhale 4 counts, exhale 6 counts — repeat
3. When mind wanders, gently return to breath
4. End with 3 things you're grateful for

**Types:** Body Scan (stress/sleep), Loving Kindness (anxiety), Breath Awareness (beginners)

**Free Apps:** Insight Timer, Headspace, Calm

🌟 10 min daily rewires the brain in 8 weeks!`,

    life_sleep: `😴 **Sleep Hygiene — Deep Sleep Naturally**

**Golden Rules:**
- Same bedtime every night (even weekends)
- No screens 60 min before bed (blue light kills melatonin)
- Cool room 18–20°C; dark & quiet
- No caffeine after 2pm

**Natural Aids:** Ashwagandha (300mg), Chamomile tea, warm milk + nutmeg, Magnesium glycinate

**Routine:** Dim lights → Gentle stretches → Journaling → Sleep`,

    life_yoga: `🧘 **Yoga Routine for Beginners (15 min)**

1. Sukhasana — 2 min breathing
2. Cat-Cow Stretch — 10 reps
3. Downward Dog — hold 30 sec
4. Warrior I & II — 30 sec each side
5. Child's Pose (Balasana) — 2 min rest

**Best For:** Stress → Savasana | Back pain → Cat-Cow | PCOS → Bhadrasana | Digestion → Pawanmuktasana

🌟 15 min daily beats 1 hour weekly!`,

    life_morning: `☀️ **Power Morning Routine**

1. 🚰 Warm water + lemon (detox + metabolism)
2. ☀️ 10 min sunlight (Vitamin D + serotonin)
3. 🧘 5 min breathing/meditation
4. 🏃 15–20 min movement (walk, yoga, stretch)
5. 🥗 Protein-rich breakfast (eggs, oats, paneer)

**Avoid first 60 min:** Phone, news, social media

💡 Even 3 of these daily creates powerful health changes.`,

    diet_meal_plan: `🥗 **Balanced Meal Plan Template**

**Breakfast:** Oats + nuts + fruit OR eggs + whole grain toast
**Mid-Morning:** Handful of mixed nuts OR a fruit
**Lunch:** Dal + 2 rotis + big salad + curd
**Evening:** Green tea + roasted chickpeas
**Dinner:** Grilled protein + steamed vegetables + small grain

**Rules:** Eat every 3–4 hours | Half plate = vegetables | 2–3L water | Limit sugar & fried foods`,

    diet_vitamin: `💊 **Vitamin Deficiency Quick Guide**

- **Vitamin D** → Fatigue, bone pain | Source: Sunlight, fortified milk, mushrooms
- **B12** → Tingling, memory fog | Source: Eggs, dairy, meat
- **Iron** → Fatigue, pale skin, hair fall | Source: Spinach, lentils, jaggery
- **Vitamin C** → Slow healing, frequent colds | Source: Amla, citrus, bell peppers
- **Calcium** → Weak bones, cramps | Source: Dairy, tofu, ragi, sesame

💡 Get blood tests to confirm before supplementing.`,

    diet_weight_loss: `⚖️ **Sustainable Weight Loss Tips**

- 500 cal deficit/day = ~0.5 kg/week (safe & maintainable)
- Protein at every meal (keeps you full, preserves muscle)
- Eat whole foods, minimize ultra-processed
- Walk 8,000–10,000 steps/day

**Natural Fat-Burners:** Green tea, Apple Cider Vinegar, Cinnamon, Ginger water

**Intermittent Fasting 16:8** — eat 12pm–8pm only; works well for many

⚠️ Crash diets backfire. Aim 0.5–1 kg/week loss maximum.`,

    herb_turmeric: `🌿 **Turmeric (Haldi) — Complete Guide**

**Active:** Curcumin (anti-inflammatory & antioxidant)

**Benefits:** Reduces chronic inflammation, supports joints, boosts brain, liver detox, immune booster

**How to Use:**
- Golden Milk: 1 tsp turmeric + warm milk + black pepper + honey
- Add to curries, rice, smoothies
- Supplement: 500mg curcumin with piperine (black pepper increases absorption 2000%!)

⚠️ Avoid high doses if on blood thinners.`,

    herb_ashwagandha: `🌿 **Ashwagandha — Complete Guide**

**Type:** Adaptogen (helps body handle stress)

**Benefits:** Reduces cortisol 30%, improves sleep, boosts testosterone, enhances endurance, supports thyroid

**How to Use:** 300–500mg root extract daily | Warm milk + ashwagandha + honey before bed | KSM-66 extract = most researched

**Best for:** Stress, insomnia, low energy, hormonal issues

⚠️ Avoid in pregnancy. May interact with thyroid medications.`,

    herb_herbal_tea: `🍵 **Best Herbal Teas & Their Benefits**

- **Chamomile** → Sleep, anxiety, digestion
- **Ginger** → Nausea, cold, anti-inflammatory
- **Tulsi** → Immunity, respiratory, stress
- **Peppermint** → Headaches, digestion, energy
- **Hibiscus** → Blood pressure, Vitamin C
- **Green tea** → Metabolism, antioxidants, focus
- **Cinnamon** → Blood sugar, PCOS
- **Spearmint** → Hormonal balance (PCOS)

💡 Steep 5–10 min, avoid sugar. 2 cups daily is ideal.`,

    herb_sleep_aid: `🌙 **Natural Sleep Remedies**

**Top Herbs:**
- Ashwagandha — lowers cortisol, deepens sleep
- Chamomile tea — mild sedative, calms nerves
- Valerian root — reduces time to fall asleep
- Nutmeg — warm milk + pinch of nutmeg = sleep aid

**Foods:** Banana, almonds, tart cherries (natural melatonin), kiwi

**Habits:** Dark cool room, no screens 1hr before bed, consistent wake time

💡 Magnesium glycinate (200mg) 1hr before bed is highly effective.`,

    skin_acne: `✨ **Acne — Natural Treatment Plan**

**Natural Remedies:**
- Neem paste — antibacterial, reduces inflammation
- Tea Tree oil (diluted 1:9) — kills acne bacteria
- Aloe Vera gel — soothes and heals
- Turmeric + Honey mask — 2x/week

**Diet Changes (crucial!):**
- ↓ Dairy, sugar, processed carbs
- ↑ Zinc (pumpkin seeds), Omega-3, Vitamin C

💡 Wash face max 2x/day. Over-washing triggers more oil.`,

    hair_fall: `💆 **Hair Fall — Natural Solutions**

**Natural Treatments:**
- Scalp massage with warm castor + coconut oil (3x/week)
- Onion juice applied to scalp — clinically proven for regrowth
- Bhringraj oil — Ayurvedic gold standard
- Amla — strengthens hair follicles

**Internal:** Check Iron, Ferritin, B12, Vitamin D, Thyroid (TSH)
**Protein:** minimum 50–60g/day; Biotin-rich: eggs, nuts, sweet potato

💡 Shedding 50–100 hairs/day is normal. More warrants investigation.`,

    skin_face_mask: `🌸 **Natural Face Mask Recipes**

**Acne/Oily:** Multani mitti + rose water + neem powder → 15 min
**Dry/Dull:** Banana + honey + yogurt → 20 min
**Brightening/Glow:** Turmeric (pinch) + besan + milk → 15 min (classic ubtan!)
**Anti-Aging:** Avocado + honey + vitamin E oil → 20 min
**Sensitive:** Aloe Vera + cucumber juice → 15 min

💡 Patch test first. Use 2x/week. Follow with moisturizer.`,

    womens_pcos: `🌸 **PCOS — Natural Management Plan**

**Diet:** Low GI foods, anti-inflammatory, cut sugar & dairy, add flaxseeds + spearmint tea + cinnamon

**Lifestyle:** 30 min exercise 5x/week (reduces insulin resistance), stress control, 7–8 hrs sleep

**Supplements (discuss with doctor):** Inositol, Vitamin D, Magnesium, Zinc, NAC

**Yoga:** Bhadrasana, Supta Baddha Konasana, Malasana

💙 Progress takes 3–6 months — stay consistent!`,

    womens_period_pain: `🌸 **Period Pain Relief**

**Immediate:** Heating pad on lower abdomen | Ginger tea (as effective as ibuprofen) | Child's Pose yoga | Warm Epsom salt bath

**Preventive (start 3–5 days before):** Magnesium-rich foods | Omega-3 (reduces prostaglandins) | Cut caffeine & salt

**Ayurvedic:** Shatavari + Ashoka bark powder with warm water

💡 Severe pain disrupting daily life → evaluate for endometriosis.`,

    womens_hormonal: `⚖️ **Hormonal Balance — Natural Approach**

**Balancing Foods:**
- Flaxseeds — phytoestrogens, best for estrogen balance
- Shatavari — Ayurvedic female tonic
- Spearmint tea — reduces excess androgens
- Cruciferous veggies — support estrogen metabolism
- Healthy fats — avocado, nuts, olive oil (hormones are made from fat!)

**Avoid:** Plastics (BPA), excess alcohol, too much soy, chronic stress, poor sleep

💡 Takes 3–6 months of consistent lifestyle change to improve.`,

    mens_testosterone: `💪 **Naturally Boost Testosterone**

**Top Foods:** Zinc (pumpkin seeds, chickpeas) | Vitamin D (eggs, fatty fish, sunlight) | Healthy fats (avocado, nuts) | Pomegranate juice (24% boost in studies)

**Lifestyle Boosters:** Heavy compound lifts | Sleep 7–9 hours | Reduce stress | Limit alcohol

**Herbs:** Ashwagandha, Shilajit, Fenugreek (methi seeds)

💡 Natural levels peak at ~7am — morning workouts maximize this.`,

    mens_prostate: `🏥 **Prostate Health Guide**

**Protective Foods:** Lycopene (cooked tomatoes + olive oil) | Pumpkin seeds (zinc) | Green tea (EGCG) | Broccoli (sulforaphane) | Omega-3

**Avoid:** Excess red meat, full-fat dairy, processed foods, smoking

**Warning Signs:** Frequent/difficult urination, weak stream, blood in urine

💡 PSA screening recommended from age 50 (earlier with family history).`,

    mens_stamina: `⚡ **Increase Stamina Naturally**

**Herbs:** Ashwagandha (increases VO2 max) | Shilajit (mitochondrial energy) | Safed Musli | Ginseng

**Foods:** Beetroot juice (nitrates boost blood flow) | Bananas | Oats | Chia seeds

**Training:** Progressive overload + adequate recovery + quality sleep

💡 Dehydration kills stamina — drink 500ml water 30 min before exercise.`,

    child_nutrition: `👶 **Child Nutrition Guide**

**Key Nutrients:** Calcium (3 dairy servings/day) | Iron (lentils, meat, spinach) | Protein (eggs, legumes) | Omega-3 (fatty fish 2x/week)

**Meals:** Eggs + whole grain toast + fruit | Dal + rice + sabzi + curd | Fruit + nuts | Roti + protein + salad

**Limit:** Added sugar, ultra-processed snacks, sugary drinks

💡 Model healthy eating — children eat what parents eat!`,

    child_immunity: `🛡️ **Boost Child's Immunity Naturally**

**Foods:** Citrus fruits + Amla (Vitamin C) | Garlic (add to food) | Tulsi drops (5–10 drops/day) | Turmeric golden milk | Yogurt (gut health = immune health)

**Lifestyle:** 9–11 hours sleep | 1+ hour outdoor play (Vit D) | Minimize antibiotics

**Ayurvedic:** Chyawanprash (1 tsp daily) — time-tested immunity booster

💡 60–70% of immunity lives in the gut — feed it well!`,

    elder_joint: `🦴 **Elderly Joint Pain — Natural Relief**

**Anti-Inflammatory:** Turmeric + black pepper daily | Ginger tea 2x/day | Omega-3 (fish oil) | Warm sesame oil massage

**Gentle Exercise:** Water aerobics | Chair yoga | Short flat walks 10–20 min 2–3x/day | Morning & evening stretching

**Avoid:** Cold foods, inactivity, excess weight, high-impact exercise

💙 Pain-free movement is possible with consistent care!`,

    elder_memory: `🧠 **Memory & Brain Health for Seniors**

**Brain-Boosting Foods:** Blueberries | Walnuts | Fatty fish (DHA) | Leafy greens (folate) | Turmeric (may clear amyloid plaques)

**Herbs:** Brahmi (Bacopa) — sharpens memory | Ashwagandha — neuroprotective | Lion's Mane mushroom — promotes nerve growth

**Mental Exercise:** Daily puzzles, reading, social interaction, learning new skills

💡 Sleep is when the brain clears waste — prioritize 7–8 hours.`,

    general_doctor: `🏥 **When Should You See a Doctor?**

**Soon if:** Fever >39°C for 2+ days | Unexplained weight loss | Blood in urine/stool | Chest pain or breathlessness | Symptoms not improving after 5–7 days | New/changing lump

**Emergency (call 112):** Stroke symptoms (FAST) | Crushing chest pain | Loss of consciousness | Severe allergic reaction

💡 This chatbot guides natural wellness. For diagnosis & treatment, always rely on a qualified healthcare professional.`,

    mental_stress: `🧘 **Stress Relief — Natural & Proven**

**Use Right Now:** 4-7-8 breathing (Inhale 4, Hold 7, Exhale 8) | Splash cold water on face | 5-senses grounding

**Daily Practices:** Morning sunlight + 20-min walk | Journaling | Digital detox 1hr before bed | Call a friend

**Herbs:** Ashwagandha, Rhodiola, Chamomile tea, Lemon balm

💙 Chronic stress damages health. You deserve relief — what's stressing you most?`,

    mental_anxiety: `💙 **Anxiety Relief — Natural Techniques**

**In the Moment:** Box breathing (Inhale 4 → Hold 4 → Exhale 4 → Hold 4, repeat 4x) | Progressive muscle relaxation | Cold water on wrists

**Natural Remedies:** Ashwagandha (300mg 2x/day) | Chamomile tea | Magnesium glycinate | Lavender oil (diffuse or inhale)

**Lifestyle:** Regular exercise = as effective as antidepressants for mild-moderate anxiety

💙 If anxiety stops you living fully, please speak to a therapist.`,

    // General
    general: `💚 **Welcome to NatureWellness Guide**\n\nI'm here to help you with:\n\n🩺 **Symptoms** — headaches, fatigue, cold, stomach pain...\n🌿 **Natural Remedies** — herbs, Ayurveda, home remedies\n🥗 **Diet & Nutrition** — weight, vitamins, meal planning\n🧠 **Mental Health** — stress, anxiety, sleep, motivation\n👩 **Women's Health** — PCOS, periods, pregnancy...\n👨 **Men's Health** — testosterone, stamina, prostate...\n🧘 **Lifestyle** — yoga, exercise, sleep hygiene...\n\nJust describe how you're feeling or what you'd like to know!`
};

// ── 3. SUGGESTION MAP (chip text → intent key) ──────────────
export const SUGGESTION_MAP = {
    // Emergency
    'Call 112 now': 'emergency',
    'Find nearest hospital': 'emergency',
    'Stroke signs explained': 'heart_stroke_aware',
    // Symptom
    'Natural remedies': 'remedy',
    'Diet tips for recovery': 'diet',
    'When to see a doctor': 'general_doctor',
    // Heart
    'Heart-healthy diet': 'heart',
    'BP management': 'heart_high_bp',
    'Cholesterol foods': 'heart_cholesterol',
    // Mental
    'Meditation guide': 'life_meditation',
    'Anxiety remedies': 'mental_anxiety',
    'Sleep tips': 'life_sleep',
    // Diet
    'Meal plan ideas': 'diet_meal_plan',
    'Vitamin check': 'diet_vitamin',
    'Weight management': 'diet_weight_loss',
    'Weight loss tips': 'diet_weight_loss',
    // Remedy
    'Turmeric benefits': 'herb_turmeric',
    'Ashwagandha uses': 'herb_ashwagandha',
    'Herbal teas': 'herb_herbal_tea',
    // Skin & Hair
    'Acne remedies': 'skin_acne',
    'Hair fall tips': 'hair_fall',
    'Natural face mask': 'skin_face_mask',
    // Lifestyle
    'Yoga routine': 'life_yoga',
    'Morning habits': 'life_morning',
    'Sleep hygiene': 'life_sleep',
    // Women
    'PCOS diet': 'womens_pcos',
    'Period pain relief': 'womens_period_pain',
    'Hormonal balance herbs': 'womens_hormonal',
    // Men
    'Testosterone foods': 'mens_testosterone',
    'Prostate care': 'mens_prostate',
    'Men stamina tips': 'mens_stamina',
    // Child
    'Child diet tips': 'child_nutrition',
    'Immunity boosters': 'child_immunity',
    'Child sleep help': 'life_sleep',
    // Elderly
    'Joint pain relief': 'elder_joint',
    'Memory support': 'elder_memory',
    'Senior exercise': 'lifestyle',
    // Initial chips
    'I have a headache': 'symptom_headache',
    'Natural sleep remedy': 'herb_sleep_aid',
    'Stress & anxiety help': 'mental_stress',
};

// ── 4. DETECT INTENT FUNCTION ────────────────────────────────
/**
 * detectIntent(text: string) → { intentKey, group, response, isEmergency }
 *
 * Scans the input against all 200+ intents ordered by priority.
 * Returns the best match with a ready-to-use response string.
 */
export function detectIntent(text) {
    if (!text || !text.trim()) {
        return { intentKey: 'general', group: 'general', response: RESPONSES.general, isEmergency: false };
    }

    const trimmed = text.trim();

    // ── Step 1: Check SUGGESTION_MAP first (exact chip-text match) ──
    if (SUGGESTION_MAP[trimmed]) {
        const intentKey = SUGGESTION_MAP[trimmed];
        const intent = INTENTS[intentKey];
        const group = intent ? intent.group : intentKey.split('_')[0];
        const isEmergency = group === 'emergency';
        const response = getResponse(intentKey, group);
        return { intentKey, group, response, isEmergency };
    }

    // ── Step 2: Keyword scan (priority-ordered) ──
    const lower = trimmed.toLowerCase();
    const sorted = Object.entries(INTENTS).sort((a, b) => a[1].priority - b[1].priority);

    for (const [key, intent] of sorted) {
        if (intent.keywords.length === 0) continue;
        if (intent.keywords.some(kw => lower.includes(kw))) {
            const isEmergency = intent.group === 'emergency';
            const response = getResponse(key, intent.group);
            return { intentKey: key, group: intent.group, response, isEmergency };
        }
    }

    return { intentKey: 'general', group: 'general', response: RESPONSES.general, isEmergency: false };
}

// ── 5. RESPONSE RESOLVER ──────────────────────────────────────
function getResponse(intentKey, group) {
    // 1. Exact key match
    if (RESPONSES[intentKey]) return RESPONSES[intentKey];

    // 2. Symptom sub-key (e.g. symptom_headache → symptom_headache or symptom)
    if (group === 'emergency') return RESPONSES.emergency;
    if (group === 'symptom') {
        return RESPONSES[intentKey] || buildSymptomResponse(intentKey);
    }
    if (group === 'heart') return RESPONSES.heart;
    if (group === 'mental') return RESPONSES.mental;
    if (group === 'diet') return RESPONSES.diet;
    if (group === 'remedy') return buildRemedyResponse(intentKey);
    if (group === 'skin') return RESPONSES.skin;
    if (group === 'lifestyle') return RESPONSES.lifestyle;
    if (group === 'womens') return RESPONSES.womens;
    if (group === 'mens') return RESPONSES.mens;
    if (group === 'child') return RESPONSES.child;
    if (group === 'elderly') return RESPONSES.elderly;

    return RESPONSES.general;
}

function buildSymptomResponse(key) {
    const label = key.replace('symptom_', '').replace(/_/g, ' ');
    return `I see you're experiencing **${label}**. Here are some natural approaches:\n\n- Rest adequately and stay hydrated\n- Ginger or Tulsi tea can help with many common symptoms\n- Avoid processed foods and eat light, warm meals\n\n💡 For a more targeted suggestion, could you describe your symptoms in more detail? And if symptoms are severe or persist for more than 2-3 days, please consult a healthcare professional.`;
}

function buildRemedyResponse(key) {
    const herb = key.replace('herb_', '').replace(/_/g, ' ');
    return `🌿 **${herb.replace(/\b\w/g, c => c.toUpperCase())}**\n\nThis is a well-known natural remedy used in traditional medicine.\n\n- Often used in Ayurveda and herbal practices\n- Generally safe in moderate dietary amounts\n- Best combined with a balanced lifestyle\n\n💡 Would you like specific benefits, dosage, or precautions for this remedy?`;
}

// ── 6. QUICK-REPLY SUGGESTIONS ───────────────────────────────
/**
 * getSuggestions(group) → string[]
 * Returns contextual quick-reply chips after a response.
 */
export function getSuggestions(group) {
    const map = {
        emergency: ['Call 112 now', 'Find nearest hospital', 'Stroke signs explained'],
        symptom: ['Natural remedies', 'Diet tips for recovery', 'When to see a doctor'],
        heart: ['Heart-healthy diet', 'BP management', 'Cholesterol foods'],
        mental: ['Meditation guide', 'Anxiety remedies', 'Sleep tips'],
        diet: ['Meal plan ideas', 'Vitamin check', 'Weight management'],
        remedy: ['Turmeric benefits', 'Ashwagandha uses', 'Herbal teas'],
        skin: ['Acne remedies', 'Hair fall tips', 'Natural face mask'],
        lifestyle: ['Yoga routine', 'Morning habits', 'Sleep hygiene'],
        womens: ['PCOS diet', 'Period pain relief', 'Hormonal balance herbs'],
        mens: ['Testosterone foods', 'Prostate care', 'Men stamina tips'],
        child: ['Child diet tips', 'Immunity boosters', 'Child sleep help'],
        elderly: ['Joint pain relief', 'Memory support', 'Senior exercise'],
        general: ['I have a headache', 'Natural sleep remedy', 'Weight loss tips']
    };
    return map[group] || map.general;
}
