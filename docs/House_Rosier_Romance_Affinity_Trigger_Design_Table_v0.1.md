# House Rosier — Romance Affinity Trigger Design Table v0.1

## Purpose

This document defines how romance-related affinity changes should be triggered in *House Rosier*.

Core principle:

> A charming person can attract more than one person. Attraction is not the same thing as a harem route.

Early-game romance should therefore allow **parallel attraction**, while later commitment determines the final relationship structure.

Romance affinity must remain separate from:

- Identity stance
- Rosier family affinity
- Route commitment

A player can hold any identity belief and still romance any of the three main love interests.

---

# 1. Global Design Rules

## 1.1 Romance is interpretive, not exclusive

The same player action may impress multiple characters for different reasons.

Example:

> “I don’t remember the past, but that does not mean I cannot judge the present.”

Possible interpretation:

- Damien: responsibility and judgment
- Alaric: intellectual independence
- Roderic: courage and directness

Result:

- Damien: +1 political trust
- Alaric: +2 respect
- Roderic: +1 respect

No character is automatically penalized because another character liked the same answer.

---

## 1.2 Identity does not determine romance

Identity stance answers:

> Who am I?

Romance answers:

> Why does this person become interested in me?

The player may be:

- Otherworlder
- Original Nait
- Self-Defined

Any of these can romance:

- Damien
- Alaric
- Roderic

The important factor is **how the player thinks, acts, and treats people**, not which metaphysical explanation they choose.

---

## 1.3 Attraction can grow in parallel

Before commitment:

- multiple characters may be interested;
- multiple first-stirring flags may be active;
- jealousy or awareness of competition may appear;
- private events may overlap.

This does **not** mean the game is a harem route.

Later romantic commitment controls:

- exclusivity;
- confession outcomes;
- partner-specific scenes;
- how unchosen attraction resolves.

---

# 2. Relationship Dimensions

Romance should not use only one visible affection number.

## Damien Aurelian

Primary dimensions:

- `damien_political_trust`
- `damien_personal_trust`
- `damien_vulnerability`
- `damien_romantic_interest`

What he notices:

- responsibility;
- judgment under pressure;
- ability to understand power without worshipping it;
- treating him as Damien, not only as Crown Prince.

---

## Alaric Varenne

Primary dimensions:

- `alaric_respect`
- `alaric_curiosity`
- `alaric_trust`
- `alaric_warmth`
- `alaric_romantic_interest`

What he notices:

- independent thought;
- intellectual honesty;
- willingness to question;
- ability to admit uncertainty;
- emotional patience.

---

## Roderic Wycliffe

Primary dimensions:

- `roderic_respect`
- `roderic_warmth`
- `roderic_shared_action`
- `roderic_trust`
- `roderic_romantic_interest`

What he notices:

- action;
- courage;
- practical honesty;
- willingness to try;
- ability to admit limits without pretending.

---

# 3. Trigger Strength

## Strong Match

A choice directly reflects one of the character’s core values.

Typical effect:

- +2 to a major relationship dimension
- possible hidden pattern flag

## Positive Match

The character likes or respects the choice.

Typical effect:

- +1

## Neutral / Different

The choice is reasonable but does not particularly match the character.

Typical effect:

- 0

No penalty should be applied simply because the player chose another valid personality style.

## Friction

The choice directly conflicts with an important value.

Typical effect:

- -1
- or a negative state such as distrust / irritation

Strong penalties should be rare in Week 1.

---

# 4. Core Trigger Matrix

| Scene Type | Damien Aurelian | Alaric Varenne | Roderic Wycliffe |
|---|---|---|---|
| Public social pressure | Strong: calm judgment, political awareness, taking responsibility | Strong: independent reasoning, noticing contradictions | Strong: refusing to be intimidated, direct response |
| Private conversation | Strong: treating him as a person rather than a title | Strong: honest uncertainty, real intellectual exchange | Strong: directness, humor, lack of noble pretension |
| Crisis / danger | Strong: prioritize, decide, accept consequences | Strong: observe, analyze, revise conclusions | Strong: act, protect, recover from mistakes |
| Identity discussion | Medium–High: responsibility after identity uncertainty | Very High: memory, soul, identity, evidence | Low–Medium: cares more about present behavior |
| Investigation | Medium: strategic value and consequences | Very High: evidence, theory, contradiction | Medium: practical field work |
| Physical / outdoor action | Medium | Medium | Very High |
| Humor | Private humor and teasing work well | Dry or clever humor works best | Very High |
| Showing vulnerability | High if honest and controlled | High if genuine and not performative | High if practical and direct |
| Complimenting him | Better when recognizing personal judgment | Better when engaging with his ideas | Better when tied to shared action |
| Handling failure | Admit responsibility and repair | Reassess evidence | Get back up, fix it, do not blame others |

---

# 5. Character-Specific Positive Triggers

## Damien — Strong Positive Triggers

- takes responsibility without claiming to know everything;
- understands the political meaning behind polite words;
- protects others without making empty heroic gestures;
- refuses to exploit rank carelessly;
- recognizes that Damien has desires separate from the Crown;
- asks what Damien personally thinks;
- remains composed when publicly tested;
- chooses to stand by a decision after understanding its cost.

### Damien — Friction Triggers

- treats politics like entertainment;
- publicly creates consequences and expects others to clean them up;
- flatters his title instead of engaging with him;
- assumes responsibility means blind obedience;
- uses Rosier status to humiliate weaker people.

---

## Alaric — Strong Positive Triggers

- challenges his conclusion with evidence;
- admits “I don’t know” honestly;
- proposes an alternative hypothesis;
- distinguishes memory from identity;
- changes opinion when evidence changes;
- notices inconsistencies;
- asks questions because they genuinely want the answer;
- stays present when Alaric becomes uncertain or emotionally withdrawn.

### Alaric — Friction Triggers

- pretends to understand;
- agrees merely to please him;
- ignores evidence;
- refuses to question an attractive explanation;
- turns uncertainty into melodrama instead of inquiry.

---

## Roderic — Strong Positive Triggers

- acts instead of only talking;
- tries again after failure;
- owns mistakes;
- admits when the body cannot continue;
- protects another person without making a performance of it;
- laughs at themselves;
- answers teasing with confidence;
- chooses practical action over status display.

### Roderic — Friction Triggers

- boasts and refuses to follow through;
- endangers others to protect pride;
- blames others after failure;
- uses noble rank to avoid consequences;
- refuses help only to appear strong.

---

# 6. Important Rule: “Not His Favorite” Is Not the Same as “Wrong”

Example: the player is publicly challenged.

### Choice A — Controlled authority

> “House Rosier’s succession does not require judgment over a tea table.”

Possible response:

- Damien: +2 political trust
- Roderic: +1 respect
- Alaric: 0

### Choice B — Logical reversal

> “Are you asking about my health, or whether Rosier can still obstruct your plans?”

Possible response:

- Alaric: +2 respect
- Damien: +1 political trust
- Roderic: +1 warmth

### Choice C — Humor

> “I sleep for two months and wake to find everyone so interested in me. I must have been terribly popular.”

Possible response:

- Roderic: +2 warmth
- Damien: +1 personal trust
- Alaric: +1 curiosity

All three are valid attractive responses.

---

# 7. Pattern Flags

Romantic interest should emerge from repeated behavior patterns.

Possible hidden behavior tags:

- `responsible_choice`
- `independent_reasoning`
- `practical_action`
- `kindness_without_performance`
- `public_composure`
- `honest_vulnerability`
- `protective_action`
- `humor_under_pressure`
- `personal_recognition`
- `accepts_uncertainty`

These tags may be counted across scenes.

---

# 8. First-Stirring Trigger Conditions

## Damien

Suggested condition:

- `damien_political_trust >= 4`
- `damien_personal_trust >= 2`
- at least one `responsible_choice`
- at least one `personal_recognition`

Then:

`damien_first_stirring = true`

Narrative expression:

Damien begins deliberately creating private conversational space with Nait.

He may protect Nait politically before being asked.

---

## Alaric

Suggested condition:

- `alaric_respect >= 4`
- `alaric_curiosity >= 4`
- at least two `independent_reasoning`
- at least one `accepts_uncertainty`

Then:

`alaric_first_stirring = true`

Narrative expression:

Alaric stays longer than necessary, asks questions with no immediate research purpose, or remembers small personal details.

---

## Roderic

Suggested condition:

- `roderic_respect >= 4`
- `roderic_warmth >= 2`
- at least one `practical_action`
- at least one `shared_action`

Then:

`roderic_first_stirring = true`

Narrative expression:

Roderic begins seeking Nait out casually, creating excuses for shared activities, or reflexively watching Nait’s physical condition.

---

# 9. Player-Side “Sweetness”

The game should not declare the player’s feelings as fact.

Do not write:

> “Your heart races. You realize you like him.”

Instead, give the player material that may produce attraction.

## Damien

Examples:

- steps beside Nait before a hostile noble approaches;
- quietly explains a political trap before Nait walks into it;
- drops formal royal speech in private;
- asks what Nait wants, not what Rosier requires.

## Alaric

Examples:

- stays after intending to leave because Nait asks a question;
- lends a personally annotated book;
- admits a conclusion is uncertain;
- allows Nait to see a rare moment of hesitation.

## Roderic

Examples:

- catches Nait during a physical mistake but immediately lets go;
- pretends not to worry, while clearly adjusting the activity to Nait’s recovery;
- makes Nait laugh during an uncomfortable social moment;
- casually includes Nait in future plans.

These moments should invite player interpretation.

---

# 10. Week 1 Garden Party Trigger Design

The Rosecourt Spring Garden Party should function as the first major romance showcase.

The event should include several different types of test.

## Test 1 — Health / Succession Probe

A noble politely asks whether Nait is truly recovered.

Possible approaches:

- formal authority;
- calm honesty;
- humor;
- redirecting the political implication.

Potential affinity:
- Damien: judgment
- Alaric: intellectual clarity
- Roderic: courage

---

## Test 2 — Memory Probe

Someone deliberately references an event Nait does not remember.

Possible approaches:

- admit memory loss;
- infer from context;
- challenge why the question matters;
- ask the speaker to explain.

Potential affinity:
- Alaric: very high
- Damien: composure
- Roderic: honesty

---

## Test 3 — Social Power Moment

A servant or minor noble makes a mistake during the event.

Player can:

- quietly protect them;
- solve the situation efficiently;
- make a joke and redirect attention;
- use rank to punish them.

Potential affinity:
- Damien: sees use of power
- Alaric: notices divergence from old Nait
- Roderic: strongly reacts to fairness and authenticity

---

## Test 4 — Direct Political Provocation

A political opponent pushes too far.

Possible approaches:

- controlled threat;
- logical exposure;
- humorous humiliation;
- refusal to play their game.

This should be the strongest public trigger of the evening.

---

# 11. Garden Party Closing Rewards

If `damien_first_stirring` is active:

Damien creates a short private moment before leaving.

If `alaric_first_stirring` is active:

Alaric leaves behind a personal book, note, or unresolved question intended specifically for Nait.

If `roderic_first_stirring` is active:

Roderic proposes a future shared activity or finds a casual excuse to see Nait again.

Multiple rewards may trigger in the same playthrough.

This is intentional.

Multiple characters being attracted does not equal a harem route.

---

# 12. Commitment Rule

Before formal romantic commitment:

- attraction may overlap;
- flirting may overlap;
- character rivalry may emerge naturally.

After commitment:

- romance-specific escalation with unchosen characters should stop;
- existing affection is not erased;
- the relationship may resolve into friendship, restrained affection, or an unspoken past possibility.

The ensemble friendship route remains a complete main route, not a failure state.

---

# 13. Final Design Principle

The most important rule:

> Characters should not fall for the player’s conclusion. They should fall for the way the player thinks, acts, chooses, and treats others.

Identity determines self-understanding.

Family affinity determines belonging.

Romance affinity determines emotional connection.

These systems may influence one another, but none should dictate the others.
