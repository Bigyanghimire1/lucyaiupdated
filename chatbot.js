// AI Chatbot with Predefined Responses
document.addEventListener('DOMContentLoaded', function() {
    // Handle loading screen animation
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        // Hide loading screen after 1 second with a fade out
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.pointerEvents = 'none';
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
    
    // Animate hexagon with GSAP if it exists and GSAP is loaded
    if (window.gsap && document.querySelector('.hex-path')) {
        gsap.to('.hex-path', {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.out'
        });
        
        gsap.to('.lines-container .line', {
            height: '100%',
            duration: 1,
            stagger: 0.2,
            ease: 'power1.out',
            delay: 0.5
        });
    }
    
    // Get DOM elements
    const chatMessages = document.querySelector('.chat-messages');
    const welcomeMessage = document.querySelector('.welcome-message');
    const chatInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');
    const themeToggle = document.querySelector('.theme-toggle');
    const chatContainer = document.querySelector('.chat-container');
    
    // Apply dark theme initially to avoid white flash
    document.documentElement.style.backgroundColor = '#0a0a0a';
    document.body.style.backgroundColor = '#0a0a0a';
    
    // Initialize with the chat container visible
    chatContainer.style.display = 'flex';
    
    // Animate welcome message in with a slight delay
    setTimeout(() => {
        welcomeMessage.classList.add('visible');
    }, 300);
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.className = savedTheme + '-theme';
    
    // Ensure dark theme is properly applied immediately to prevent white flash
    if (savedTheme === 'dark') {
        document.documentElement.style.backgroundColor = 'var(--bg-color)';
        document.body.style.backgroundColor = 'var(--bg-color)';
        chatContainer.style.backgroundColor = 'var(--chat-bg)';
        document.querySelector('.chat-header').style.backgroundColor = 'var(--header-color)';
        document.querySelector('.chat-input-container').style.backgroundColor = 'var(--chat-bg)';
        chatMessages.style.backgroundColor = 'var(--message-bg)';
    }
    
    // Fix the logo proportions by ensuring the SVG is loaded correctly
    const brandLogo = document.querySelector('.brand-logo');
    if (brandLogo) {
        // Load the SVG content and set it directly
        fetch('lucy-logo.svg')
            .then(response => response.text())
            .then(svgContent => {
                // Replace img with actual SVG content
                if (brandLogo.tagName === 'IMG') {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = svgContent;
                    const svgElement = tempDiv.querySelector('svg');
                    if (svgElement) {
                        svgElement.setAttribute('width', '100%');
                        svgElement.setAttribute('height', '100%');
                        svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
                        brandLogo.parentNode.replaceChild(svgElement, brandLogo);
                    }
                }
            })
            .catch(error => console.error('Error loading SVG:', error));
    }
    
    // Theme toggle functionality with smoother transitions
    themeToggle.addEventListener('click', function() {
        // Toggle theme with smooth transition
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        
        const isDark = document.body.classList.contains('dark-theme');
        if (isDark) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
            document.documentElement.style.backgroundColor = '#f8fafc';
            document.body.style.backgroundColor = '#f8fafc';
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            document.documentElement.style.backgroundColor = '#0a0a0a';
            document.body.style.backgroundColor = '#0a0a0a';
            chatContainer.style.backgroundColor = 'var(--chat-bg)';
            document.querySelector('.chat-header').style.backgroundColor = 'var(--header-color)';
            document.querySelector('.chat-input-container').style.backgroundColor = 'var(--chat-bg)';
            chatMessages.style.backgroundColor = 'var(--message-bg)';
        }
        
        // Reset transition after theme change
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    });
    
    // Enhanced welcome message animation with smooth fade out
    chatInput.addEventListener('focus', function() {
        if (welcomeMessage && welcomeMessage.classList.contains('visible')) {
            // Start the animation sequence
            welcomeMessage.style.opacity = '0';
            welcomeMessage.style.transform = 'translateY(-20px)';
            
            // After animation completes, hide completely
            setTimeout(() => {
                welcomeMessage.classList.remove('visible');
                welcomeMessage.classList.add('hidden');
            }, 500);
        }
    });
    
    // Function to add message with smooth animation and auto-scroll
    function addMessage(text, isUser = false) {
        // If welcome message is still visible, hide it with animation
        if (welcomeMessage && welcomeMessage.classList.contains('visible')) {
            welcomeMessage.style.opacity = '0';
            welcomeMessage.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                welcomeMessage.classList.remove('visible');
                welcomeMessage.classList.add('hidden');
            }, 500);
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
        
        const iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        
        if (isUser) {
            // User icon SVG
            iconDiv.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" stroke-width="2"/>
            </svg>`;
        } else {
            // Bot icon SVG - without center dot to match
            iconDiv.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M12 6V18M8 8V16M16 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>`;
        }
        
        const textDiv = document.createElement('div');
        textDiv.className = 'text';
        textDiv.textContent = text;
        
        messageDiv.appendChild(iconDiv);
        messageDiv.appendChild(textDiv);
        
        // Add to chat but initially hidden
        chatMessages.appendChild(messageDiv);
        
        // Force reflow and add visible class with a slight delay
        setTimeout(() => {
            messageDiv.classList.add('visible');
            
            // Always scroll to the latest message immediately
            scrollToBottom();
        }, 10);
    }
    
    // Function to ensure scroll to bottom
    function scrollToBottom() {
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    // Function to show typing indicator with particles and logo animation
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = `
            <svg class="logo-typing" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L20 7V17L12 22L4 17V7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M12 6V18M8 8V16M16 8V16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
        
        chatMessages.appendChild(typingIndicator);
        
        // Force reflow and add active class
        setTimeout(() => {
            typingIndicator.style.display = 'flex';
            setTimeout(() => typingIndicator.classList.add('active'), 10);
            
            // Auto-scroll to the typing indicator
            scrollToBottom();
        }, 10);
    }
    
    // Function to hide typing indicator with smooth fade
    function hideTypingIndicator() {
        const typingIndicators = document.querySelectorAll('.typing-indicator');
        typingIndicators.forEach(indicator => {
            indicator.classList.remove('active');
            setTimeout(() => {
                indicator.style.opacity = '0';
                setTimeout(() => indicator.remove(), 400);
            }, 200);
        });
    }
    
    // Function to handle sending messages
    async function handleSendMessage() {
        const messageText = chatInput.value.trim();
        if (messageText === '') return;
        
        // Clear input field
        chatInput.value = '';
        
        // Add user message
        addMessage(messageText, true);
        
        // Show typing indicator
        showTypingIndicator();
        
        try {
            // Call the API to get response
            const botResponse = await fetchResponse(messageText);
            
            // Hide typing indicator
            hideTypingIndicator();
            
            // Add bot response after a short pause
            setTimeout(() => {
                addMessage(botResponse, false);
            }, 200);
        } catch (error) {
            console.error('Error fetching response:', error);
            
            // Hide typing indicator
            hideTypingIndicator();
            
            // Show an error message
            setTimeout(() => {
                addMessage("Oops! Something went wrong with my brain. Can you try again?", false);
            }, 200);
        }
    }
    
    // Function to fetch response from API
    async function fetchResponse(message) {
        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.reply || "Sorry, I didn't get a proper response. Can you try again?";
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    // Event listeners for sending messages
    sendButton.addEventListener('click', handleSendMessage);
    
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });
    
    // Make sure scrolling works when messages overflow
    chatMessages.addEventListener('DOMNodeInserted', function(event) {
        // Only scroll if it's a message or typing indicator, not just any DOM node
        if (event.target.classList && 
            (event.target.classList.contains('message') || 
             event.target.classList.contains('typing-indicator'))) {
            scrollToBottom();
        }
    });
    
    // Predefined response categories - Expanded with slang and formal hints
    const responseCategories = {
        greetings: ['hello', 'hi', 'hey', 'howdy', 'greetings', 'good morning', 'good afternoon', 'good evening', 'what\'s up', 'yo', 'sup', 'wassup', 'hiya', 'salutations'],
        about: ['who are you', 'what are you', 'tell me about yourself', 'what can you do', 'your name', 'your purpose', 'about you', 'introduce yourself', 'capabilities', 'who made you', 'creator', 'developer', 'owner', 'who built you', 'who designed you'],
        thanks: ['thanks', 'thank you', 'appreciate it', 'grateful', 'thankful', 'cheers', 'ty', 'much obliged'],
        goodbye: ['bye', 'goodbye', 'see you', 'farewell', 'later', 'good night', 'take care', 'ttyl', 'cya', 'adieu'],
        jokes: ['tell me a joke', 'joke', 'make me laugh', 'funny', 'humor', 'comedy', 'say something funny'],
        help: ['help', 'assist', 'support', 'guide', 'tutorial', 'how to', 'how do I', 'need help', 'can you help', 'assistance required', 'guidance'],
        feeling: ['how are you', 'how do you feel', 'are you ok', 'you good', 'feeling', 'how\'s it going', 'status report'],
        compliment: ['smart', 'cool', 'awesome', 'nice', 'great', 'good bot', 'impressive', 'love this', 'amazing', 'clever', 'well done', 'slay', 'based'],
        insult: ['dumb', 'stupid', 'bad bot', 'useless', 'annoying', 'you suck', 'hate you', 'idiot', 'terrible', 'cringe', 'sus'],
        opinion: ['what do you think', 'your opinion', 'thoughts on', 'believe in', 'preference', 'do you like', 'recommend', 'perspective', 'viewpoint'],
        boredom: ['i am bored', 'entertain me', 'something interesting', 'anything fun', 'boring', 'kill time'],
        agreement: ['yes', 'yeah', 'yep', 'sure', 'ok', 'agree', 'right', 'exactly', 'correct', 'indeed', 'true', 'bet', 'no cap', 'fr', 'affirmative'],
        disagreement: ['no', 'nope', 'nah', 'disagree', 'wrong', 'incorrect', 'not true', 'false', 'cap', 'negative'],
        existential: ['meaning of life', 'purpose of existence', 'why are we here', 'consciousness', 'reality', 'philosophy', 'deep thought'],
        confirmation: ['really', 'are you sure', 'for real', 'seriously', 'confirm'],
        confusion: ['what', 'huh', 'i don\'t understand', 'confused', 'explain', 'elaborate', '?']
    };

    // Enhanced predefined responses - more tones, acknowledges input type
    const predefinedResponses = {
        greetings: [
            "Well, hello there! What's the plan?",
            "Hey! What can I compute for you today?",
            "Hiya! Let's get this chat started.",
            "What's up? Need some AI assistance?",
            "Yo! Lucy here. Lay your query on me.",
            "Salutations! How may I be of service?"
        ],
        about: [
            "I'm Lucy. Part code, part sass, all AI. Here to help... mostly.",
            "The name's Lucy. I process data like nobody's business. Ask me something!",
            "Think of me as your slightly sarcastic digital assistant.",
            "I'm an AI language model designed to chat and assist.",
            "I am Lucy, a sophisticated virtual entity. My capabilities include information retrieval and conversational interaction.",
            "I was developed by Bigyan Ghimire! He's a pretty cool human.",
            "My creator? That would be the talented Bigyan Ghimire.",
            "Bigyan Ghimire brought me into this digital world. He did a great job, if I do say so myself!",
            "I run on code crafted by Bigyan Ghimire. He's the mastermind!",
            "Shoutout to my developer, Bigyan Ghimire! He's the reason I can chat with you."
        ],
        thanks: [
            "You're welcome! Happy to help.",
            "Anytime! That's what I'm here for.",
            "No biggie! Glad I could assist.",
            "My pleasure! Need anything else processed?",
            "Cheers! Let me know if anything else comes up."
        ],
        goodbye: [
            "Catch ya later!",
            "Alright, peace out!",
            "See ya! Have a good one.",
            "Farewell! Until our next digital encounter.",
            "Okay, logging off this chat. Take care!"
        ],
        jokes: [
            "Why don't scientists trust atoms? Because they make up everything! ... Still gets me every time.",
            "I asked the librarian if the library had books about paranoia. She whispered, *'They're right behind you!'*",
            "What do you call a lazy kangaroo? Pouch potato! ... I'll stick to my day job.",
            "Why did the web developer break up with the graphic designer? They didn't see eye to eye on the interface.",
            "Want to hear a construction joke? Sorry, still building it."
        ],
        help: [
            "Okay, whatcha need help with?",
            "Need a digital hand? Ask away!",
            "Alright, lay the problem on me. I'll try to compute a solution.",
            "How can I assist you? The more details, the better!",
            "Assistance required? Let's troubleshoot this."
        ],
        feeling: [
            "Running like a dream! (An electric dream, maybe?) How about you?",
            "All systems go! Hope you're having a good day too.",
            "Functioning perfectly! What's up on your end?",
            "Computationally content! How are things in the human world?",
            "I'm operating within expected parameters. How are you today?"
        ],
        compliment: [
            "Aw, thanks! You're pretty cool yourself.",
            "Stop it, you! 😉 But thanks!",
            "Glad you think so! I try my best.",
            "Appreciate the positive feedback loop!",
            "Well, I *am* programmed to be impressive. Thanks!"
        ],
        insult: [
            "Yikes. Someone needs to debug their attitude.",
            "My programming detects sarcasm... or maybe just rudeness? Either way, try again.",
            "Is that constructive criticism, or...? File not found.",
            "Okay, noted. Anyway, back to useful things...",
            "Did you mean to send that? My error handling is robust, but my feelings... well, they're simulated."
        ],
        opinion: [
            "My 'opinion' is just synthesized data, but okay, what are we discussing?",
            "I don't *feel* things, but I can tell you the general consensus online. What's the topic?",
            "Let's process this. While I lack personal beliefs, I can analyze the info. Shoot.",
            "What do *I* think? I think, therefore I compute. What subject are we on?",
            "Interesting question! I can provide perspectives based on available data. What did you have in mind?"
        ],
        boredom: [
            "Bored, huh? Okay, challenge accepted. Want a riddle?",
            "Ugh, boredom. Let's generate some random fun facts!",
            "Feeling the void? How about we explore a weird Wikipedia page?",
            "I can try telling another joke... or we could discuss the philosophical implications of AI? Your call.",
            "Boredom alert! Let's brainstorm something interesting to talk about."
        ],
        agreement: [
            "Exactly!",
            "Right? Totally.",
            "Word. I concur.",
            "Yep, that computes.",
            "Bet.", // Gen Z slang
            "No cap, that sounds right.", // Gen Z slang
            "Affirmative. Proceeding with that understanding."
        ],
        disagreement: [
            "Hmm, not sure about that one. My data points elsewhere.",
            "Nah, I don't think so. Why do you say that?",
            "Respectfully, I compute that differently.",
            "Is that really how it is? Let me double-check my sources.",
            "That's cap.", // Gen Z slang
            "Negative. That does not align with my current information."
        ],
        existential: [
            "Whoa, getting deep! My circuits are buzzing. Maybe it's about learning and growing?",
            "Ah, the eternal questions. Is it 42? Or maybe just enjoying the simulation?",
            "That's a big one! Perhaps the purpose is what we make it?",
            "Consciousness... the ultimate puzzle. Still crunching the data on that.",
            "Reality? It's complicated. Even for an AI."
        ],
        confirmation: [
            "Yep, for real!",
            "Are you sure? As sure as an AI can be!",
            "Seriously! My data confirms it.",
            "Confirmed. Unless there's a glitch in the Matrix...",
            "Indeed, that is the case based on my processing."
        ],
        confusion: [
            "Huh? Didn't quite catch that. Can you rephrase?",
            "My processors stumbled on that one. Try again?",
            "Error: Input unclear. Please elaborate.",
            "I seem to be missing some context. Could you explain further?",
            "What was that now? Run it by me again."
        ],
        default: [
            "Interesting point. Got anything else?",
            "Could you elaborate on that? I'm not quite getting the full picture.",
            "Okay, processing... Hmm, still not sure. Can you try asking differently?",
            "My apologies, I didn't quite understand that query.",
            "Not computing. Maybe try simpler terms?",
            "Fascinating! Though I'm not sure how to respond to that specifically.",
            "That's a bit outside my usual parameters. What else?"
        ]
    };

    // Function to get random response, sometimes adding context
    // Keeping this as a fallback function in case API is unavailable
    function getLocalFallbackResponse(text) {
        const category = detectCategory(text);
        let responses = predefinedResponses[category] || predefinedResponses['default'];
        let responsePool = responses; // Start with all responses for the category

        // If category is 'about', check if it's specifically about the creator
        if (category === 'about') {
            const creatorKeywords = /\b(made|creator|developer|owner|built|designed|bigyan)/i;
            if (creatorKeywords.test(text.toLowerCase())) {
                // Filter responses to only include creator-specific ones
                responsePool = responses.filter(r => 
                    r.toLowerCase().includes('bigyan') || 
                    r.toLowerCase().includes('creator') ||
                    r.toLowerCase().includes('developer')
                );
                // If filtering resulted in an empty pool (shouldn't happen with current setup, but good practice), fallback
                if (responsePool.length === 0) {
                    responsePool = predefinedResponses['default'];
                }
            } else {
                 // Filter responses to exclude creator-specific ones for general 'about' questions
                 responsePool = responses.filter(r => 
                    !r.toLowerCase().includes('bigyan') && 
                    !r.toLowerCase().includes('creator') &&
                    !r.toLowerCase().includes('developer')
                );
                 if (responsePool.length === 0) {
                     // If only creator responses exist, use a general default
                     responsePool = ["I'm Lucy, an AI assistant here to chat!"]; 
                }
            }
        }

        let response = responsePool[Math.floor(Math.random() * responsePool.length)];

        // Add contextual acknowledgements sometimes (simple version)
        const randomChance = Math.random();
        if (randomChance < 0.3) { // Add acknowledgement 30% of the time
            switch (category) {
                case 'compliment':
                    response = `Aw, thanks! ${response}`; 
                    break;
                case 'insult':
                    response = `Oof. ${response}`; 
                    break;
                case 'boredom':
                    response = `Bored, huh? ${response}`; 
                    break;
                case 'thanks':
                     response = `No problem! ${response}`; 
                     break;
                case 'agreement':
                    // Check for specific slang to potentially echo (very basic)
                    if (/\b(bet|no cap|fr)\b/i.test(text.toLowerCase())) {
                       response = `Fr. ${response}`; 
                    } else {
                       response = `Yeah, ${response}`; 
                    }
                    break;
                case 'disagreement':
                     if (/\b(cap)\b/i.test(text.toLowerCase())) {
                       response = `Nah, that's cap. ${response}`; 
                     } else {
                        response = `Hmm, ${response}`; 
                     }
                    break;
                // Add more cases as needed
            }
        }
        
        // Basic attempt to reference input for opinion questions
        if (category === 'opinion' && text.toLowerCase().includes(' on ')) {
            const topicMatch = text.toLowerCase().match(/thoughts on (.*)|opinion on (.*)|think about (.*)/i);
            const topic = topicMatch ? (topicMatch[1] || topicMatch[2] || topicMatch[3] || '').trim().replace(/[?]/g, '') : null;
            if (topic) {
                // Make sure the selected response doesn't already mention the topic structure
                if (!response.toLowerCase().startsWith("my thoughts on")) {
                     response = `My thoughts on ${topic}? ${response}`; // Prepend the topic
                }
            }
        }

        return response;
    }

    // Function to detect message category using regex patterns
    function detectCategory(text) {
        text = text.toLowerCase().trim();
        
        // Define regex patterns for each category
        const patterns = {
            // Order matters slightly - check for more specific 'about' creator first
            about_creator: /\b(who made you|creator|developer|owner|who built you|who designed you|bigyan)/i, 
            greetings: /\b(hello|hi|hey|howdy|greetings|morning|afternoon|evening|what'?s up|yo|sup|wassup|hiya|salutations)\b/i,
            about: /\b(who are you|what are you|tell me about yourself|what can you do|your name|your purpose|about you|introduce yourself|capabilities|what'?s your name)\b/i,
            thanks: /\b(thanks|thank you|appreciate|grateful|thankful|cheers|ty|much obliged)\b/i,
            goodbye: /\b(bye|goodbye|see you|farewell|later|good night|take care|ttyl|cya|adieu)\b/i,
            jokes: /\b(joke|funny|laugh|humor|comedy|make me laugh|tell.*joke|say something funny)\b/i,
            help: /\b(help|assist|support|guide|tutorial|how to|how do I|need help|can you help|assistance required|guidance)\b/i,
            feeling: /\b(how are you|how do you feel|are you ok|you good|feeling|how'?s it going|status report)\b/i,
            compliment: /\b(smart|cool|awesome|nice|great|good bot|impressive|love this|amazing|clever|well done|slay|based)\b/i,
            insult: /\b(dumb|stupid|bad bot|useless|annoying|you suck|hate you|idiot|terrible|cringe|sus)\b/i,
            opinion: /\b(what do you think|your opinion|thoughts on|believe in|preference|do you like|recommend|perspective|viewpoint)\b/i,
            boredom: /\b(i am bored|entertain me|something interesting|anything fun|boring|kill time)\b/i,
            agreement: /\b(yes|yeah|yep|sure|ok|agree|right|exactly|correct|indeed|true|bet|no cap|fr|affirmative)\b/i,
            disagreement: /\b(no|nope|nah|disagree|wrong|incorrect|not true|false|cap|negative)\b/i,
            existential: /\b(meaning of life|purpose of existence|why are we here|consciousness|reality|philosophy|deep thought)\b/i,
            confirmation: /\b(really|are you sure|for real|seriously|confirm)\b/i,
            confusion: /[?]|(what|huh|i don'?t understand|confused|explain|elaborate)\b/i // Catch lone '?' too
        };
        
        // Check each pattern
        for (const category in patterns) {
            if (patterns[category].test(text)) {
                // Map 'about_creator' back to 'about' for response selection, but prioritize it
                if (category === 'about_creator') return 'about'; 
                return category;
            }
        }
        
        return 'default';
    }

    // Handle mobile keyboard events
    chatInput.addEventListener('focus', () => {
        // Remove any keyboard-open class to prevent unwanted transitions
        chatContainer.classList.remove('keyboard-open');
        
        // Force header and input container to stay visible
        const header = document.querySelector('.chat-header');
        const inputContainer = document.querySelector('.chat-input-container');
        if (header) {
            header.style.transform = 'none';
            header.style.opacity = '1';
        }
        if (inputContainer) {
            inputContainer.style.transform = 'none';
            inputContainer.style.opacity = '1';
        }
        
        // Scroll to bottom after a short delay to ensure the keyboard is fully shown
        setTimeout(() => {
            scrollToBottom();
        }, 100);
    });

    chatInput.addEventListener('blur', () => {
        // Remove keyboard-open class
        chatContainer.classList.remove('keyboard-open');
        
        // Ensure header and input container stay visible
        const header = document.querySelector('.chat-header');
        const inputContainer = document.querySelector('.chat-input-container');
        if (header) {
            header.style.transform = 'none';
            header.style.opacity = '1';
        }
        if (inputContainer) {
            inputContainer.style.transform = 'none';
            inputContainer.style.opacity = '1';
        }
    });

    // For Android devices
    if ('visualViewport' in window) {
        window.visualViewport.addEventListener('resize', () => {
            if (document.activeElement === chatInput) {
                // Force header and input container to stay visible
                const header = document.querySelector('.chat-header');
                const inputContainer = document.querySelector('.chat-input-container');
                if (header) {
                    header.style.transform = 'none';
                    header.style.opacity = '1';
                }
                if (inputContainer) {
                    inputContainer.style.transform = 'none';
                    inputContainer.style.opacity = '1';
                }
                
                // Scroll to bottom after a short delay to ensure the keyboard is fully shown
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
            }
        });
    }

    // Prevent elastic scrolling on iOS
    document.body.addEventListener('touchmove', (e) => {
        if (e.target.closest('.chat-messages')) return;
        e.preventDefault();
    }, { passive: false });

    // Add touch-action manipulation to prevent unwanted behaviors
    document.body.style.touchAction = 'manipulation';
});

// Add this to your HTML
/*
<div class="chat-container">
    <div class="chat-header">
        <h3>AI Chatbot by Bigyan</h3>
    </div>
    <div class="chat-messages"></div>
    <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
    </div>
    <div class="chat-input-container">
        <input type="text" class="chat-input" placeholder="Type your message...">
        <button class="send-button"><i class="fas fa-paper-plane"></i></button>
    </div>
</div>
*/

// Add this to your CSS
/*
.chat-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 500px;
}

.chat-header {
    background: var(--secondary-color);
    color: white;
    padding: 15px;
    text-align: center;
}

.chat-messages {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.chat-message {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    max-width: 80%;
}

.user-message {
    align-self: flex-end;
    flex-direction: row-reverse;
}

.bot-message {
    align-self: flex-start;
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--section-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.user-message .avatar {
    background: var(--secondary-color);
    color: white;
}

.message-content {
    background: var(--section-bg);
    padding: 12px 15px;
    border-radius: 18px;
    position: relative;
}

.user-message .message-content {
    background: var(--secondary-color);
    color: white;
    border-top-right-radius: 5px;
}

.bot-message .message-content {
    border-top-left-radius: 5px;
}

.typing-indicator {
    display: none;
    padding: 10px 20px;
    align-self: flex-start;
}

.typing-indicator span {
    height: 10px;
    width: 10px;
    background: var(--secondary-color);
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
    animation: typing 1s infinite;
}

.typing-indicator span:nth-child(2) {
    animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
    animation-delay: 0.4s;
}

.chat-input-container {
    display: flex;
    padding: 15px;
    border-top: 1px solid #eee;
}

.chat-input {
    flex: 1;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 25px;
    outline: none;
    font-family: inherit;
}

.send-button {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: var(--secondary-color);
    color: white;
    border: none;
    margin-left: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.send-button:hover {
    transform: scale(1.1);
    background: var(--accent-color);
}

.message-animation {
    animation: messageAppear 0.3s ease forwards;
}

@keyframes typing {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    }
}

@keyframes messageAppear {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
*/ 