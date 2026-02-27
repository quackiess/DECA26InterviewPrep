const { useState, useEffect, useRef, useCallback } = React;

// ── Beep generator using Web Audio API ──
function playBeep() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.frequency.value = 880;
        oscillator.type = 'sine';
        gain.gain.value = 0.3;
        oscillator.start();
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        oscillator.stop(ctx.currentTime + 0.15);
    } catch (e) {
        // silent fail if audio context unavailable
    }
}

// ── Question Database: Hard-hitting judge follow-ups ──
// These assume the judge ALREADY heard the full pitch. They probe weaknesses, demand specifics, and challenge assumptions.
const QUESTIONS = {
    andrew: [
        "Your 95.56% filtration rate was tested on one residential machine over 40 cycles. How can you claim that translates to real-world performance across thousands of different washing machine models and water conditions?",
        "You say the filter lasts 50 washes, but what happens to filtration efficiency as the filter clogs? Doesn't performance degrade significantly before replacement, making your average rate misleading?",
        "Marine-grade epoxy and polypropylene are petroleum-based products. How do you reconcile selling an environmental solution that's manufactured from the same fossil fuels causing the problem?",
        "Your closed-loop refurbishment claim of reusing filters six times sounds expensive to execute. What's the actual reject rate during refurbishment, and what happens to filters that fail quality checks?",
        "If a major appliance manufacturer like Samsung decides to build filtration directly into their machines, what stops them from making your product obsolete overnight?",
        "Your app's impact tracker converts microns to plastic bags saved. Who audits those numbers? How do you prevent this from becoming greenwashing if the conversions aren't scientifically rigorous?",
        "You tested 40 wash cycles on one machine. That's one machine, one household's laundry type. What happens with different fabrics, water hardness, or machine types? Does efficiency drop?",
        "You say installation takes under 2 minutes — but if anything goes wrong, who does the customer call? Do you have customer support built out, and what does that cost you?",
        "The foam degrades over time. Have you tested what happens to filtration efficiency at wash cycle 45, 50, 60? What if it drops below the legal requirement?",
        "Your filter is designed for standard drain hoses — what about front-loading machines, which drain differently? That's a huge chunk of the market.",
        "Your patent covers your specific materials. A competitor just uses different foam, gets the same 95%, and sells for $10. What stops them?",
        "Samsung could just buy a small filter company, bundle it into new machines for free, and make you irrelevant. Why won't they?",
        "What happens to your business if a $20 one-time filter with no subscription comes out and hits 94% efficiency? You lose your price advantage and your subscription model simultaneously.",
        "Microfiber regulation is brand new. What if the standard changes — say the law requires 99% filtration instead of 95%? Does your product still comply?",
        "You're planning to patent your design — patents take 2-3 years and cost $15-30K minimum. During that window, you're completely unprotected. What's your strategy while you wait?",
        "In 10 years, washing machines might all have built-in filtration by default. Your entire market disappears. What's the long-term vision beyond that?"
    ],
    david: [
        "You say 45% of American households care about sustainability, but how many would actually spend $22 a year on a product they can't see working? What's your evidence of real purchase intent beyond surveys?",
        "Oregon's law doesn't take effect until 2030. That's years away. What drives sales right now when there's no regulatory urgency pushing consumers to buy?",
        "Micro-influencer marketing sounds great in theory, but sustainability content is oversaturated on TikTok. What's your actual cost per acquisition from influencer campaigns, and how does it compare to paid search?",
        "REI and Patagonia have extremely selective vendor programs and require years of brand credibility. As freshmen in high school, how do you realistically get shelf space within your projected timeline?",
        "Your total addressable market of $1.83 billion assumes every eco-conscious household buys a filter. What's a realistic penetration rate, and how did you validate that number isn't wildly optimistic?",
        "PlanetCare has been in market for years with brand recognition and distribution. If you undercut them on price, what stops them from simply dropping their price to match yours and crushing you with scale?",
        "You say 45% of households are 'eco-conscious' — but caring about the environment and actually spending money on it are very different things. What's your evidence people will actually buy?",
        "'Sarah can't afford $160' — but Sarah also might not spend $15 either if she's never heard of microfibers. How do you create urgency for a problem most people don't know exists?",
        "Your TAM is $1.83 billion — but that assumes every eco-conscious household buys your product. Realistically, what percentage do you actually capture, and is the market still big enough?",
        "Laundromats are a target market, but laundromat owners are notoriously cost-sensitive and slow to adopt new technology. What's your actual evidence they'd pay for this?",
        "You're asking us to fund you to build the closed-loop system. What if a startup with $5M sees your pitch, copies it, and builds it faster than you?",
        "You mention brand partnerships as a revenue stream but never explain it. Who exactly are these partners, what do they pay you, and why would they?",
        "What's the first thing you'll do when we give you the money?"
    ],
    dylan: [
        "Your Year 3 projection of $4.8 million assumes 100,000 customers. That's roughly 550% growth from Year 1. What specific evidence supports that trajectory beyond optimistic assumptions?",
        "You're donating 4% of revenue to Ocean Cleanup while asking investors for $300,000. Shouldn't that capital go toward growth instead of philanthropy at this stage?",
        "Your LTV calculation assumes 3 years of retention at $22 per year. But subscription fatigue is real—what's your projected churn rate, and how did you model it without any actual subscriber data?",
        "At $15 per unit with $9.52 COGS, you're making $5.48 per sale before marketing, shipping, and overhead. After customer acquisition costs, aren't you actually losing money on every hardware sale?",
        "You're valuing the company at $1.36 million pre-money with no revenue, no patent, and a prototype. What comparable companies justify that valuation for a pre-revenue high school startup?",
        "Your closed-loop refurbishment requires reverse logistics—collecting, shipping, cleaning, and redistributing used filters at scale. Have you actually costed this out, or is the $3.06 cartridge cost based on manufacturing alone?",
        "Oregon's law is your biggest selling point to us. What if it never passes — does your whole business fall apart?",
        "Appliance companies like Whirlpool have lobbyists and money. What if they kill the bill before it passes?",
        "Even if Oregon passes it, what if no other state follows? You're now a one-state market.",
        "Your subscription only works if people actually return the filters. What if most people just throw them away? Your whole refurbishment model collapses.",
        "You assume customers renew every year. What's stopping someone from buying once, never subscribing, and just using a cheap Amazon bag filter instead?",
        "You're donating 4% of revenue to Ocean Cleanup. If you're struggling financially, do you cut that — and if so, doesn't that hurt your brand identity?",
        "You're freshmen in high school. An investor is handing you $300K. Why should they trust you to actually execute this over the next 3 years?",
        "You project 100,000 customers by Year 3. You currently have zero. What's your realistic path from 0 to 100K — not the plan, the actual first 100 customers?",
        "Your closed-loop logistics — collecting, cleaning, reusing filters — sounds great on a slide. Have you actually tested what that process costs and how long it takes at scale?",
        "You project a 52.8% ROI over 3 years. That's actually not that impressive for an early-stage startup investment — most investors expect 10x. Why should we take this risk for that return?",
        "Your Year 1 HR cost is $100,000. Who exactly are you paying, and why does a three-person high school startup need $100K in labor in year one?",
        "You say cartridges cost $3.06 to make — but that's at what production volume? At 500 units that number is probably 3x higher. Have you actually gotten manufacturer quotes?",
        "Your $300K ask covers patents, R&D, molding, marketing, and logistics. That's a lot of buckets — if one runs over budget, which do you cut first?",
        "If this investment doesn't work out and Purifiber fails, what happens to the $300K? Is there any asset value, or does it just disappear?"
    ]
};

// ── AI Recommended Answers (formal, specific, data-backed) ──
const AI_ANSWERS = {
    andrew: [
        "That's a fair concern, and we're transparent that our testing began on a single residential model. However, our dual-filtration design is machine-agnostic—it attaches to the drain hose externally, not internally. Water pressure and temperature variations don't meaningfully affect mechanical filtration through 25-micron mesh. Our next phase with the funding includes third-party lab testing across multiple machine types to validate this. The 95.56% is our starting benchmark, not our final claim.",
        "Filtration efficiency does decline as the filter accumulates fibers—that's true of every filtration product. Our data shows efficiency stays above 93% through all 50 cycles, which is why we report the average. The quarterly replacement schedule is designed so customers swap well before meaningful degradation. We're also exploring a visual indicator on the filter housing so users know exactly when to replace.",
        "You're right that our current materials are petroleum-derived. We chose them because they're proven, durable, and don't leach microplastics themselves. The net environmental math still overwhelmingly favors our product—one small filter housing prevents millions of microfibers from entering oceans over its 10-year lifespan. Long-term, our R&D roadmap includes bio-based polymer alternatives as those materials mature commercially.",
        "In our initial refurbishment testing, we saw roughly a 15% reject rate per cycle, primarily due to mesh integrity. Rejected filters are fully recycled rather than landfilled. Even at 15% rejection, getting 5 to 6 uses per filter dramatically reduces our effective COGS. The refurbishment infrastructure cost is built into our $300K funding ask—$60K is allocated specifically to distribution and reverse logistics.",
        "Built-in filtration would actually validate our market, not destroy it. There are 133 million existing washing machines in the US that won't be replaced overnight. Even if Samsung adds filtration tomorrow, the retrofit market for existing machines is enormous. We'd also position ourselves as the OEM filtration supplier for manufacturers who want to add filtration without redesigning their machines—that's our B2B play.",
        "The conversion methodology is based on published research from the Ocean Conservancy and Plymouth University, which established average microfiber counts per wash cycle. We use conservative estimates—we round down, not up. Before scaling, we intend to have our methodology reviewed by an independent environmental consultancy. Transparency is core to our brand; if customers don't trust the numbers, the entire model fails.",
        "Our 40-cycle test used varied fabric types including cotton, polyester, and blended synthetics — the most common household laundry mix. Water hardness affects mineral buildup, not filtration efficiency, and our marine-grade epoxy housing is specifically resistant to that. We haven't tested every machine model, which is why we're allocating R&D funding to expand testing across top-10 machine brands. Our 95.56% figure is a conservative average across varied conditions, not a best-case result.",
        "Year 1 support is handled directly by our team through email and a Shopify integrated chat system — that's built into the $100K HR budget. As we scale, we move to a tiered FAQ and chatbot system for common issues, with human escalation for hardware problems. Our installation is deliberately designed to be two-step and foolproof, which minimizes support volume. The universal connector handles 95% of standard hose diameters, and we include an adapter kit for edge cases.",
        "Our replacement cycle is set at 50 washes specifically because we tested degradation and found efficiency stays above 93% through cycle 50. The legal threshold in Oregon's current bill is 90%. We have a 3+ point buffer even at end-of-life. The app tracks wash cycles and prompts replacement before degradation becomes a compliance issue, so customers are never unknowingly running a non-compliant filter.",
        "Front-loaders are about 30% of the US market and drain through a pump rather than gravity, which changes the installation point. Our current universal connector is designed for top-loaders. Front-loader compatibility is a Year 2 product development priority — it's in our R&D roadmap and part of why we're asking for funding. We're not ignoring that market, we're sequencing it. Launching with top-loaders first lets us validate the model before expanding.",
        "A cheaper hardware unit doesn't kill us because we're not primarily a hardware company — we're a subscription and closed-loop system. A $10 disposable filter with no return program, no app, no refurbishment infrastructure, and no brand trust is a fundamentally different product. Our moat deepens over time: the more subscribers we have, the more efficient our logistics become, the lower our COGS drop, and the stronger our data and brand loyalty get. A new entrant starts from zero on all of that.",
        "That only matters for people buying a new washing machine. There are 133 million existing US households with machines that have no filtration whatsoever. A new washing machine costs $800 minimum — nobody replaces a working appliance just to get a microfiber filter. We're serving the retrofit market, which is the overwhelming majority of households and will remain so for decades. Samsung building filtration into new machines actually validates our market and increases consumer awareness — which drives more people to us for their existing machines.",
        "A disposable filter at 94% with no closed-loop system is actually worse for the environment — the captured fibers go straight to landfill. Our closed-loop model is a genuine differentiator for the eco-conscious buyer who is specifically trying to avoid that outcome. We'd also respond by lowering our hardware price further, since our real margin is in subscriptions. And a $20 disposable means the customer is spending $20 every 10 weeks — $104 a year versus our $22. We win on price over time even if we lose on upfront cost.",
        "Our two-stage system currently hits 95.56%. Getting to 99% would require a third filtration stage or a finer mesh, both of which we've prototyped. It's an engineering problem we know how to solve — it's not a fundamental redesign. R&D funding covers exactly this kind of iteration. We're already testing a 10-micron secondary bag that pushes efficiency above 98% in preliminary trials.",
        "We file a provisional patent immediately, which costs around $1,500 and gives us 12 months of 'patent pending' protection and a priority date. That blocks competitors from filing the same claims after us. During that window, our real protection is speed — we're building customer relationships, logistics infrastructure, and brand recognition that are harder to copy than a product design. By the time a competitor could reverse-engineer and manufacture at scale, we're already established.",
        "That's actually our exit scenario, not our threat. If LG or Samsung wants to license our closed-loop refurbishment system and app infrastructure for their built-in filters, that's an acquisition or licensing deal worth significantly more than our current valuation. We're not just building a filter — we're building the data, logistics, and brand infrastructure around microfiber capture. That has value to manufacturers regardless of where the filter physically sits."
    ],
    david: [
        "Survey data alone wouldn't convince us either. What gives us confidence is behavioral evidence: the microfiber filter market has grown 340% since 2020 despite high prices. PlanetCare has sold units at $129 with no regulatory pressure. Our thesis is that price is the barrier, not intent. At $15—the cost of a bottle of premium detergent—we're removing the friction that's kept the other 90% of interested consumers on the sidelines.",
        "Three things drive near-term sales. First, the legislation is already creating media coverage and consumer awareness now—people are searching for solutions today. Second, California and New York are moving on similar bills, which creates urgency beyond Oregon. Third, we don't need regulatory pressure for our core demographic. Eco-conscious Gen Z consumers buy reusable straws and compostable phone cases without any mandate. We just need to reach them affordably.",
        "We've modeled influencer CAC at $6 to $8 per customer based on benchmarks from comparable D2C sustainability brands like Blueland and LastObject. Paid search will likely run $4 to $5 for high-intent keywords. Our blended target CAC is $4.67. We'll test both channels in the first 90 days and reallocate budget toward whichever performs. The advantage of micro-influencers is their 3 to 5x higher engagement rate than macro accounts.",
        "You're absolutely right—we won't walk into REI in Year 1. Our retail timeline is Year 2 to 3, after we've built D2C traction and customer proof points. The initial strategy is purely online sales and subscription building. Once we have 10,000-plus subscribers and verified impact data, we have a compelling pitch for retail buyers. Patagonia in particular has a vendor program specifically for early-stage environmental products.",
        "Our $1.83 billion TAM is a ceiling, not a forecast. Our realistic serviceable obtainable market is much smaller—we're targeting 100,000 customers by Year 3, which represents less than 0.1% of US households. That's conservative. Penetration rates for successful D2C sustainability products typically reach 0.5 to 1% of their addressable market within 5 years. We're projecting well below that.",
        "PlanetCare's cost structure makes a price drop very difficult. Their cartridge-based system requires injection-molded proprietary parts and individual shipping. Our dual-filtration approach uses commodity materials—foam and mesh—at fundamentally lower costs. Even if they cut prices 50%, they'd still be 4x more expensive than us. Their moat is brand recognition; ours is unit economics. We can profitably operate at price points they simply cannot match.",
        "$15 is below the psychological purchase threshold for most consumers — it's an impulse buy, not a considered purchase. We're not asking eco-conscious buyers to sacrifice anything. We're giving them an easy, cheap way to act on values they already have. The data backs this up: the reusable bag market grew 15% year over year despite being a purely discretionary purchase. Consumers absolutely do spend money on sustainability when the price point is right, and ours is engineered specifically to sit below every friction point.",
        "We don't need people to already know about microfibers — we need them to care once they find out. And the content practically writes itself: 'every load of laundry dumps 18 million plastic fibers into the ocean' is a shocking, shareable fact. Our TikTok strategy is built around exactly this kind of awareness content — showing the problem visually, then immediately presenting the $15 solution. We're not just selling a product, we're creating the market. That's actually a competitive advantage — we get to define the category before anyone else does.",
        "Our Year 3 target of 100,000 customers represents about 0.16% of eco-conscious US households. That's not an aggressive number — that's an extremely conservative one. We don't need to dominate the market to return your investment. Even at 0.1% penetration our financials work. The TAM figure validates that the opportunity is large enough to scale into, not that we're assuming we'll capture all of it.",
        "Laundromats that can advertise 'ocean-friendly filtration' have a concrete marketing differentiator in a commoditized industry where every machine basically does the same thing. We've spoken to laundromat operators who confirmed that sustainability branding attracts younger customers and justifies slightly higher prices per load. Our B2B pricing is also structured for low friction — bulk pricing with volume discounts that make the per-machine cost negligible relative to the marketing value they get.",
        "By the time a copycat raises money, hires a team, designs a product, files patents, builds logistics, and acquires customers — we already have all of that. First mover advantage in a subscription business is compounding: our customers are locked in, our refurbishment costs are dropping with scale, and our brand is established. They'd have to spend significantly more than us to acquire the same customers we already have. And our patent directly forces them to design around our specific system, which costs them time and money we're not spending.",
        "Brands like Patagonia, Seventh Generation, and method cleaning products are actively looking for co-marketing opportunities that align with their sustainability values. We offer them placement in our app, co-branding on packaging, and access to a verified eco-conscious customer base. They pay a flat sponsorship fee or revenue share. We haven't signed anyone yet — this is a Year 2 revenue stream — but we have warm conversations with two sustainability brands through connections from our school's entrepreneurship program.",
        "The very first thing we do is file a provisional patent application — that's $1,500 and gives us immediate 'patent pending' status and priority protection. Day two, we finalize our injection mold design specs and put a deposit down with our selected manufacturer to lock in production timeline. Week one, we launch our first TikTok campaign with three micro-influencers we've already identified to start building brand awareness and collecting early email signups. Everything else builds from those three anchors: legal protection, manufacturing pipeline, and customer acquisition momentum."
    ],
    dylan: [
        "The growth trajectory is steep, but it's driven by specific catalysts. Year 1 is pure D2C with controlled ad spend—15,000 customers. Year 2 we add retail distribution and B2B, which are multipliers on our base. Year 3, Oregon's legislation deadline creates a demand surge. Each phase has its own growth driver, not just extrapolated curves. We also modeled a conservative scenario at 60,000 Year 3 customers that still returns positive ROI for investors.",
        "The donation is strategic, not charitable. Our $1 per customer donation to Ocean Cleanup generates a tax deduction, but more importantly it's a retention tool. Customers who see their money funding real cleanup efforts have significantly higher renewal rates in comparable subscription models. At $21,000 in Year 1, it's 4% of revenue but potentially saves us 10 to 15% in churn-related losses. It pays for itself.",
        "We've modeled churn at 18% annually, which is conservative—the average subscription box churn is 10 to 14% monthly. Our product is different because it's a recurring need, not a discretionary purchase. You can't stop doing laundry. Our app gamification and Ocean Cleanup donations are designed to reduce churn further, but even at 18% annual churn, our 3-year LTV holds. Without actual subscriber data, we stress-tested at 25% churn and still maintain a 9:1 LTV-to-CAC ratio.",
        "You're right that hardware margins are thin after fully-loaded costs. The $15 unit is intentionally a loss leader—we break even or lose $1 to $2 per unit after acquisition costs. But each unit creates a subscriber worth $18.94 in gross profit per year for 3-plus years. It's the razor-and-blade model. Amazon loses money on every Kindle sold. The first cartridge free offer accelerates the transition from hardware buyer to recurring subscriber.",
        "Our valuation is based on comparable pre-revenue hardware-subscription companies in the sustainability space. Blueland raised at $3 million pre-money at a similar stage. We're actually asking for a lower valuation. We also have a working prototype with verified performance data, a defined regulatory tailwind, and a clear path to revenue—that's more than most pre-revenue startups at this stage. The 52.8% projected ROI over 3 years speaks to the value creation.",
        "The $3.06 includes manufacturing and materials only—you're correct to probe that. Reverse logistics adds approximately $2.10 per cycle: $0.85 for prepaid return shipping using our collapsible filter design, $0.75 for cleaning and quality control labor, and $0.50 for repackaging. Fully loaded, each refurbished cartridge costs $5.16, still giving us 77% gross margin on the $22 subscription. We've costed this with quotes from two fulfillment partners.",
        "The law is a tailwind, not our lifeline. 45% of American households already identify as eco-conscious and are actively searching for affordable sustainability solutions. Microplastics are in the news constantly — awareness is growing with or without legislation. Our D2C strategy targets those buyers right now through TikTok, Google ads, and sustainability influencers. The law just creates a deadline that forces the other 55% to care too. Without it, we grow slower — but we still grow, because the problem is real and our price point removes the biggest barrier to entry.",
        "Appliance manufacturers lobbying against this bill would actually hurt their own reputation. Sustainability is a massive marketing advantage right now — LG and Samsung are already advertising eco-friendly features. Fighting a filter law publicly would be a PR disaster for them. And even if they slow it down domestically, the EU already mandates microfiber filters on all new machines sold after 2025. That pressure is coming to the US regardless of any single state bill, and we're building our infrastructure now so we're ready when it does.",
        "Oregon alone has 1.7 million households — that's already a real, addressable market. But we're not a Oregon-only company. Our entire D2C strategy is national from day one. We're running Google and TikTok ads to eco-conscious buyers across the country who don't need a law to motivate them. The legislation is a conversion accelerator for the undecided buyer — it's not what gets us our first 15,000 customers. Those come from people who already care.",
        "That's exactly why we designed the deposit system the way we did. Customers pay a $2 deposit upfront. When they return the filter, they get $1 back plus a $1 donation to Ocean Cleanup in their name. That's a financial incentive plus an emotional one. Based on comparable deposit return programs — like bottle deposits in Michigan which hit 97% return rates — we're projecting 70% returns. Even at 50% returns, our refurbishment model still works because we've priced the economics conservatively. The customers who don't return are essentially subsidizing a new unit, which we've accounted for in COGS.",
        "The filter bag physically degrades after 50 washes — roughly 10 weeks at average usage. After that, filtration efficiency drops significantly and the product just stops working properly. It's not like a gym membership where you can ignore it — a degraded filter is visibly dirty and noticeably less effective. The app also sends replacement reminders tied to wash cycle tracking, so customers know exactly when performance is dropping. And with cartridges at $22 a year, the friction to resubscribe is extremely low. We're not asking people to re-decide — we're making renewal the obvious default.",
        "We've built the donation into our unit economics from the start — it's not a discretionary expense that gets added when times are good. At $1 per returned filter, it scales with our volume, not against our margins. If we're struggling financially, that means our return volume is low, which means the donation is also low and the impact on cash flow is minimal. It's also a core part of our brand identity — cutting it would hurt customer trust and retention far more than the dollar amount would help our balance sheet. We'd sooner cut marketing spend.",
        "Because we've already done things most adult startups haven't at this stage. Andrew built a working prototype, ran 40 wash cycles of controlled lab testing, and achieved 95.56% filtration efficiency — that's real engineering, not a concept. Dylan built a three-year financial model with unit economics, COGS breakdowns, and ROI projections. David developed a full go-to-market strategy with customer personas and channel analysis. We're not asking you to bet on potential — we're asking you to bet on demonstrated execution. The question isn't our age, it's whether the work is credible. We think it is.",
        "Our first 100 customers come from our personal networks, local sustainability communities, and targeted TikTok content — zero ad spend. We use those early customers to collect testimonials, refine messaging, and prove retention. Then we turn on paid acquisition with a proven conversion funnel. Year 1 goal is 15,000 customers at a $4.67 CAC through Google and TikTok ads. Year 2 we add retail placement at REI and Home Depot, which are passive distribution multipliers that don't require us to actively acquire every customer. Year 3, the Oregon deadline creates urgency and a media cycle we ride for essentially free. Each phase has a different growth driver — it's not just one straight line up.",
        "We've tested the filtration and refurbishment chemistry at small scale — the foam and polypropylene break down cleanly through the process we've designed. We haven't run full logistics at scale yet, which is part of what this funding covers. But we've mapped the cost structure: because the filter collapses to a small form factor, return shipping fits in a standard poly mailer under $4. Cleaning and reprocessing at volume drops below $1 per unit. We've built those numbers into our Year 2 COGS, not Year 1 projections, so we're not assuming efficiency we haven't proven yet.",
        "That's our base case, not our upside. If Oregon's legislation passes and even one additional state follows, our Year 3 revenue roughly doubles, and your return does too. We modeled conservatively on purpose — we'd rather under-promise and over-deliver than pitch you a 10x that depends on everything going perfectly. The 52.8% is what happens if we execute moderately well in a market with no legislative tailwind. The upside case with two or three state mandates is significantly higher.",
        "That covers a part-time operations manager to handle logistics and customer service, a contract engineer for injection mold tooling oversight, and a part-time marketing contractor for content production. None of us can legally work full-time hours as minors, so we need adult operators for day-to-day execution. That's a real cost we're being transparent about rather than hiding it in a line item called 'miscellaneous.'",
        "We got quotes from two contract manufacturers for polypropylene filter bags at 10,000 unit volumes — $2.84 and $3.21, which averages to roughly $3.06. At lower volumes like 500 units it's closer to $5-6, which is why Year 1 margins are lower and improve as we scale. We're not using idealized numbers — we're using actual manufacturer quotes and building in volume scaling assumptions that are clearly labeled in our financial model.",
        "Marketing is the most flexible line. Patents and injection molding are fixed costs we can't defer without killing the business, and R&D is what makes the product work. If we need to cut, we reduce paid ad spend and lean harder into organic TikTok and influencer partnerships, which have lower CAC anyway. We've modeled a scenario where we cut marketing by 40% and still hit 60,000 Year 3 customers through organic and retail channels alone.",
        "Roughly $120K goes to hard assets: injection molds, lab equipment, and patent filings — all of which have resale or licensing value. The rest goes to operations and marketing, which are spent. We're being honest: most of the $300K is not recoverable if we fail. That's true of most early-stage investments. What we can tell you is that we've structured spending to hit proof-of-concept milestones early — by month 6, you'll know whether the core model is working before the majority of capital is deployed."
    ]

};

// ── App Component ──
function App() {
    const [screen, setScreen] = useState('role');
    const [selectedRole, setSelectedRole] = useState(null);
    const [questionsPerSession, setQuestionsPerSession] = useState(3);
    const [showAIBetween, setShowAIBetween] = useState(true);
    const [sessionData, setSessionData] = useState([]);

    const e = React.createElement;

    return e('div', null,
        e('div', { className: 'container' },
            screen === 'role' && e(RoleSelection, {
                onSelectRole: (role, questionCount) => {
                    setSelectedRole(role);
                    setQuestionsPerSession(questionCount);
                    setScreen('practice');
                }
            }),
            screen === 'practice' && e(PracticeSession, {
                role: selectedRole,
                questionsPerSession: questionsPerSession,
                showAIBetween: showAIBetween,
                onToggleAI: () => setShowAIBetween(!showAIBetween),
                onComplete: (data) => {
                    setSessionData(data);
                    setScreen('report');
                },
                onBack: () => setScreen('role')
            }),
            screen === 'report' && e(SessionReport, {
                role: selectedRole,
                sessionData: sessionData,
                onRestart: () => {
                    setScreen('role');
                    setSessionData([]);
                    setSelectedRole(null);
                }
            })
        )
    );
}

// ── Role Selection ──
function RoleSelection({ onSelectRole }) {
    const e = React.createElement;
    const [questionCount, setQuestionCount] = useState(3);

    const roles = [
        { id: 'andrew', name: 'Andrew', title: 'Chief Technology Officer', icon: 'CTO' },
        { id: 'david', name: 'David', title: 'Chief Marketing Officer', icon: 'CMO' },
        { id: 'dylan', name: 'Dylan', title: 'Chief Financial Officer', icon: 'CFO' }
    ];

    return e('div', { className: 'role-selection' },
        e('div', { className: 'logo-header' },
            e('div', { className: 'logo-title' }, 'Purifiber Practice'),
            e('div', { className: 'logo-subtitle' }, 'DECA Interview Training')
        ),
        e('div', { className: 'question-count-selector' },
            e('div', { className: 'selector-label' }, 'Questions per session:'),
            e('div', { className: 'selector-buttons' },
                [2, 3, 4, 5, 6].map(count =>
                    e('button', {
                        key: count,
                        className: 'count-button' + (questionCount === count ? ' active' : ''),
                        onClick: () => setQuestionCount(count)
                    }, count)
                )
            )
        ),
        e('div', { className: 'role-cards' },
            roles.map(role =>
                e('div', {
                    key: role.id,
                    className: 'role-card',
                    onClick: () => onSelectRole(role.id, questionCount)
                },
                    e('div', { className: 'role-icon' }, role.icon),
                    e('div', { className: 'role-info' },
                        e('div', { className: 'role-name' }, role.name),
                        e('div', { className: 'role-title' }, role.title)
                    ),
                    e('div', { className: 'role-arrow' }, '\u2192')
                )
            )
        )
    );
}

// ── Practice Session ──
function PracticeSession({ role, questionsPerSession, showAIBetween, onToggleAI, onComplete, onBack }) {
    const e = React.createElement;

    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(25);
    const [isRecording, setIsRecording] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [recordings, setRecordings] = useState([]);
    const [showAIAnswer, setShowAIAnswer] = useState(false);
    const [lastBeepTime, setLastBeepTime] = useState(-1);

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const recordingsRef = useRef([]);

    // Initialize random question selection
    useEffect(() => {
        const allQuestions = QUESTIONS[role];
        const allAnswers = AI_ANSWERS[role];
        const indices = [...Array(allQuestions.length).keys()];

        // Shuffle and pick questionsPerSession items
        for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
        }

        const selectedIndices = indices.slice(0, questionsPerSession);
        setSelectedQuestions(selectedIndices.map(i => allQuestions[i]));
        setSelectedAnswers(selectedIndices.map(i => allAnswers[i]));
    }, [role, questionsPerSession]);

    const questions = selectedQuestions;
    const answers = selectedAnswers;

    useEffect(() => {
        recordingsRef.current = recordings;
    }, [recordings]);

    useEffect(() => {
        if (questions.length > 0) {
            speakQuestion(questions[0]);
        }
        return () => speechSynthesis.cancel();
    }, [questions]);

    useEffect(() => {
        if (hasStarted && timeLeft > 0) {
            if (timeLeft <= 5 && timeLeft !== lastBeepTime) {
                playBeep();
                setLastBeepTime(timeLeft);
            }
            timerRef.current = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (hasStarted && timeLeft === 0) {
            handleQuestionComplete();
        }
        return () => clearTimeout(timerRef.current);
    }, [hasStarted, timeLeft]);

    const speakQuestion = (question) => {
        speechSynthesis.cancel();
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(question);
        utterance.rate = 0.95;
        utterance.pitch = 1;
        utterance.onend = () => {
            setIsSpeaking(false);
            setTimeout(() => startRecording(), 400);
        };
        speechSynthesis.speak(utterance);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (evt) => {
                chunksRef.current.push(evt.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                const newRecording = {
                    question: questions[currentQuestion],
                    answer: answers[currentQuestion],
                    audioUrl: url
                };
                setRecordings(prev => {
                    const updated = [...prev, newRecording];
                    recordingsRef.current = updated;
                    return updated;
                });
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setHasStarted(true);
            setLastBeepTime(-1);
        } catch (err) {
            console.error('Mic error:', err);
            alert('Please allow microphone access to record your answers.');
        }
    };

    const handleQuestionComplete = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
            setIsRecording(false);
        }

        if (showAIBetween) {
            setShowAIAnswer(true);
        } else {
            moveToNext();
        }
    };

    const moveToNext = () => {
        setShowAIAnswer(false);
        const nextIndex = currentQuestion + 1;
        if (nextIndex < questions.length) {
            setCurrentQuestion(nextIndex);
            setTimeLeft(25);
            setHasStarted(false);
            setLastBeepTime(-1);
            setTimeout(() => speakQuestion(questions[nextIndex]), 400);
        } else {
            // Small delay to let last recording finish
            setTimeout(() => {
                onComplete(recordingsRef.current);
            }, 300);
        }
    };

    // Don't render until questions are loaded
    if (questions.length === 0) {
        return e('div', { className: 'practice-session' },
            e('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 } },
                e('div', { style: { color: 'var(--text-secondary)' } }, 'Loading...')
            )
        );
    }

    const roleName = role === 'andrew' ? 'Andrew \u2013 CTO' : role === 'david' ? 'David \u2013 CMO' : 'Dylan \u2013 CFO';
    const radius = 54;
    const circumference = 2 * Math.PI * radius;

    if (showAIAnswer) {
        return e('div', { className: 'practice-session' },
            e('div', { className: 'session-header' },
                e('div', { className: 'header-left' },
                    e('div', { className: 'role-badge' }, roleName)
                ),
                e('div', { className: 'progress-indicator' },
                    e('span', { className: 'progress-current' }, currentQuestion + 1), ' / ', questions.length
                )
            ),
            e('div', { className: 'session-body' },
                e('div', { className: 'question-card report-ai-card' },
                    e('div', { className: 'question-number' }, 'Recommended Response'),
                    e('div', { className: 'question-text', style: { fontSize: '16px', marginBottom: '16px' } },
                        questions[currentQuestion]
                    ),
                    e('div', { className: 'ai-answer' },
                        e('div', { className: 'ai-answer-header' }, 'Suggested Answer'),
                        e('div', { className: 'ai-answer-text' }, answers[currentQuestion])
                    ),
                    e('div', { style: { marginTop: '20px', textAlign: 'center' } },
                        e('button', { className: 'primary-button', onClick: moveToNext },
                            currentQuestion < questions.length - 1 ? 'Next Question \u2192' : 'View Report'
                        )
                    )
                )
            )
        );
    }

    return e('div', { className: 'practice-session' },
        // Header
        e('div', { className: 'session-header' },
            e('div', { className: 'header-left' },
                e('button', { className: 'back-button', onClick: onBack }, '\u2190 Back'),
                e('div', { className: 'role-badge' }, roleName)
            ),
            e('div', { className: 'progress-indicator' },
                e('span', { className: 'progress-current' }, currentQuestion + 1), ' / ', questions.length
            )
        ),
        // Toggle
        e('div', { className: 'settings-toggle' },
            e('div', { className: 'toggle-row' },
                e('div', { className: 'toggle-label' }, 'Show AI answers between questions'),
                e('div', {
                    className: 'toggle-switch' + (showAIBetween ? ' active' : ''),
                    onClick: onToggleAI
                },
                    e('div', { className: 'toggle-knob' })
                )
            )
        ),
        // Body: question + timer + recording in one view
        e('div', { className: 'session-body' },
            e('div', { className: 'question-card' },
                e('div', { className: 'question-number' }, 'Question ' + (currentQuestion + 1)),
                e('div', { className: 'question-text' }, questions[currentQuestion])
            ),
            e('div', { className: 'timer-container' },
                e('div', { className: 'timer-circle' },
                    e('svg', { className: 'timer-svg', width: 120, height: 120 },
                        e('circle', { className: 'timer-track', cx: 60, cy: 60, r: radius }),
                        e('circle', {
                            className: 'timer-progress' + (timeLeft <= 5 ? ' warning' : ''),
                            cx: 60, cy: 60, r: radius,
                            strokeDasharray: circumference,
                            strokeDashoffset: circumference * (1 - timeLeft / 25)
                        })
                    ),
                    isSpeaking
                        ? e('div', { className: 'timer-text listening' }, 'Listen to interviewer...')
                        : e('div', { className: 'timer-text' + (timeLeft <= 5 ? ' warning' : '') }, timeLeft)
                ),
                e('div', { className: 'timer-side' },
                    isRecording && e('div', { className: 'recording-indicator' },
                        e('div', { className: 'recording-dot' }),
                        e('div', { className: 'recording-text' }, 'REC')
                    ),
                    isRecording && e(Waveform, null)
                )
            )
        )
    );
}

// ── Waveform ──
function Waveform() {
    const e = React.createElement;
    const [bars, setBars] = useState(Array(16).fill(0));

    useEffect(() => {
        const interval = setInterval(() => {
            setBars(Array(16).fill(0).map(() => Math.random() * 32 + 8));
        }, 120);
        return () => clearInterval(interval);
    }, []);

    return e('div', { className: 'waveform' },
        bars.map((h, i) => e('div', { key: i, className: 'waveform-bar', style: { height: h + 'px' } }))
    );
}

// ── Session Report ──
function SessionReport({ role, sessionData, onRestart }) {
    const e = React.createElement;
    const [playingIndex, setPlayingIndex] = useState(null);
    const audioRefs = useRef([]);

    const handlePlay = (index) => {
        if (playingIndex !== null && playingIndex !== index) {
            audioRefs.current[playingIndex] && audioRefs.current[playingIndex].pause();
        }
        if (playingIndex === index) {
            audioRefs.current[index] && audioRefs.current[index].pause();
            setPlayingIndex(null);
        } else {
            audioRefs.current[index] && audioRefs.current[index].play();
            setPlayingIndex(index);
        }
    };

    const roleName = role === 'andrew' ? 'Andrew \u2013 CTO' : role === 'david' ? 'David \u2013 CMO' : 'Dylan \u2013 CFO';

    return e('div', { className: 'report-view' },
        e('div', { className: 'report-header' },
            e('div', { className: 'report-title' }, 'Session Complete'),
            e('div', { className: 'report-subtitle' }, 'Review your answers as ' + roleName)
        ),
        sessionData.map((item, index) =>
            e('div', { key: index, className: 'report-item' },
                e('div', { className: 'report-question-label' }, 'Question ' + (index + 1)),
                e('div', { className: 'report-question-text' }, item.question),
                e('div', { className: 'audio-player' },
                    e('div', { className: 'audio-header' }, 'Your Recording'),
                    e('div', { className: 'audio-controls' },
                        e('button', {
                            className: 'play-button',
                            onClick: () => handlePlay(index)
                        }, playingIndex === index ? '\u23F8' : '\u25B6'),
                        e('div', { className: 'audio-progress' },
                            e('div', { className: 'audio-progress-bar' })
                        ),
                        e('audio', {
                            ref: (el) => { audioRefs.current[index] = el; },
                            src: item.audioUrl,
                            onEnded: () => setPlayingIndex(null)
                        })
                    )
                ),
                e('div', { className: 'ai-answer' },
                    e('div', { className: 'ai-answer-header' }, 'Recommended Answer'),
                    e('div', { className: 'ai-answer-text' }, item.answer)
                )
            )
        ),
        e('div', { className: 'report-actions' },
            e('button', { className: 'primary-button', onClick: onRestart }, 'Practice Again')
        )
    );
}

// ── Render ──
ReactDOM.render(React.createElement(App), document.getElementById('root'));
