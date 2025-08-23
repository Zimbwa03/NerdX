# DeepSeek API Example Prompts and Responses

## Example 1: Topical Question Generation

### Input Prompt:
```
Generate 5 Zimsec O-Level English questions for Form 3 students on the topic: Formal Letter Writing

Requirements:
- Follow Zimsec examination format exactly
- Include questions worth 1-2 marks each based on complexity
- Use African/Zimbabwean context and character names (Chipo, Tendai, Mukoma, Rudo, Tapiwa, etc.)
- Vary question difficulty appropriately for Form 3
- Provide clear, accurate answers
- Include cross-cutting themes: Heritage Studies, Environmental Issues, Gender, etc.

Format each question as JSON:
{
    "question_text": "question here",
    "correct_answer": "answer here",
    "marks": 1 or 2,
    "difficulty": "easy/medium/hard",
    "question_type": "recall/inference/analysis/evaluation"
}

Return as a JSON array of 5 questions.
```

### Expected Response:
```json
[
    {
        "question_text": "What is the correct salutation when writing a formal letter to the Mayor of Harare?",
        "correct_answer": "Dear Sir/Madam or Dear Mr./Mrs. [Name]",
        "marks": 1,
        "difficulty": "easy",
        "question_type": "recall"
    },
    {
        "question_text": "Tendai wants to write a formal letter to the Ministry of Environment complaining about illegal dumping in his community. List TWO pieces of information he must include in the heading of his letter.",
        "correct_answer": "1. His full address 2. The date",
        "marks": 2,
        "difficulty": "medium",
        "question_type": "recall"
    },
    {
        "question_text": "In a formal letter requesting sponsorship for a school environmental project, explain why it is important to include specific details about the project's benefits to the community.",
        "correct_answer": "Specific details help the sponsor understand the project's value and impact, making them more likely to provide support. It shows the project is well-planned and will benefit many people.",
        "marks": 2,
        "difficulty": "medium",
        "question_type": "analysis"
    },
    {
        "question_text": "What is the appropriate complimentary close for a formal business letter?",
        "correct_answer": "Yours faithfully (if you don't know the person's name) or Yours sincerely (if you know their name)",
        "marks": 1,
        "difficulty": "easy",
        "question_type": "recall"
    },
    {
        "question_text": "Chipo wrote a formal letter to her local council about poor road conditions. Analyze why using an angry, demanding tone would be ineffective in achieving her goal.",
        "correct_answer": "An angry tone would be counterproductive because it may offend the reader and make them less willing to help. Formal letters should be polite and respectful to maintain good relationships and increase the chances of a positive response.",
        "marks": 2,
        "difficulty": "hard",
        "question_type": "evaluation"
    }
]
```

## Example 2: Comprehension Passage Generation

### Input Prompt:
```
Generate a comprehension passage for Zimsec O-Level Form 2 English students.

Requirements:
- Theme: Traditional Zimbabwean Culture
- Word count: 350-450 words
- Use African/Zimbabwean context and character names: Chipo, Tendai, Mukoma, Rudo, Tapiwa
- Setting: Rural homestead in Mashonaland
- Include cultural elements relevant to Zimbabwe
- Appropriate vocabulary and complexity for Form 2
- Clear narrative structure

Follow with exactly 10 comprehension questions:
1-2: Recall questions (1 mark each)
3-5: Inference questions (2 marks each)  
6-7: Vocabulary in context (1 mark each)
8: Tone/mood identification (2 marks)
9: Analysis question (2 marks)
10: Summary question (2 marks)

Format as JSON with passage and questions array.
```

### Expected Response:
```json
{
    "passage": {
        "title": "The Wisdom of Grandmother Rudo",
        "text": "The morning sun cast long shadows across the homestead as Chipo and her younger brother Tendai sat cross-legged on the reed mat outside their grandmother's hut. Grandmother Rudo, her weathered hands skillfully weaving a traditional basket, was about to share one of her treasured stories.\n\n\"Long ago,\" she began, her voice carrying the wisdom of many seasons, \"our ancestors believed that every living thing had a spirit that deserved respect. The baobab tree standing majestically in our compound has witnessed five generations of our family. It has provided shelter during storms, fruit during droughts, and medicine when we were ill.\"\n\nTendai's eyes widened with curiosity. \"But Grandmother, how can a tree have a spirit?\"\n\nRudo smiled gently, her fingers never pausing in their intricate work. \"My child, our forefathers understood that we are all connected – the trees, the animals, the rivers, and the people. This is the essence of Ubuntu, the belief that 'I am because we are.' When we respect nature, nature respects us in return.\"\n\nChipo nodded thoughtfully. She had noticed how her grandmother always asked permission before picking herbs from the garden and how she left offerings of water at the base of the ancient baobab tree.\n\n\"During the liberation struggle,\" Rudo continued, \"this very tree hid freedom fighters from enemy soldiers. Its massive trunk provided sanctuary, and its roots ran deep, just like our connection to this land. Today, as you children learn about modern technology and global cultures, remember that your roots are equally important.\"\n\nAs the basket took shape in her grandmother's hands, Chipo realized that each strand represented a lesson, each weave a tradition passed down through generations. The morning lesson was more than just storytelling; it was a bridge connecting the past to the present, ensuring that the wisdom of their ancestors would continue to guide future generations.\n\nThe sun climbed higher, but the children remained captivated, understanding that they were receiving something far more valuable than any material possession – the gift of cultural identity and ancestral wisdom.",
        "word_count": 387,
        "character_names": ["Chipo", "Tendai", "Rudo"],
        "setting": "Rural homestead in Mashonaland",
        "theme": "Traditional Zimbabwean Culture"
    },
    "questions": [
        {
            "question_number": 1,
            "question_text": "Where were Chipo and Tendai sitting when their grandmother told them the story?",
            "correct_answer": "On a reed mat outside their grandmother's hut",
            "marks": 1,
            "question_type": "recall"
        },
        {
            "question_number": 2,
            "question_text": "What was Grandmother Rudo doing while telling the story?",
            "correct_answer": "Weaving a traditional basket",
            "marks": 1,
            "question_type": "recall"
        },
        {
            "question_number": 3,
            "question_text": "Why do you think Grandmother Rudo chose to tell this particular story to her grandchildren?",
            "correct_answer": "She wanted to teach them about their cultural heritage and the importance of respecting nature and maintaining connections to their ancestors and traditions.",
            "marks": 2,
            "question_type": "inference"
        },
        {
            "question_number": 4,
            "question_text": "What can we infer about Grandmother Rudo's character from her actions and words?",
            "correct_answer": "She is wise, respectful of tradition, patient, and deeply connected to her cultural heritage. She values teaching and passing on knowledge to younger generations.",
            "marks": 2,
            "question_type": "inference"
        },
        {
            "question_number": 5,
            "question_text": "Why do you think the baobab tree is significant to the family?",
            "correct_answer": "It represents continuity, protection, and connection to their ancestors. It has been part of their family history for five generations and provided practical and spiritual support.",
            "marks": 2,
            "question_type": "inference"
        },
        {
            "question_number": 6,
            "question_text": "What does the word 'sanctuary' mean in the context of paragraph 5?",
            "correct_answer": "A safe place or shelter",
            "marks": 1,
            "question_type": "vocabulary"
        },
        {
            "question_number": 7,
            "question_text": "Find a word in paragraph 4 that means 'complicated' or 'detailed'.",
            "correct_answer": "Intricate",
            "marks": 1,
            "question_type": "vocabulary"
        },
        {
            "question_number": 8,
            "question_text": "What is the overall mood of this passage? Support your answer with evidence from the text.",
            "correct_answer": "The mood is peaceful, respectful, and reverent. Evidence includes descriptions like 'morning sun cast long shadows,' 'voice carrying the wisdom of many seasons,' and 'children remained captivated.'",
            "marks": 2,
            "question_type": "tone"
        },
        {
            "question_number": 9,
            "question_text": "How does the author use the basket-weaving activity to reinforce the story's message?",
            "correct_answer": "The basket-weaving serves as a metaphor for cultural transmission - each strand represents a lesson and each weave represents tradition being passed down, showing how cultural knowledge is carefully constructed and preserved.",
            "marks": 2,
            "question_type": "analysis"
        },
        {
            "question_number": 10,
            "question_text": "In your own words, summarize the main lesson Grandmother Rudo wanted to teach her grandchildren.",
            "correct_answer": "Grandmother Rudo wanted to teach her grandchildren to respect and maintain their connection to their cultural heritage, ancestors, and nature, while understanding that these traditional values remain important even as they learn about modern life.",
            "marks": 2,
            "question_type": "summary"
        }
    ]
}
```

## Example 3: Essay Marking

### Input Essay:
```
Prompt: "Write a story that begins with: 'The old baobab tree had witnessed many changes in the village over the years...'"

Student Essay:
"The old baobab tree had witnessed many changes in the village over the years. It stood majestically in the center of Mukoma's village, its massive trunk scarred by time but still strong.

When Mukoma was a young boy, the village was very different. There were no roads, no electricity, and no modern buildings. People lived in traditional huts made of mud and thatch. The baobab tree was where the village elders met to discuss important matters and settle disputes.

As years passed, things began to change. The government built a tarred road that passed through the village. Soon after, electricity poles were erected, bringing light to the homes. Some villagers started building modern houses with iron roofs instead of thatch.

Mukoma, now an old man himself, often sat under the baobab tree remembering the past. He was happy about some changes - his grandchildren could now study at night using electric lights, and the clinic had modern equipment that saved lives. But he also felt sad about some things that were lost.

The young people no longer gathered under the tree to hear stories from the elders. They were too busy with their phones and television. Traditional ceremonies were becoming rare, and some children couldn't even speak their mother tongue properly.

One day, Mukoma decided to do something. He started a cultural club where young people could learn traditional dances, stories, and crafts. He held the meetings under the old baobab tree, just like in the old days.

The tree seemed to approve, its branches swaying gently in the wind as if nodding in agreement. Mukoma realized that while change was inevitable, it was important to preserve the good things from the past while embracing the benefits of modernity.

The baobab tree continued to stand as a symbol of endurance and wisdom, bridging the gap between the old and the new."
```

### Expected Marking Response:
```json
{
    "marks": {
        "content": 8,
        "language": 7,
        "structure": 8,
        "total": 23
    },
    "feedback": {
        "strengths": [
            "Excellent use of the given opening sentence",
            "Clear narrative structure with good progression",
            "Effective use of the baobab tree as a central symbol",
            "Good exploration of the theme of tradition vs. modernity",
            "Satisfying resolution with Mukoma's cultural club initiative",
            "Appropriate Zimbabwean context and character names"
        ],
        "grammar_errors": [
            {
                "error": "There were no roads, no electricity, and no modern buildings.",
                "correction": "Consider varying sentence structure: 'The village had no roads, electricity, or modern buildings.'",
                "line": 2
            }
        ],
        "spelling_errors": [],
        "vocabulary_suggestions": [
            {
                "original": "very different",
                "suggestion": "dramatically different or vastly different"
            },
            {
                "original": "things began to change",
                "suggestion": "transformation began or modernization commenced"
            }
        ],
        "structure_comments": "Good paragraph structure with clear topic development. Each paragraph focuses on a specific time period or aspect of change. The conclusion effectively ties together the themes. Consider adding more transitional phrases between paragraphs for smoother flow.",
        "overall_comment": "This is a well-crafted story that effectively uses the baobab tree as both setting and symbol. You've successfully explored the tension between tradition and modernity while maintaining a clear narrative voice. The resolution is particularly strong, showing Mukoma's proactive approach to preserving culture."
    },
    "teacher_comment": "Very Good! Your storytelling shows real skill and cultural awareness.",
    "grade_percentage": 77,
    "corrected_text": "The old baobab tree had witnessed many changes in the village over the years. It stood majestically in the center of Mukoma's village, its massive trunk scarred by time but still strong.\n\nWhen Mukoma was a young boy, the village was [SUGGESTION: dramatically] different. [SUGGESTION: The village had no roads, electricity, or modern buildings] rather than [ERROR: There were no roads, no electricity, and no modern buildings]. People lived in traditional huts made of mud and thatch. The baobab tree was where the village elders met to discuss important matters and settle disputes.\n\nAs years passed, [SUGGESTION: transformation began] instead of [ERROR: things began to change]. The government built a tarred road that passed through the village. Soon after, electricity poles were erected, bringing light to the homes. Some villagers started building modern houses with iron roofs instead of thatch.\n\n[GOOD: Excellent transition to Mukoma's perspective] Mukoma, now an old man himself, often sat under the baobab tree remembering the past. He was happy about some changes - his grandchildren could now study at night using electric lights, and the clinic had modern equipment that saved lives. But he also felt sad about some things that were lost.\n\n[GOOD: Effective contrast between old and new] The young people no longer gathered under the tree to hear stories from the elders. They were too busy with their phones and television. Traditional ceremonies were becoming rare, and some children couldn't even speak their mother tongue properly.\n\n[GOOD: Strong resolution] One day, Mukoma decided to do something. He started a cultural club where young people could learn traditional dances, stories, and crafts. He held the meetings under the old baobab tree, just like in the old days.\n\n[GOOD: Beautiful personification] The tree seemed to approve, its branches swaying gently in the wind as if nodding in agreement. Mukoma realized that while change was inevitable, it was important to preserve the good things from the past while embracing the benefits of modernity.\n\n[GOOD: Excellent conclusion] The baobab tree continued to stand as a symbol of endurance and wisdom, bridging the gap between the old and the new."
}
```

## Example 4: Advanced Comprehension with Cultural Context

### Input Prompt:
```
Generate a comprehension passage for Zimsec O-Level Form 4 students.

Requirements:
- Theme: Environmental Conservation
- Word count: 400-500 words
- Use African/Zimbabwean context and character names: Blessing, Nyasha, Farai
- Setting: Communal farming area in Manicaland
- Include cultural elements and environmental challenges
- Advanced vocabulary appropriate for Form 4
- Expository structure with argumentative elements

Follow with 10 questions focusing on higher-order thinking skills.
```

### Expected Response:
```json
{
    "passage": {
        "title": "Guardians of the Watershed: A Community's Fight for Survival",
        "text": "In the mist-shrouded hills of Manicaland, where the Nyanga mountains meet the sky, a quiet revolution is taking place. Blessing Mutasa, a 45-year-old communal farmer, stands at the edge of what was once a thriving indigenous forest, now reduced to scattered patches of msasa and mukwa trees. The devastating effects of deforestation have transformed this watershed area from a reliable source of water and fertile soil into an increasingly arid landscape plagued by erratic rainfall and soil erosion.\n\n\"When I was Nyasha's age,\" Blessing explains to his 16-year-old daughter, \"this entire hillside was covered in dense forest. The streams flowed year-round, and our crops never failed.\" Nyasha, a Form 4 student at the local secondary school, has been documenting the environmental changes as part of her geography project. Her research reveals alarming statistics: annual rainfall has decreased by 30% over the past two decades, while soil erosion has increased exponentially.\n\nThe root causes of this environmental degradation are complex and interconnected. Rapid population growth has intensified pressure on land resources, forcing families to clear forests for agriculture and settlement. Additionally, the demand for fuel wood and building materials has accelerated deforestation. Climate change has exacerbated these challenges, bringing unpredictable weather patterns that alternate between devastating droughts and destructive floods.\n\nHowever, hope emerges from an unlikely source: the community's youth. Farai Chikwanha, Nyasha's classmate and the son of a local headman, has initiated a tree-planting campaign that combines traditional ecological knowledge with modern conservation techniques. \"Our ancestors understood the sacred relationship between forests and water,\" Farai explains. \"They designated certain areas as sacred groves where no trees could be cut. We need to revive this wisdom while embracing scientific approaches to reforestation.\"\n\nThe initiative has gained momentum through partnerships with environmental organizations and government agencies. Community members are learning about agroforestry, which integrates trees into farming systems to improve soil fertility and water retention. Indigenous tree species like the mukwa and baobab are being prioritized for their drought resistance and cultural significance.\n\nPreliminary results are encouraging. Areas where trees have been planted show improved water retention and reduced soil erosion. More importantly, the project has fostered a renewed sense of environmental stewardship among community members. As Blessing observes, \"Our children are teaching us to see the forest not just as a resource to be exploited, but as a living system that sustains all life.\"\n\nThe success of this grassroots conservation effort demonstrates that environmental restoration is possible when communities combine traditional wisdom with scientific knowledge and collective action. The hills of Manicaland may once again echo with the sound of flowing streams and the rustle of healthy forests.",
        "word_count": 456,
        "character_names": ["Blessing", "Nyasha", "Farai"],
        "setting": "Communal farming area in Manicaland",
        "theme": "Environmental Conservation"
    },
    "questions": [
        {
            "question_number": 1,
            "question_text": "According to the passage, by what percentage has annual rainfall decreased in the area over the past two decades?",
            "correct_answer": "30%",
            "marks": 1,
            "question_type": "recall"
        },
        {
            "question_number": 2,
            "question_text": "Name TWO indigenous tree species mentioned in the passage.",
            "correct_answer": "Msasa, mukwa, and baobab (any two)",
            "marks": 1,
            "question_type": "recall"
        },
        {
            "question_number": 3,
            "question_text": "Analyze the relationship between population growth and environmental degradation as presented in the passage.",
            "correct_answer": "Population growth has intensified pressure on land resources, forcing families to clear forests for agriculture and settlement, which directly contributes to deforestation and environmental degradation.",
            "marks": 2,
            "question_type": "analysis"
        },
        {
            "question_number": 4,
            "question_text": "Evaluate the effectiveness of combining traditional ecological knowledge with modern conservation techniques.",
            "correct_answer": "The combination is effective because it respects cultural values (sacred groves) while applying scientific methods (agroforestry), creating sustainable solutions that communities are more likely to support and maintain.",
            "marks": 2,
            "question_type": "evaluation"
        },
        {
            "question_number": 5,
            "question_text": "What can be inferred about the role of youth in environmental conservation from this passage?",
            "correct_answer": "Youth are portrayed as catalysts for change, bringing fresh perspectives, combining education with action, and bridging traditional knowledge with modern approaches to create effective conservation solutions.",
            "marks": 2,
            "question_type": "inference"
        },
        {
            "question_number": 6,
            "question_text": "What does the word 'exponentially' mean in the context of paragraph 2?",
            "correct_answer": "Rapidly increasing or growing at an accelerating rate",
            "marks": 1,
            "question_type": "vocabulary"
        },
        {
            "question_number": 7,
            "question_text": "Find a phrase in paragraph 4 that means 'gained support and strength'.",
            "correct_answer": "Gained momentum",
            "marks": 1,
            "question_type": "vocabulary"
        },
        {
            "question_number": 8,
            "question_text": "What is the overall tone of the passage? Justify your answer with specific examples.",
            "correct_answer": "The tone is cautiously optimistic. While acknowledging serious environmental problems ('devastating effects,' 'alarming statistics'), it emphasizes hope and positive action ('quiet revolution,' 'encouraging results,' 'renewed sense of stewardship').",
            "marks": 2,
            "question_type": "tone"
        },
        {
            "question_number": 9,
            "question_text": "How does the author use the contrast between past and present to strengthen the argument for conservation?",
            "correct_answer": "The author uses Blessing's memories of a thriving forest versus current degradation to show the tangible losses, making the need for conservation urgent and personal. This emotional appeal strengthens the logical arguments for action.",
            "marks": 2,
            "question_type": "analysis"
        },
        {
            "question_number": 10,
            "question_text": "Summarize the main message of this passage in your own words.",
            "correct_answer": "Environmental degradation caused by human activities can be reversed through community-based conservation efforts that combine traditional ecological wisdom with modern scientific approaches, particularly when led by motivated youth.",
            "marks": 2,
            "question_type": "summary"
        }
    ]
}
```

## Example 5: Section B Guided Composition Marking

### Input Essay:
```
Prompt: "Write a letter to your local council complaining about poor road conditions in your area. Use the following points: potholes causing vehicle damage, difficulty for emergency services, impact on local businesses, request for urgent repairs."

Student Essay:
"15 Mukwa Drive
Chitungwiza
25 October 2024

The Town Clerk
Chitungwiza Municipality
P.O. Box 1025
Chitungwiza

Dear Sir/Madam

COMPLAINT ABOUT POOR ROAD CONDITIONS IN MUKWA DRIVE

I am writing to bring to your attention the terrible state of roads in our area, particularly Mukwa Drive and surrounding streets.

The roads are full of potholes that are causing serious damage to vehicles. My neighbor Mr. Tendai had to replace two tires last month because of these holes. Many residents are spending a lot of money on car repairs.

Emergency services are also struggling to reach our area quickly. Last week, an ambulance got stuck in a pothole while rushing to help a sick child. This delay could have been very dangerous.

Local businesses are suffering too. Customers avoid coming to our area because the roads are so bad. The grocery store owner, Mrs. Chipo, says her sales have dropped by half.

I request that the council repairs these roads urgently. We pay our rates and deserve better services. Please send a team to fix the potholes and resurface the roads.

I look forward to your quick response.

Yours faithfully

Tapiwa Moyo"
```

### Expected Marking Response:
```json
{
    "marks": {
        "content": 6,
        "language": 5,
        "structure": 6,
        "total": 17
    },
    "feedback": {
        "strengths": [
            "Correct formal letter format with proper heading and address",
            "Clear subject line that states the purpose",
            "All required points from the prompt are addressed",
            "Appropriate formal tone throughout",
            "Specific examples (Mr. Tendai's tires, ambulance incident, Mrs. Chipo's business)",
            "Clear request for action in conclusion",
            "Correct complimentary close"
        ],
        "grammar_errors": [
            {
                "error": "terrible state of roads",
                "correction": "terrible state of the roads",
                "line": 3
            }
        ],
        "spelling_errors": [],
        "vocabulary_suggestions": [
            {
                "original": "terrible state",
                "suggestion": "deplorable condition or deteriorating state"
            },
            {
                "original": "struggling to reach",
                "suggestion": "experiencing difficulty accessing"
            }
        ],
        "structure_comments": "Excellent letter structure with proper formal format. Each paragraph addresses a specific point clearly. Good use of topic sentences and supporting details. The progression from problem description to impact to request is logical and effective.",
        "overall_comment": "This is a well-structured formal complaint letter that addresses all the required points effectively. You've used appropriate examples to support your arguments and maintained a respectful but firm tone throughout. The letter format is correct and professional."
    },
    "teacher_comment": "Very Good! You've mastered the formal letter format and presented your case convincingly.",
    "grade_percentage": 85,
    "corrected_text": "15 Mukwa Drive\nChitungwiza\n25 October 2024\n\nThe Town Clerk\nChitungwiza Municipality\nP.O. Box 1025\nChitungwiza\n\nDear Sir/Madam\n\nCOMPLAINT ABOUT POOR ROAD CONDITIONS IN MUKWA DRIVE\n\nI am writing to bring to your attention the [SUGGESTION: deplorable condition] of [ERROR: the] roads in our area, particularly Mukwa Drive and surrounding streets.\n\nThe roads are full of potholes that are causing serious damage to vehicles. [GOOD: Specific example] My neighbor Mr. Tendai had to replace two tires last month because of these holes. Many residents are spending a lot of money on car repairs.\n\nEmergency services are also [SUGGESTION: experiencing difficulty accessing] our area quickly. [GOOD: Compelling example] Last week, an ambulance got stuck in a pothole while rushing to help a sick child. This delay could have been very dangerous.\n\n[GOOD: Clear impact on business] Local businesses are suffering too. Customers avoid coming to our area because the roads are so bad. The grocery store owner, Mrs. Chipo, says her sales have dropped by half.\n\nI request that the council repairs these roads urgently. [GOOD: Reference to civic duty] We pay our rates and deserve better services. Please send a team to fix the potholes and resurface the roads.\n\n[GOOD: Professional conclusion] I look forward to your quick response.\n\nYours faithfully\n\nTapiwa Moyo"
}
```

These examples demonstrate the expected quality and format of responses from the DeepSeek API integration, showing how the system should generate culturally appropriate, educationally sound content that aligns with Zimsec O-Level English requirements.

