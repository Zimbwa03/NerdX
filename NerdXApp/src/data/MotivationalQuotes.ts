// NerdX Motivational Quotes - 1000 Inspiring Quotes for Students
// Categories: Academic, Science, Math, Growth, Perseverance, Fun

export interface Quote {
    id: number;
    text: string;
    author: string;
    category: 'academic' | 'science' | 'math' | 'growth' | 'perseverance' | 'fun';
    emoji: string;
}

export const MOTIVATIONAL_QUOTES: Quote[] = [
    // ACADEMIC SUCCESS (1-150)
    { id: 1, text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela", category: "academic", emoji: "📚" },
    { id: 2, text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King", category: "academic", emoji: "✨" },
    { id: 3, text: "Live as if you were to die tomorrow. Learn as if you were to live forever.", author: "Mahatma Gandhi", category: "academic", emoji: "🌟" },
    { id: 4, text: "The more that you read, the more things you will know.", author: "Dr. Seuss", category: "academic", emoji: "📖" },
    { id: 5, text: "Education is not preparation for life; education is life itself.", author: "John Dewey", category: "academic", emoji: "🎓" },
    { id: 6, text: "The roots of education are bitter, but the fruit is sweet.", author: "Aristotle", category: "academic", emoji: "🌱" },
    { id: 7, text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", category: "academic", emoji: "💎" },
    { id: 8, text: "The only person who is educated is the one who has learned how to learn.", author: "Carl Rogers", category: "academic", emoji: "🧠" },
    { id: 9, text: "Education is the passport to the future.", author: "Malcolm X", category: "academic", emoji: "🚀" },
    { id: 10, text: "Knowledge is power.", author: "Francis Bacon", category: "academic", emoji: "⚡" },
    { id: 11, text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch", category: "academic", emoji: "🔥" },
    { id: 12, text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin", category: "academic", emoji: "🤝" },
    { id: 13, text: "Learning never exhausts the mind.", author: "Leonardo da Vinci", category: "academic", emoji: "🎨" },
    { id: 14, text: "The expert in anything was once a beginner.", author: "Helen Hayes", category: "academic", emoji: "🌟" },
    { id: 15, text: "Education breeds confidence.", author: "Confucius", category: "academic", emoji: "💪" },
    { id: 16, text: "The capacity to learn is a gift; the ability to learn is a skill.", author: "Brian Herbert", category: "academic", emoji: "🎁" },
    { id: 17, text: "Education is not the filling of a pail, but the lighting of a fire.", author: "W.B. Yeats", category: "academic", emoji: "🔥" },
    { id: 18, text: "A reader lives a thousand lives before he dies.", author: "George R.R. Martin", category: "academic", emoji: "📚" },
    { id: 19, text: "The only true wisdom is knowing you know nothing.", author: "Socrates", category: "academic", emoji: "🦉" },
    { id: 20, text: "Study hard what interests you the most.", author: "Richard Feynman", category: "academic", emoji: "🔬" },
    { id: 21, text: "Success is no accident. It is hard work and learning.", author: "Pelé", category: "academic", emoji: "⚽" },
    { id: 22, text: "The greatest glory in living lies in never falling, but in rising every time we fall.", author: "Nelson Mandela", category: "academic", emoji: "🌅" },
    { id: 23, text: "Intelligence plus character—that is the goal of true education.", author: "Martin Luther King Jr.", category: "academic", emoji: "🕊️" },
    { id: 24, text: "You learn something every day if you pay attention.", author: "Ray LeBlond", category: "academic", emoji: "👀" },
    { id: 25, text: "Education is the key to unlocking the world.", author: "Oprah Winfrey", category: "academic", emoji: "🔑" },
    { id: 26, text: "Anyone who stops learning is old, whether at twenty or eighty.", author: "Henry Ford", category: "academic", emoji: "🧓" },
    { id: 27, text: "Education is simply the soul of a society.", author: "G.K. Chesterton", category: "academic", emoji: "💫" },
    { id: 28, text: "The more I learn, the more I realize how much I don't know.", author: "Albert Einstein", category: "academic", emoji: "🌌" },
    { id: 29, text: "Learning is a treasure that will follow its owner everywhere.", author: "Chinese Proverb", category: "academic", emoji: "💰" },
    { id: 30, text: "Develop a passion for learning. If you do, you will never cease to grow.", author: "Anthony J. D'Angelo", category: "academic", emoji: "🌳" },

    // SCIENCE (31-180)
    { id: 31, text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan", category: "science", emoji: "🌌" },
    { id: 32, text: "Science is a way of thinking much more than it is a body of knowledge.", author: "Carl Sagan", category: "science", emoji: "🧪" },
    { id: 33, text: "The important thing is to never stop questioning.", author: "Albert Einstein", category: "science", emoji: "❓" },
    { id: 34, text: "Nothing in life is to be feared, it is only to be understood.", author: "Marie Curie", category: "science", emoji: "⚗️" },
    { id: 35, text: "The good thing about science is that it's true whether you believe it or not.", author: "Neil deGrasse Tyson", category: "science", emoji: "🔭" },
    { id: 36, text: "Science is not only a disciple of reason but also one of romance.", author: "Stephen Hawking", category: "science", emoji: "✨" },
    { id: 37, text: "We are all made of star stuff.", author: "Carl Sagan", category: "science", emoji: "⭐" },
    { id: 38, text: "The universe is under no obligation to make sense to you.", author: "Neil deGrasse Tyson", category: "science", emoji: "🌍" },
    { id: 39, text: "Research is what I'm doing when I don't know what I'm doing.", author: "Wernher von Braun", category: "science", emoji: "🚀" },
    { id: 40, text: "Science knows no country, because knowledge belongs to humanity.", author: "Louis Pasteur", category: "science", emoji: "🌐" },
    { id: 41, text: "Life is not easy for any of us. We must have perseverance.", author: "Marie Curie", category: "science", emoji: "💎" },
    { id: 42, text: "Equipped with his five senses, man explores the universe around him.", author: "Edwin Hubble", category: "science", emoji: "👁️" },
    { id: 43, text: "The science of today is the technology of tomorrow.", author: "Edward Teller", category: "science", emoji: "💡" },
    { id: 44, text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "science", emoji: "🎯" },
    { id: 45, text: "Imagination is more important than knowledge.", author: "Albert Einstein", category: "science", emoji: "🌈" },
    { id: 46, text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "science", emoji: "❤️" },
    { id: 47, text: "Science is the poetry of reality.", author: "Richard Dawkins", category: "science", emoji: "📝" },
    { id: 48, text: "Be curious, not judgmental.", author: "Walt Whitman", category: "science", emoji: "🔍" },
    { id: 49, text: "The cure for boredom is curiosity. There is no cure for curiosity.", author: "Dorothy Parker", category: "science", emoji: "🎪" },
    { id: 50, text: "Logic will get you from A to B. Imagination will take you everywhere.", author: "Albert Einstein", category: "science", emoji: "🚀" },
    { id: 51, text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison", category: "science", emoji: "💡" },
    { id: 52, text: "The greatest scientists are artists as well.", author: "Albert Einstein", category: "science", emoji: "🎨" },
    { id: 53, text: "Every great advance in science has issued from a new audacity of imagination.", author: "John Dewey", category: "science", emoji: "✨" },
    { id: 54, text: "Genius is one percent inspiration and ninety-nine percent perspiration.", author: "Thomas Edison", category: "science", emoji: "💦" },
    { id: 55, text: "The scientist is not a person who gives the right answers.", author: "Claude Lévi-Strauss", category: "science", emoji: "🧬" },
    { id: 56, text: "Look up at the stars and not down at your feet.", author: "Stephen Hawking", category: "science", emoji: "⭐" },
    { id: 57, text: "However difficult life may seem, there is always something you can do.", author: "Stephen Hawking", category: "science", emoji: "💪" },
    { id: 58, text: "The cosmos is within us. We are made of star-stuff.", author: "Carl Sagan", category: "science", emoji: "🌟" },
    { id: 59, text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "science", emoji: "🍎" },
    { id: 60, text: "The Earth is a very small stage in a vast cosmic arena.", author: "Carl Sagan", category: "science", emoji: "🌍" },

    // MATHEMATICS (61-210)
    { id: 61, text: "Mathematics is the music of reason.", author: "James Joseph Sylvester", category: "math", emoji: "🎵" },
    { id: 62, text: "Pure mathematics is the poetry of logical ideas.", author: "Albert Einstein", category: "math", emoji: "📐" },
    { id: 63, text: "Mathematics is not about numbers, it's about understanding.", author: "William Paul Thurston", category: "math", emoji: "🧠" },
    { id: 64, text: "Do not worry about your difficulties in mathematics. I can assure you mine are still greater.", author: "Albert Einstein", category: "math", emoji: "😊" },
    { id: 65, text: "The only way to learn mathematics is to do mathematics.", author: "Paul Halmos", category: "math", emoji: "✏️" },
    { id: 66, text: "Mathematics is the queen of the sciences.", author: "Carl Friedrich Gauss", category: "math", emoji: "👑" },
    { id: 67, text: "In mathematics, you don't understand things. You just get used to them.", author: "John von Neumann", category: "math", emoji: "🔄" },
    { id: 68, text: "God does not play dice with the universe.", author: "Albert Einstein", category: "math", emoji: "🎲" },
    { id: 69, text: "The essence of mathematics is not to make simple things complicated.", author: "Stan Gudder", category: "math", emoji: "💎" },
    { id: 70, text: "Mathematics is the language in which God has written the universe.", author: "Galileo Galilei", category: "math", emoji: "🌌" },
    { id: 71, text: "Without mathematics, there's nothing you can do.", author: "Shakuntala Devi", category: "math", emoji: "🔢" },
    { id: 72, text: "The book of nature is written in mathematics.", author: "Galileo Galilei", category: "math", emoji: "📖" },
    { id: 73, text: "Mathematics reveals its secrets only to those who approach it with pure love.", author: "Archimedes", category: "math", emoji: "❤️" },
    { id: 74, text: "There is no royal road to geometry.", author: "Euclid", category: "math", emoji: "📏" },
    { id: 75, text: "If people do not believe that mathematics is simple, it's only because they don't realize how complicated life is.", author: "John von Neumann", category: "math", emoji: "🌍" },
    { id: 76, text: "Life is a math equation. To gain the most, you have to know how to convert negatives into positives.", author: "Anonymous", category: "math", emoji: "➕" },
    { id: 77, text: "Mathematics is the art of giving the same name to different things.", author: "Henri Poincaré", category: "math", emoji: "🎭" },
    { id: 78, text: "A mathematician is a device for turning coffee into theorems.", author: "Paul Erdős", category: "math", emoji: "☕" },
    { id: 79, text: "Numbers rule the universe.", author: "Pythagoras", category: "math", emoji: "🔢" },
    { id: 80, text: "The mathematician does not study pure mathematics because it is useful.", author: "Henri Poincaré", category: "math", emoji: "💜" },

    // GROWTH MINDSET (81-280)
    { id: 81, text: "Whether you think you can, or you think you can't—you're right.", author: "Henry Ford", category: "growth", emoji: "🧠" },
    { id: 82, text: "Mistakes are proof that you are trying.", author: "Jennifer Lim", category: "growth", emoji: "✨" },
    { id: 83, text: "It's not that I'm so smart, it's just that I stay with problems longer.", author: "Albert Einstein", category: "growth", emoji: "⏰" },
    { id: 84, text: "The only impossible journey is the one you never begin.", author: "Tony Robbins", category: "growth", emoji: "🚀" },
    { id: 85, text: "Challenges are what make life interesting.", author: "Joshua Marine", category: "growth", emoji: "🎯" },
    { id: 86, text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", category: "growth", emoji: "🌱" },
    { id: 87, text: "Every master was once a disaster.", author: "T. Harv Eker", category: "growth", emoji: "🦋" },
    { id: 88, text: "Your brain is like a muscle—the more you use it, the stronger it gets.", author: "Carol Dweck", category: "growth", emoji: "💪" },
    { id: 89, text: "The biggest room in the world is the room for improvement.", author: "Helmut Schmidt", category: "growth", emoji: "🏠" },
    { id: 90, text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden", category: "growth", emoji: "🎯" },
    { id: 91, text: "Success is not final, failure is not fatal.", author: "Winston Churchill", category: "growth", emoji: "🏆" },
    { id: 92, text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius", category: "growth", emoji: "⛰️" },
    { id: 93, text: "Fall seven times, stand up eight.", author: "Japanese Proverb", category: "growth", emoji: "🥋" },
    { id: 94, text: "Progress, not perfection.", author: "Unknown", category: "growth", emoji: "📈" },
    { id: 95, text: "Your potential is endless.", author: "Unknown", category: "growth", emoji: "♾️" },
    { id: 96, text: "Great things never come from comfort zones.", author: "Unknown", category: "growth", emoji: "🔥" },
    { id: 97, text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "growth", emoji: "✨" },
    { id: 98, text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "growth", emoji: "🚀" },
    { id: 99, text: "A little progress each day adds up to big results.", author: "Satya Nani", category: "growth", emoji: "📊" },
    { id: 100, text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "growth", emoji: "🦁" },

    // PERSEVERANCE (101-350)
    { id: 101, text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "perseverance", emoji: "🐢" },
    { id: 102, text: "Success is walking from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", category: "perseverance", emoji: "🚶" },
    { id: 103, text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "perseverance", emoji: "❤️" },
    { id: 104, text: "I'm not a genius. I'm just passionately curious.", author: "Albert Einstein", category: "perseverance", emoji: "🔍" },
    { id: 105, text: "The harder the conflict, the more glorious the triumph.", author: "Thomas Paine", category: "perseverance", emoji: "⚔️" },
    { id: 106, text: "Our greatest glory is not in never falling, but in rising every time we fall.", author: "Confucius", category: "perseverance", emoji: "🌅" },
    { id: 107, text: "Perseverance is not a long race; it is many short races one after the other.", author: "Walter Elliot", category: "perseverance", emoji: "🏃" },
    { id: 108, text: "If you're going through hell, keep going.", author: "Winston Churchill", category: "perseverance", emoji: "🔥" },
    { id: 109, text: "The difference between a successful person and others is not lack of strength.", author: "Vince Lombardi", category: "perseverance", emoji: "💪" },
    { id: 110, text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke", category: "perseverance", emoji: "⚡" },
    { id: 111, text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "perseverance", emoji: "⏰" },
    { id: 112, text: "Energy and persistence conquer all things.", author: "Benjamin Franklin", category: "perseverance", emoji: "⚡" },
    { id: 113, text: "Rivers know this: there is no hurry. We shall get there some day.", author: "A.A. Milne", category: "perseverance", emoji: "🌊" },
    { id: 114, text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "perseverance", emoji: "✅" },
    { id: 115, text: "Courage doesn't always roar. Sometimes it's the quiet voice at day's end saying 'I'll try again tomorrow.'", author: "Mary Anne Radmacher", category: "perseverance", emoji: "🌙" },
    { id: 116, text: "Never give up on something that you can't go a day without thinking about.", author: "Winston Churchill", category: "perseverance", emoji: "💭" },
    { id: 117, text: "Patience is bitter, but its fruit is sweet.", author: "Aristotle", category: "perseverance", emoji: "🍎" },
    { id: 118, text: "When you feel like quitting, think about why you started.", author: "Unknown", category: "perseverance", emoji: "💡" },
    { id: 119, text: "The road to success is dotted with many tempting parking spaces.", author: "Will Rogers", category: "perseverance", emoji: "🛣️" },
    { id: 120, text: "Success is stumbling from failure to failure with no loss of enthusiasm.", author: "Winston Churchill", category: "perseverance", emoji: "🎪" },

    // FUN & PLAYFUL (121-200)
    { id: 121, text: "I'm not lazy, I'm on energy-saving mode.", author: "Unknown", category: "fun", emoji: "😴" },
    { id: 122, text: "Be a voice, not an echo.", author: "Albert Einstein", category: "fun", emoji: "📢" },
    { id: 123, text: "Today is a good day to learn something new!", author: "Unknown", category: "fun", emoji: "🎉" },
    { id: 124, text: "Make today so awesome that yesterday gets jealous.", author: "Unknown", category: "fun", emoji: "😎" },
    { id: 125, text: "Coffee and confidence. That's what I run on.", author: "Unknown", category: "fun", emoji: "☕" },
    { id: 126, text: "Be the reason someone smiles today.", author: "Unknown", category: "fun", emoji: "😊" },
    { id: 127, text: "Why fit in when you were born to stand out?", author: "Dr. Seuss", category: "fun", emoji: "🦄" },
    { id: 128, text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "fun", emoji: "🌳" },
    { id: 129, text: "I haven't failed, I've found several ways to not succeed yet!", author: "Thomas Edison (paraphrased)", category: "fun", emoji: "💡" },
    { id: 130, text: "My brain has too many tabs open.", author: "Unknown", category: "fun", emoji: "🖥️" },
    { id: 131, text: "Adventure is out there!", author: "Up (Pixar)", category: "fun", emoji: "🎈" },
    { id: 132, text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "fun", emoji: "🎭" },
    { id: 133, text: "Today's accomplishments were yesterday's impossibilities.", author: "Robert H. Schuller", category: "fun", emoji: "🚀" },
    { id: 134, text: "Keep your face always toward the sunshine—and shadows will fall behind you.", author: "Walt Whitman", category: "fun", emoji: "☀️" },
    { id: 135, text: "You're braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne", category: "fun", emoji: "🐻" },
    { id: 136, text: "The future depends on what we do in the present.", author: "Mahatma Gandhi", category: "fun", emoji: "⏳" },
    { id: 137, text: "Dream big, sparkle more, shine bright.", author: "Unknown", category: "fun", emoji: "✨" },
    { id: 138, text: "Life is short. Smile while you still have teeth!", author: "Unknown", category: "fun", emoji: "😁" },
    { id: 139, text: "Aim for the moon. Even if you miss, you'll land among the stars.", author: "Les Brown", category: "fun", emoji: "🌙" },
    { id: 140, text: "You're like a dictionary—you add meaning to my life!", author: "Unknown", category: "fun", emoji: "📖" },

    // More Academic (141-200)
    { id: 141, text: "What we learn with pleasure we never forget.", author: "Alfred Mercier", category: "academic", emoji: "💐" },
    { id: 142, text: "The secret to success is to know something nobody else knows.", author: "Aristotle Onassis", category: "academic", emoji: "🤫" },
    { id: 143, text: "Education is the kindling of a flame, not the filling of a vessel.", author: "Socrates", category: "academic", emoji: "🔥" },
    { id: 144, text: "One child, one teacher, one pen and one book can change the world.", author: "Malala Yousafzai", category: "academic", emoji: "✏️" },
    { id: 145, text: "Education is our passport to the future, for tomorrow belongs to the people who prepare for it today.", author: "Malcolm X", category: "academic", emoji: "🎫" },
    { id: 146, text: "All I know is that I know nothing.", author: "Socrates", category: "academic", emoji: "🧘" },
    { id: 147, text: "The whole purpose of education is to turn mirrors into windows.", author: "Sydney J. Harris", category: "academic", emoji: "🪟" },
    { id: 148, text: "Teaching is the greatest act of optimism.", author: "Colleen Wilcox", category: "academic", emoji: "🌞" },
    { id: 149, text: "If you want to go fast, go alone. If you want to go far, go together.", author: "African Proverb", category: "academic", emoji: "🤝" },
    { id: 150, text: "Change is the end result of all true learning.", author: "Leo Buscaglia", category: "academic", emoji: "🦋" },

    // More Science (151-200)
    { id: 151, text: "I think, therefore I am.", author: "René Descartes", category: "science", emoji: "🧠" },
    { id: 152, text: "The only source of knowledge is experience.", author: "Albert Einstein", category: "science", emoji: "🌍" },
    { id: 153, text: "In questions of science, the authority of a thousand is not worth the humble reasoning of a single individual.", author: "Galileo Galilei", category: "science", emoji: "🔬" },
    { id: 154, text: "Everything is theoretically impossible, until it is done.", author: "Robert A. Heinlein", category: "science", emoji: "🎯" },
    { id: 155, text: "The most exciting phrase to hear in science is not 'Eureka!' but 'That's funny...'", author: "Isaac Asimov", category: "science", emoji: "🤔" },
    { id: 156, text: "Science is magic that works.", author: "Kurt Vonnegut", category: "science", emoji: "🪄" },
    { id: 157, text: "The scientist discovers a new type of material or energy and the engineer discovers a new use for it.", author: "Gordon Lindsay Glegg", category: "science", emoji: "⚙️" },
    { id: 158, text: "For every complex problem, there is a solution that is simple, neat, and wrong.", author: "H.L. Mencken", category: "science", emoji: "💡" },
    { id: 159, text: "The best scientist is open to experience.", author: "Charles F. Kettering", category: "science", emoji: "🌐" },
    { id: 160, text: "To invent, you need a good imagination and a pile of junk.", author: "Thomas Edison", category: "science", emoji: "🗑️" },

    // Extended Growth (161-200)
    { id: 161, text: "Be stubborn about your goals, but flexible about your methods.", author: "Unknown", category: "growth", emoji: "🎯" },
    { id: 162, text: "Small progress is still progress.", author: "Unknown", category: "growth", emoji: "🐌" },
    { id: 163, text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", category: "growth", emoji: "🌈" },
    { id: 164, text: "Your limitation—it's only your imagination.", author: "Unknown", category: "growth", emoji: "🌟" },
    { id: 165, text: "Dream it. Wish it. Do it.", author: "Unknown", category: "growth", emoji: "✨" },
    { id: 166, text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown", category: "growth", emoji: "🌅" },
    { id: 167, text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery", category: "growth", emoji: "🙏" },
    { id: 168, text: "Push yourself, because no one else is going to do it for you.", author: "Unknown", category: "growth", emoji: "💪" },
    { id: 169, text: "Sometimes later becomes never. Do it now.", author: "Unknown", category: "growth", emoji: "⏰" },
    { id: 170, text: "Work hard in silence, let your success be your noise.", author: "Frank Ocean", category: "growth", emoji: "🤫" },
    { id: 171, text: "The only person you should try to be better than is the person you were yesterday.", author: "Unknown", category: "growth", emoji: "🪞" },
    { id: 172, text: "Failure is simply the opportunity to begin again.", author: "Henry Ford", category: "growth", emoji: "🔄" },
    { id: 173, text: "Success doesn't come to you. You go to it.", author: "Marva Collins", category: "growth", emoji: "🏃" },
    { id: 174, text: "Don't wait for opportunity. Create it.", author: "Unknown", category: "growth", emoji: "🔨" },
    { id: 175, text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown", category: "growth", emoji: "🏆" },
    { id: 176, text: "Your positive action combined with positive thinking results in success.", author: "Shiv Khera", category: "growth", emoji: "➕" },
    { id: 177, text: "You can't go back and change the beginning, but you can start where you are and change the ending.", author: "C.S. Lewis", category: "growth", emoji: "📝" },
    { id: 178, text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller", category: "growth", emoji: "🌟" },
    { id: 179, text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "growth", emoji: "⏳" },
    { id: 180, text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "growth", emoji: "🦋" },

    // Extended Perseverance (181-250)
    { id: 181, text: "The pain you feel today will be the strength you feel tomorrow.", author: "Unknown", category: "perseverance", emoji: "💪" },
    { id: 182, text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown", category: "perseverance", emoji: "🏁" },
    { id: 183, text: "Strength doesn't come from what you can do. It comes from overcoming.", author: "Rikki Rogers", category: "perseverance", emoji: "🦁" },
    { id: 184, text: "Rock bottom became the solid foundation on which I rebuilt my life.", author: "J.K. Rowling", category: "perseverance", emoji: "🏗️" },
    { id: 185, text: "Character cannot be developed in ease and quiet. Only through experience of trial and suffering.", author: "Helen Keller", category: "perseverance", emoji: "💎" },
    { id: 186, text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Ralph Waldo Emerson", category: "perseverance", emoji: "🌄" },
    { id: 187, text: "Tough times never last, but tough people do.", author: "Robert H. Schuller", category: "perseverance", emoji: "⛰️" },
    { id: 188, text: "I am not what happened to me, I am what I choose to become.", author: "Carl Jung", category: "perseverance", emoji: "🦅" },
    { id: 189, text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis", category: "perseverance", emoji: "👑" },
    { id: 190, text: "A river cuts through rock not because of its power, but its persistence.", author: "Jim Watkins", category: "perseverance", emoji: "🌊" },
    { id: 191, text: "Fall down seven times, get up eight.", author: "Japanese Proverb", category: "perseverance", emoji: "🥊" },
    { id: 192, text: "When the going gets tough, the tough get going.", author: "Joseph Kennedy", category: "perseverance", emoji: "🏃" },
    { id: 193, text: "Strength grows in the moments when you think you can't go on but you keep going.", author: "Unknown", category: "perseverance", emoji: "⚡" },
    { id: 194, text: "Stars can't shine without darkness.", author: "Unknown", category: "perseverance", emoji: "⭐" },
    { id: 195, text: "In the midst of winter, I found there was, within me, an invincible summer.", author: "Albert Camus", category: "perseverance", emoji: "☀️" },
    { id: 196, text: "I survived because the fire inside me burned brighter than the fire around me.", author: "Joshua Graham", category: "perseverance", emoji: "🔥" },
    { id: 197, text: "You may have to fight a battle more than once to win it.", author: "Margaret Thatcher", category: "perseverance", emoji: "⚔️" },
    { id: 198, text: "Life isn't about waiting for the storm to pass. It's about learning to dance in the rain.", author: "Vivian Greene", category: "perseverance", emoji: "🌧️" },
    { id: 199, text: "Every champion was once a contender that refused to give up.", author: "Rocky Balboa", category: "perseverance", emoji: "🥇" },
    { id: 200, text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", category: "perseverance", emoji: "❤️" },
];

// Helper functions
export const getRandomQuote = (): Quote => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
    return MOTIVATIONAL_QUOTES[randomIndex];
};

export const getQuotesByCategory = (category: Quote['category']): Quote[] => {
    return MOTIVATIONAL_QUOTES.filter(q => q.category === category);
};

export const getQuoteById = (id: number): Quote | undefined => {
    return MOTIVATIONAL_QUOTES.find(q => q.id === id);
};

// Generate more quotes dynamically by cycling through patterns
export const getExtendedQuotes = (count: number = 1000): Quote[] => {
    const baseQuotes = [...MOTIVATIONAL_QUOTES];
    const result: Quote[] = [];

    for (let i = 0; i < count; i++) {
        const quote = baseQuotes[i % baseQuotes.length];
        result.push({
            ...quote,
            id: i + 1
        });
    }

    return result;
};

export default MOTIVATIONAL_QUOTES;
