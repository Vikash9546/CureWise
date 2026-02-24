export const remedyData = {
    diseases: [
        {
            id: 'diabetes',
            name: 'Diabetes',
            description: 'A chronic condition that affects how your body turns food into energy.',
            remedies: ['Bitter Melon', 'Cinnamon', 'Fenugreek Seeds'],
            lifestyle: ['Regular walking', 'Stress management'],
            diet: ['Low glycemic index foods', 'High fiber intake'],
            yoga: ['Surya Namaskar', 'Paschimottanasana']
        },
        {
            id: 'stress',
            name: 'Stress & Anxiety',
            description: 'Feeling overwhelmed, worried, or run down.',
            remedies: ['Ashwagandha', 'Chamomile Tea', 'Lavender Oil'],
            lifestyle: ['Deep breathing', 'Forest bathing (Shinrin-yoku)'],
            diet: ['Magnesium-rich foods', 'Dark chocolate (in moderation)'],
            yoga: ['Balasana (Child\'s Pose)', 'Savasana']
        },
        {
            id: 'skin',
            name: 'Skin Issues (Acne/Eczema)',
            description: 'Common skin conditions involving inflammation and irritation.',
            remedies: ['Aloe Vera', 'Neem', 'Turmeric Paste'],
            lifestyle: ['Adequate hydration', 'Clean Pillowcases'],
            diet: ['Zinc-rich foods', 'Anti-inflammatory diet'],
            yoga: ['Sarvangasana', 'Pranayama']
        },
        {
            id: 'pcos',
            name: 'PCOS & Hormonal Balance',
            description: 'Hormonal disorder common among women of reproductive age.',
            remedies: ['Spearmint Tea', 'Cinnamon', 'Flax seeds'],
            lifestyle: ['Regular ovulation tracking', 'Weight management'],
            diet: ['High protein, low carb', 'Dairy-free options'],
            yoga: ['Bhadrasana', 'Pranayama']
        },
        {
            id: 'hypertension',
            name: 'High Blood Pressure',
            description: 'A condition in which the force of the blood against the artery walls is too high.',
            remedies: ['Garlic', 'Hibiscus Tea', 'Basil'],
            lifestyle: ['Reduced salt intake', 'Moderate cardio'],
            diet: ['DASH diet', 'Potassium-rich foods'],
            yoga: ['Savasana', 'Sukhasana']
        },
        {
            id: 'arthritis',
            name: 'Arthritis & Joint Pain',
            description: 'Inflammation of one or more joints, causing pain and stiffness.',
            remedies: ['Ginger', 'Turmeric', 'Eucalyptus Oil'],
            lifestyle: ['Warm water therapy', 'Low-impact movement'],
            diet: ['Omega-3 rich foods', 'Anti-inflammatory spices'],
            yoga: ['Tadasana', 'Gentle joint rotations']
        }
    ],
    remedies: [
        {
            name: 'Ashwagandha',
            category: 'Herbal',
            benefits: 'Reduces cortisol levels and helps the body manage stress.',
            howToUse: '500mg - 1g daily, ideally with warm milk or water before bed.',
            precautions: 'Avoid if pregnant or have autoimmune conditions without consultation.'
        },
        {
            name: 'Aloe Vera',
            category: 'Naturopathy',
            benefits: 'Soothes skin inflammation and aids digestion.',
            howToUse: 'Fresh gel applied topically or 30ml juice on empty stomach.',
            precautions: 'Ensure gel is latex-free for consumption.'
        },
        {
            name: 'Neem',
            category: 'Ayurveda',
            benefits: 'Powerful blood purifier and anti-bacterial agent.',
            howToUse: '2-3 leaves chewed fresh or as a paste for skin issues.',
            precautions: 'Do not use excessively; can affect blood sugar levels.'
        },
        {
            name: 'Spearmint Tea',
            category: 'Herbal',
            benefits: 'Helpful in reducing excess androgen levels in women (Hirsutism).',
            howToUse: '1 cup, twice a day consistently for 3 months.',
            precautions: 'Consult if on other hormonal medications.'
        }
    ],
    symptoms: [
        { name: 'Fatigue', possibleConditions: ['Diabetes', 'Stress', 'High Blood Pressure'] },
        { name: 'Frequent Urination', possibleConditions: ['Diabetes'] },
        { name: 'Skin Redness', possibleConditions: ['Skin Issues'] },
        { name: 'Restlessness', possibleConditions: ['Stress'] },
        { name: 'Irregular Periods', possibleConditions: ['PCOS & Hormonal Balance'] },
        { name: 'Joint Stiffness', possibleConditions: ['Arthritis & Joint Pain'] },
        { name: 'Headache', possibleConditions: ['Stress', 'High Blood Pressure'] }
    ],
    blogs: [
        {
            id: 1,
            title: 'Nature vs Modern Medicine',
            excerpt: 'Finding the balance between synthetic solutions and ancient natural wisdom.',
            author: 'Dr. Aranya Seth',
            date: 'Oct 24, 2023',
            image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800'
        },
        {
            id: 2,
            title: 'Top 10 Immunity Boosting Herbs',
            excerpt: 'Explore the most powerful herbs found in your kitchen that can supercharge your immune system.',
            author: 'Sarah Green',
            date: 'Oct 20, 2023',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'
        }
    ]
};
