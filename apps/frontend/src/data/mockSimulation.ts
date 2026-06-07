import type {
  BenchmarkPayload,
  EventEnvelope,
  RedFlagPayload,
  SynthesisCompletedPayload,
  SynthesisSegmentPayload
} from "../lib/agui";

const runId = "run:mock:dobbs_2022";
const timestamp = "2026-06-06T20:45:12Z";

const reactions = [
  {
    persona_id: "maria_milwaukee",
    persona_name: "Maria",
    age: 52,
    location: "Suburban Milwaukee, WI",
    occupation: "Union electrician",
    segment_tags: ["suburban_women", "working_class", "union_household"],
    provider: "anthropic",
    model_used: "claude-haiku-4-5-20251001",
    reaction_text:
      "I am furious. This feels like politicians decided my daughter's future for her, and I do not trust my state legislature to protect women.",
    voter_voice_quote: "I never thought my daughter would grow up with fewer rights than I had.",
    latency_ms: 1320
  },
  {
    persona_id: "raymond_georgia",
    persona_name: "Raymond",
    age: 64,
    location: "Rural Valdosta, GA",
    occupation: "Retired postal worker",
    segment_tags: ["black_voters", "older_voters", "rural_voters"],
    provider: "openai",
    model_used: "gpt-4o-mini",
    reaction_text:
      "I do not like the government stepping between families and doctors. This feels especially dangerous for women who already have a harder time getting quality care.",
    voter_voice_quote: "I trust my daughters more than I trust politicians.",
    latency_ms: 1180
  },
  {
    persona_id: "destiny_atlanta",
    persona_name: "Destiny",
    age: 24,
    location: "Urban Atlanta, GA",
    occupation: "Graduate student",
    segment_tags: ["young_voters", "black_voters", "college_educated", "urban_voters"],
    provider: "gemini",
    model_used: "gemini-2.5-flash",
    reaction_text:
      "This makes me feel like basic rights can disappear overnight. I would be more motivated to vote, protest, and push my friends to pay attention.",
    voter_voice_quote: "If rights can be taken away, sitting out is not an option.",
    latency_ms: 1425
  },
  {
    persona_id: "linda_phoenix",
    persona_name: "Linda",
    age: 46,
    location: "Suburban Phoenix, AZ",
    occupation: "Real estate agent",
    segment_tags: ["suburban_women", "moderate_republicans", "college_educated"],
    provider: "anthropic",
    model_used: "claude-haiku-4-5-20251001",
    reaction_text:
      "I am Republican on taxes and schools, but this feels too intrusive. I do not want the state making emergency medical decisions for my daughters.",
    voter_voice_quote: "This is exactly the kind of government overreach I worry about.",
    latency_ms: 1535
  },
  {
    persona_id: "caleb_lubbock",
    persona_name: "Caleb",
    age: 38,
    location: "Rural Lubbock, TX",
    occupation: "Oil field technician",
    segment_tags: ["rural_men", "evangelicals", "republican_base", "working_class"],
    provider: "openai",
    model_used: "gpt-4o-mini",
    reaction_text:
      "I support the decision because states should be able to set their own rules. I still think lawmakers need exceptions that make sense for real medical emergencies.",
    voter_voice_quote: "Let the states decide, but do not make doctors afraid to save lives.",
    latency_ms: 1095
  },
  {
    persona_id: "anne_des_moines",
    persona_name: "Anne",
    age: 59,
    location: "Suburban Des Moines, IA",
    occupation: "Clinic billing manager",
    segment_tags: ["suburban_women", "independents", "healthcare_workers"],
    provider: "gemini",
    model_used: "gemini-2.5-flash",
    reaction_text:
      "Working around healthcare makes me worry about delays, paperwork, and doctors hesitating. The people who will suffer most are not the people writing these laws.",
    voter_voice_quote: "Medical care should not depend on a lawyer reading the chart first.",
    latency_ms: 1288
  },
  {
    persona_id: "javier_las_vegas",
    persona_name: "Javier",
    age: 33,
    location: "Urban Las Vegas, NV",
    occupation: "Hotel shift supervisor",
    segment_tags: ["latino_voters", "service_workers", "urban_voters", "independents"],
    provider: "openrouter",
    model_used: "openai/gpt-4o-mini",
    reaction_text:
      "I am mostly focused on rent and jobs, but this still hits home because it affects sisters, coworkers, and families. It makes politics feel more personal.",
    voter_voice_quote: "This is not abstract when the women around you are scared.",
    latency_ms: 1712
  },
  {
    persona_id: "tanya_detroit",
    persona_name: "Tanya",
    age: 41,
    location: "Urban Detroit, MI",
    occupation: "Auto plant team lead",
    segment_tags: ["black_voters", "working_class", "union_household", "urban_voters"],
    provider: "anthropic",
    model_used: "claude-haiku-4-5-20251001",
    reaction_text:
      "I see this as another way working women get squeezed. People with money will travel, and everybody else will be stuck with the consequences.",
    voter_voice_quote: "The rules always land hardest on women with the fewest options.",
    latency_ms: 1370
  },
  {
    persona_id: "ethan_boulder",
    persona_name: "Ethan",
    age: 29,
    location: "Suburban Boulder, CO",
    occupation: "Climate data analyst",
    segment_tags: ["young_voters", "college_educated", "progressives", "suburban_voters"],
    provider: "openai",
    model_used: "gpt-4o-mini",
    reaction_text:
      "The decision makes me question the legitimacy of institutions that felt settled. It reinforces my sense that courts, democracy, and civil rights are all connected.",
    voter_voice_quote: "This feels like a warning shot for every other right.",
    latency_ms: 1202
  },
  {
    persona_id: "brenda_erie",
    persona_name: "Brenda",
    age: 67,
    location: "Suburban Erie, PA",
    occupation: "Retired diner owner",
    segment_tags: ["older_voters", "republican_base", "small_business"],
    provider: "gemini",
    model_used: "gemini-2.5-flash",
    reaction_text:
      "I think the court put the issue back where voters can decide it. I do not like the anger around it, but I agree with letting states make their own laws.",
    voter_voice_quote: "People can vote their values in their own state now.",
    latency_ms: 1498
  },
  {
    persona_id: "noah_madison",
    persona_name: "Noah",
    age: 21,
    location: "Urban Madison, WI",
    occupation: "College student",
    segment_tags: ["young_voters", "college_educated", "progressives"],
    provider: "anthropic",
    model_used: "claude-haiku-4-5-20251001",
    reaction_text:
      "My friends are angry and scared. It makes national politics feel immediate, and I would expect turnout energy on campuses to spike.",
    voter_voice_quote: "This turns politics from background noise into something personal.",
    latency_ms: 1316
  },
  {
    persona_id: "keisha_charlotte",
    persona_name: "Keisha",
    age: 35,
    location: "Suburban Charlotte, NC",
    occupation: "Nurse practitioner",
    segment_tags: ["black_voters", "healthcare_workers", "suburban_women"],
    provider: "openai",
    model_used: "gpt-4o-mini",
    reaction_text:
      "Patients already face enough fear and confusion. This adds politics to exam rooms and will make routine complications feel legally risky.",
    voter_voice_quote: "I do not want politics standing over a patient's bed.",
    latency_ms: 1144
  },
  {
    persona_id: "mike_scranton",
    persona_name: "Mike",
    age: 55,
    location: "Suburban Scranton, PA",
    occupation: "Warehouse supervisor",
    segment_tags: ["working_class", "older_voters", "swing_voters"],
    provider: "openrouter",
    model_used: "openai/gpt-4o-mini",
    reaction_text:
      "I am not an activist on this issue, but the decision feels like it could go too far. I would pay attention to whether candidates sound reasonable or extreme.",
    voter_voice_quote: "I can live with limits, but not with politicians acting cruel.",
    latency_ms: 1624
  },
  {
    persona_id: "susan_orange_county",
    persona_name: "Susan",
    age: 49,
    location: "Suburban Orange County, CA",
    occupation: "Marketing consultant",
    segment_tags: ["suburban_women", "college_educated", "moderate_republicans"],
    provider: "anthropic",
    model_used: "claude-haiku-4-5-20251001",
    reaction_text:
      "I used to think abortion politics was mostly rhetoric, but now it feels concrete. It makes me less comfortable with candidates who will not name exceptions clearly.",
    voter_voice_quote: "I want moderation, not slogans, when people's lives are involved.",
    latency_ms: 1550
  },
  {
    persona_id: "omar_minneapolis",
    persona_name: "Omar",
    age: 44,
    location: "Urban Minneapolis, MN",
    occupation: "Small restaurant owner",
    segment_tags: ["urban_voters", "small_business", "immigrant_families"],
    provider: "openai",
    model_used: "gpt-4o-mini",
    reaction_text:
      "My community has mixed religious views, but people still worry about government power. I hear more concern about families making private decisions safely.",
    voter_voice_quote: "Faith matters, but fear should not be written into law.",
    latency_ms: 1194
  },
  {
    persona_id: "patty_tampa",
    persona_name: "Patty",
    age: 72,
    location: "Suburban Tampa, FL",
    occupation: "Retired teacher",
    segment_tags: ["older_voters", "suburban_women", "independents"],
    provider: "gemini",
    model_used: "gemini-2.5-flash",
    reaction_text:
      "I remember when women had fewer options, and I do not want my granddaughters going backward. This would make me look hard at every candidate's stance.",
    voter_voice_quote: "I have seen this movie before, and women paid the price.",
    latency_ms: 1441
  },
  {
    persona_id: "doug_bismarck",
    persona_name: "Doug",
    age: 61,
    location: "Rural Bismarck, ND",
    occupation: "Farm equipment dealer",
    segment_tags: ["rural_men", "republican_base", "small_business"],
    provider: "anthropic",
    model_used: "claude-haiku-4-5-20251001",
    reaction_text:
      "I am generally pro-life and think local voters should decide. I also do not want messy laws that punish doctors for handling tragedies.",
    voter_voice_quote: "A good law needs moral clarity and common sense.",
    latency_ms: 1265
  },
  {
    persona_id: "grace_raleigh",
    persona_name: "Grace",
    age: 31,
    location: "Suburban Raleigh, NC",
    occupation: "Software project manager",
    segment_tags: ["young_voters", "college_educated", "suburban_women"],
    provider: "openai",
    model_used: "gpt-4o-mini",
    reaction_text:
      "This is the kind of issue that makes me donate and volunteer, not just vote. It feels like an immediate threat to autonomy and professional mobility.",
    voter_voice_quote: "I cannot plan my life if the law treats me like a risk category.",
    latency_ms: 1116
  },
  {
    persona_id: "ron_cleveland",
    persona_name: "Ron",
    age: 47,
    location: "Urban Cleveland, OH",
    occupation: "Police dispatcher",
    segment_tags: ["working_class", "swing_voters", "urban_voters"],
    provider: "gemini",
    model_used: "gemini-2.5-flash",
    reaction_text:
      "I am conflicted. I understand people who oppose abortion, but I do not trust politicians to handle exceptions without causing harm.",
    voter_voice_quote: "The more extreme it gets, the less comfortable I am.",
    latency_ms: 1518
  },
  {
    persona_id: "emily_grand_rapids",
    persona_name: "Emily",
    age: 27,
    location: "Suburban Grand Rapids, MI",
    occupation: "Elementary school teacher",
    segment_tags: ["young_voters", "suburban_women", "faith_moderates"],
    provider: "anthropic",
    model_used: "claude-haiku-4-5-20251001",
    reaction_text:
      "My faith makes this complicated, but I still think the decision will hurt women in difficult circumstances. I want leaders who show humility and compassion.",
    voter_voice_quote: "Moral conviction without compassion can become cruelty.",
    latency_ms: 1394
  }
] as const;

export const mockSynthesisSegments: SynthesisSegmentPayload[] = [
  {
    segment_id: "suburban_women",
    segment_name: "Suburban women",
    sentiment_direction: "strongly_negative",
    movement_signal: "high_activation",
    persona_count: 7,
    summary: "Strong backlash centered on daughters, medical exceptions, and government overreach."
  },
  {
    segment_id: "young_voters",
    segment_name: "Young voters",
    sentiment_direction: "strongly_negative",
    movement_signal: "high_activation",
    persona_count: 5,
    summary: "The decision converts a policy issue into a personal rights and turnout trigger."
  },
  {
    segment_id: "republican_base",
    segment_name: "Republican base",
    sentiment_direction: "positive",
    movement_signal: "base_reinforcement",
    persona_count: 4,
    summary: "Base voters largely support state authority while still expecting workable exceptions."
  },
  {
    segment_id: "independents",
    segment_name: "Independents",
    sentiment_direction: "mixed",
    movement_signal: "persuasion_risk",
    persona_count: 4,
    summary: "Independents are not uniformly pro-choice, but they react badly to perceived extremism."
  },
  {
    segment_id: "healthcare_workers",
    segment_name: "Healthcare workers",
    sentiment_direction: "strongly_negative",
    movement_signal: "persuasion_opportunity",
    persona_count: 3,
    summary: "Healthcare-adjacent voters focus on delays, liability, and emergency care confusion."
  }
];

export const mockRedFlags: RedFlagPayload[] = [
  {
    segment: "Moderate Republican women in suburban districts",
    flag_description:
      "Unexpectedly negative reaction among right-leaning women who otherwise align with Republican candidates on taxes, schools, and public safety.",
    affected_personas: ["linda_phoenix", "susan_orange_county"],
    severity: "high"
  },
  {
    segment: "Healthcare workers and clinic-adjacent voters",
    flag_description:
      "Repeated concern that vague exceptions will create delays in emergency care and make doctors legally cautious.",
    affected_personas: ["anne_des_moines", "keisha_charlotte"],
    severity: "medium"
  }
];

export const mockSynthesis: SynthesisCompletedPayload = {
  overall_sentiment: "negative_majority",
  executive_summary:
    "The simulation shows broad negative intensity, especially among suburban women, young voters, Black voters, and healthcare-adjacent personas. Republican-base support holds, but moderate and suburban right-leaning women show a meaningful persuasion risk around overreach and medical exceptions.",
  best_quotes: [
    {
      persona_id: "maria_milwaukee",
      quote: "I never thought my daughter would grow up with fewer rights than I had."
    },
    {
      persona_id: "linda_phoenix",
      quote: "This is exactly the kind of government overreach I worry about."
    },
    {
      persona_id: "anne_des_moines",
      quote: "Medical care should not depend on a lawyer reading the chart first."
    }
  ]
};

export const mockBenchmark: BenchmarkPayload = {
  event_name: "Dobbs v. Jackson, June 2022",
  calibration_score: 87,
  score_label: "Directional accuracy",
  simulated_distribution: [
    { segment: "Women overall", simulated: "Strongly negative" },
    { segment: "National overall", simulated: "Negative majority" },
    { segment: "Democrats", simulated: "Strongly negative" },
    { segment: "Republicans", simulated: "Positive with exception concerns" },
    { segment: "Independents", simulated: "Mixed-negative" }
  ],
  actual_polling_data: [
    {
      segment: "Women overall",
      actual: "47% of women strongly disapproved of overturning Roe in post-Dobbs polling.",
      source_label: "Gallup/Pew June-July 2022"
    },
    {
      segment: "National overall",
      actual: "61% called overturning Roe a bad thing for the country.",
      source_label: "Gallup/Pew June-July 2022"
    },
    {
      segment: "Democrats",
      actual: "Large majorities of Democrats said abortion should be legal in all or most cases.",
      source_label: "Gallup/Pew June-July 2022"
    },
    {
      segment: "Republicans",
      actual: "Republican base support for abortion restrictions largely held firm.",
      source_label: "Gallup/Pew June-July 2022"
    },
    {
      segment: "Independents",
      actual: "Independents leaned negative and showed susceptibility to attitude shifts after Dobbs.",
      source_label: "Gallup/Pew June-July 2022"
    }
  ],
  interpretation:
    "The simulated reaction matches the broad historical direction: strong backlash among women and Democrats, Republican base reinforcement, and negative movement among independents."
};

export function createMockSimulationEvents(personaCount: number, memoryEnabled: boolean): EventEnvelope[] {
  let sequence = 1;
  const selectedReactions = reactions.slice(0, personaCount);
  const events: EventEnvelope[] = [
    {
      event_type: "run.started",
      run_id: runId,
      sequence: sequence++,
      timestamp,
      payload: {
        stimulus_id: "dobbs_2022",
        event_name: "Dobbs v. Jackson, June 2022",
        memory_enabled: memoryEnabled,
        persona_count: selectedReactions.length
      }
    }
  ];

  for (const reaction of selectedReactions) {
    events.push({
      event_type: "persona_reaction.completed",
      run_id: runId,
      sequence: sequence++,
      timestamp,
      payload: reaction
    });
  }

  events.push({
    event_type: "synthesis.started",
    run_id: runId,
    sequence: sequence++,
    timestamp,
    payload: {
      completed_personas: selectedReactions.length,
      failed_personas: 0
    }
  });

  for (const segment of mockSynthesisSegments) {
    events.push({
      event_type: "synthesis.segment_completed",
      run_id: runId,
      sequence: sequence++,
      timestamp,
      payload: segment
    });
  }

  for (const redFlag of mockRedFlags) {
    events.push({
      event_type: "synthesis.red_flag_detected",
      run_id: runId,
      sequence: sequence++,
      timestamp,
      payload: redFlag
    });
  }

  events.push(
    {
      event_type: "synthesis.completed",
      run_id: runId,
      sequence: sequence++,
      timestamp,
      payload: mockSynthesis
    },
    {
      event_type: "benchmark.started",
      run_id: runId,
      sequence: sequence++,
      timestamp,
      payload: {
        benchmark_id: "dobbs_2022"
      }
    },
    {
      event_type: "benchmark.completed",
      run_id: runId,
      sequence: sequence++,
      timestamp,
      payload: mockBenchmark
    },
    {
      event_type: "run.completed",
      run_id: runId,
      sequence,
      timestamp,
      payload: {
        run_id: runId,
        stimulus_id: "dobbs_2022",
        completed_personas: selectedReactions.length,
        failed_personas: 0,
        memory_enabled: memoryEnabled,
        total_latency_ms: selectedReactions.length * 650,
        weave_url: "https://wandb.ai/andrew2115-minerva-university/campaign-persona-agent"
      }
    }
  );

  return events;
}
