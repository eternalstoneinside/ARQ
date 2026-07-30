# ARQ Design Language

This document defines how ARQ looks, moves, and communicates visually across products, websites, marketing, and future platforms.

It is a system of principles and relationships, not a library of fashionable components. Product-specific design may extend this language but may not contradict it without explicit approval.

## Philosophy

ARQ visual design creates orientation and calm.

The interface should feel:

- structured without feeling rigid;
- minimal without feeling empty;
- premium without displaying luxury;
- precise without feeling mechanical;
- warm without becoming playful;
- contemporary without depending on trends.

The system follows five visual priorities:

1. **Content**
2. **Hierarchy**
3. **Space**
4. **Interaction**
5. **Expression**

Expression comes last. Brand recognition should emerge from repeated discipline: typography, rhythm, alignment, material, language, and behavior.

## Logo

The primary logo is the word:

```text
ARQ
```

It is short, structural, and complete. Do not decorate the wordmark to compensate for weak composition.

### When the ARQ logo is used

- Product launch and loading surfaces
- App icons and store identity
- Product headers where master-brand context matters
- Website navigation and footers
- Marketing covers and end frames
- Legal, corporate, and partnership material
- Cross-product navigation

### When the ARQ logo is not required

- Every repeated application screen
- Every card, component, or modal
- Utility controls
- Transactional messages where product context is already clear
- Decorative background patterns

Brand presence should also be carried by the system. Repeating the logo does not create identity.

### Logo rules

- Preserve the approved proportions and spacing.
- Use a single-color version by default.
- Prefer Graphite or Ink on Paper; prefer Paper on Graphite.
- Use the brand accent only when contrast and context are appropriate.
- Maintain clear space of at least the cap height of `A` on every side.
- Do not stretch, outline, shadow, bevel, rotate, crop, or animate individual letters.
- Do not place the wordmark inside an arbitrary badge.
- Do not substitute a typewritten `ARQ` when an approved asset exists.
- Do not create a literal arch, building, column, compass, or blueprint symbol without formal approval.

## Product Naming

ARQ is the master brand. Product names are plain-language descriptors.

Preferred lockup:

```text
ARQ
Balance
```

```text
ARQ
Language
```

```text
ARQ
Reader
```

```text
ARQ
Projects
```

```text
ARQ
Notes
```

### Naming rules

- Always write the master brand as `ARQ`.
- Use title case for product names.
- Use `ARQ Balance`, not `ARQBalance`, `ARQ BALANCE`, or `Balance by ARQ`, unless a specific channel requires a different lockup.
- Do not abbreviate product names in customer-facing copy.
- Do not create independent product logos by default.
- Product personality may vary in emphasis, not in fundamental character.
- New names should describe a durable responsibility, not a temporary feature.

## Typography

Typography is a primary brand material.

ARQ uses two functional type roles:

- **ARQ Display** — product-defining numbers, major titles, and editorial moments.
- **ARQ Text** — interface copy, reading, controls, metadata, and documentation.

These are roles, not permission to choose arbitrary typefaces. A canonical family must support Latin and Cyrillic, Ukrainian punctuation, tabular figures, variable weights where practical, and strong screen rendering. A typeface change is a brand-system decision.

### Display

Use for:

- primary values;
- product titles;
- major editorial statements;
- section openings with enough surrounding space.

Display typography should use:

- restrained weights, usually 500–650;
- tight optical tracking at large sizes;
- compact but not compressed line height;
- tabular figures for changing or aligned values;
- no artificial outline, shadow, or gradient.

### Headings

- Create hierarchy through size and space before weight.
- Use no more than three clearly differentiated heading levels on one screen.
- Prefer sentence case.
- Keep headings descriptive, not promotional.
- Avoid isolated headings that do not organize content.

Suggested product scale:

| Role | Compact mobile | Large canvas |
|---|---:|---:|
| Display value | 56–76 px | 72–112 px |
| Page title | 32–40 px | 40–56 px |
| Section title | 20–24 px | 24–32 px |
| Subsection | 16–18 px | 18–22 px |

### Body

- Default mobile size: 15–17 px.
- Default reading line height: 1.45–1.65.
- Target 45–75 characters per line for sustained reading.
- Use Graphite for primary text and muted Ink for supporting text.
- Do not reduce important copy merely to preserve a composition.

### Labels

- Labels are quiet structural anchors.
- Use 10–13 px depending on platform and density.
- Uppercase may be used only for short structural labels.
- When uppercase is used, increase tracking and keep contrast restrained.
- Never use small uppercase for sentences or instructions.

### Numbers

- Use tabular figures for balances, tables, comparisons, timers, and changing values.
- Use locale-correct grouping, decimal separators, currency placement, dates, and units.
- Align values by meaning, not merely by bounding box.
- Keep currency visually subordinate when the primary value must dominate.
- Never use color alone to distinguish positive and negative values.
- Avoid monospaced type for all financial values unless the product context genuinely requires it.

## Grid

ARQ uses an 8-point base grid with a 4-point subunit for optical correction and compact controls.

### Spacing

Canonical spacing tokens:

| Token | Value | Typical use |
|---|---:|---|
| `space-0` | 0 | No relationship |
| `space-1` | 4 px | Optical adjustment |
| `space-2` | 8 px | Icon-to-label, compact internal gap |
| `space-3` | 12 px | Related metadata |
| `space-4` | 16 px | Control padding |
| `space-5` | 24 px | Component separation |
| `space-6` | 32 px | Section interior |
| `space-7` | 48 px | Section separation |
| `space-8` | 64 px | Major hierarchy |
| `space-9` | 96 px | Hero or editorial pause |
| `space-10` | 128 px | Large-canvas composition |

### Rhythm

- Related items sit closer than unrelated items.
- Repetition should establish a predictable vertical cadence.
- Major values receive more surrounding space than controls.
- Page edges should feel deliberate and stable across routes.
- Break the grid only for an intentional optical reason.
- Do not use whitespace to hide weak hierarchy.
- Do not fill empty space simply because it exists.

### Responsive behavior

- Preserve priority, not exact geometry.
- Let typography and spacing adapt continuously where practical.
- Recompose when relationships change; do not only shrink.
- Maintain comfortable touch targets of at least 44 × 44 px.
- Keep content order meaningful without visual positioning.

## Colors

ARQ uses a restrained material palette.

### Core palette

| Token | Light reference | Purpose |
|---|---|---|
| Paper | `#F6F4EE` | Primary product background |
| Paper Raised | `#FDFCF8` | Physical foreground layer |
| Stone | `#ECEAE3` | Quiet controls and grouped surfaces |
| Stone Line | `#D6D5CD` | Borders and separators |
| Graphite | `#232421` | Primary text and dark surfaces |
| Ink | `#777970` | Secondary text and quiet icons |
| Accent | `#607674` | Restrained mineral identity and focus |
| Accent Strong | `#405957` | Primary actions on light surfaces |

### Dark palette

| Token | Dark reference | Purpose |
|---|---|---|
| Graphite Deep | `#111310` | Outer canvas |
| Graphite | `#191B18` | Product background |
| Charcoal | `#222420` | Raised foreground |
| Charcoal Quiet | `#20221E` | Quiet controls |
| Paper | `#EEEDE7` | Primary text |
| Ink Soft | `#9A9D95` | Secondary text |
| Accent | `#91AAA7` | Focus and identity |

### Semantic color

Semantic colors are muted:

| Meaning | Light reference | Dark reference |
|---|---|---|
| Positive / income | `#667B6C` | `#8AA090` |
| Negative / expense | `#946B64` | `#BC8C84` |
| Warning | Muted ochre | Warm desaturated ochre |
| Critical | Muted red | Soft warm red |
| Informational | Accent family | Accent family |

### Color rules

- Begin in neutral colors.
- Add accent only to clarify focus, identity, or action.
- Use one dominant accent family across the ecosystem.
- Use semantic colors only for actual meaning.
- Pair semantic color with text, sign, icon, or position.
- Ensure contrast meets accessibility requirements.
- Test meaning in grayscale and high-contrast modes.
- Avoid gradients as decoration.
- Avoid pure white and pure black as large product surfaces when the material palette is available.
- Do not give every product a different primary color.

## Geometry

ARQ geometry is architectural because it expresses relationships and construction—not because it depicts architecture.

### Principles

- Use proportion before ornament.
- Use straight alignment, measured curves, and clear intersections.
- Let geometry explain grouping, direction, sequence, or physical layer.
- Keep corner logic consistent within a component family.
- A shape may become distinctive through a repeated structural rule.
- Asymmetry is allowed when it creates hierarchy or identity.
- Hairlines should connect related information rather than decorate empty areas.

### Not literal arches

ARQ does not require arch-shaped components, arch illustrations, or a semicircle on every screen. A literal arch may become cliché and reduce the brand to a symbol.

### Not random circles

Circles are appropriate for:

- status indicators;
- avatars;
- radio controls;
- rotational or continuous concepts;
- geometry that functionally requires a circle.

Circles are not a default decoration, background blob, or substitute for composition.

### Corners

- Small controls: 8–12 px.
- Standard controls: 12–16 px.
- Large physical layers: 20–32 px.
- Pills: only for binary tags, compact filters, or values whose shape communicates containment.
- A product-specific signature corner may be used consistently, but never randomly.

## Components

Components inherit content hierarchy and product context. A component is not successful merely because it is reusable.

### Buttons

#### Primary

- One primary action per decision context.
- Use Accent Strong with calm, high-contrast text.
- Label with a specific verb and object where useful.
- Provide visible focus, pressed, disabled, and loading states.
- Keep the label stable while loading when space permits.

#### Secondary

- Use neutral surface or text treatment.
- Do not compete with the primary action.
- Use borders only when a boundary is necessary.

#### Destructive

- Do not make destructive actions primary by default.
- Name the consequence precisely.
- Use semantic color proportionately.
- Confirm at the moment of consequence, not several steps earlier.

### Inputs

- Labels remain visible after entry.
- Placeholder text is an example, not a label.
- Resting inputs use quiet material or a ledger line.
- Focus uses the brand accent and sufficient contrast.
- Errors appear near the relevant field and explain recovery.
- Preserve valid input when another field fails.
- Do not validate aggressively while the user is still composing an answer.

### FAB

Use a floating action button only when:

- one action is globally primary on the current surface;
- the action remains useful while content scrolls;
- its placement does not cover content or navigation;
- a standard toolbar action would be less clear.

ARQ FABs prefer a compact constructed square over a Material circle. The shape may use one consistent asymmetric corner. It must have a text alternative and all interaction states.

Do not use multiple FABs on one surface.

### Cards

Cards are physical or conceptual containers, not the default method of spacing.

Use a card when:

- the content is a movable or selectable object;
- a physical layer matters;
- the group needs an independent state or action;
- the background must separate it from surrounding context.

Do not use a card:

- around every section;
- around one number solely to make it prominent;
- when a heading, space, or hairline is sufficient;
- to hide inconsistent alignment.

### Bottom Sheet

- Use for focused, temporary tasks that preserve page context.
- Present one clear title and one primary completion action.
- Use a visible handle only when drag behavior or physical layering is meaningful.
- Keep essential fields within comfortable reach.
- Support keyboard and screen-reader dismissal.
- Respect safe areas and the on-screen keyboard.
- Use spring-like motion and a restrained backdrop.

### Navigation

- Navigation communicates product structure, not promotion.
- Use stable positions and labels.
- Keep destination names short and concrete.
- Highlight the current location without turning it into a decorative badge.
- Do not use a navigation tab for a transient action.
- Avoid more top-level destinations than users can distinguish quickly.
- Preserve meaningful URL and keyboard behavior on the web.

### Lists

- Prefer open lists with spacing and hairlines to stacks of cards.
- Align repeated content into a stable optical grid.
- Keep metadata subordinate.
- Make row boundaries and hit areas unambiguous.
- Use icons only when they improve scanning.
- Ensure long text and large numbers do not break the value hierarchy.

### Charts

- Start with the question the chart answers.
- Prefer the simplest representation that reveals the relationship.
- Use direct labels where space permits.
- Keep decoration and grid lines quiet.
- Use the accent sparingly; semantic colors retain semantic meaning.
- Provide a textual summary or accessible equivalent.
- Never distort axes or proportions for visual drama.
- Avoid complex charts when a ranked list or number is clearer.

## Motion

Motion explains state, relationship, and physical continuity.

### Timing

| Motion | Duration |
|---|---:|
| Immediate feedback | 80–140 ms |
| Color / opacity transition | 160–240 ms |
| Standard component movement | 240–360 ms |
| Spatial transition | 360–480 ms |
| Modal or sheet entrance | 420–560 ms |

Duration should reflect distance, size, and consequence. Longer does not automatically feel more premium.

### Physics

- Use spring behavior for spatial movement.
- Use gentle ease for color and opacity.
- Pressed states compress slightly and recover cleanly.
- Avoid elastic bounce unless the physical model requires it.
- Avoid simultaneous motion in many unrelated areas.

### Curves

Recommended CSS references:

```css
--ease-standard: cubic-bezier(.2, .8, .2, 1);
--ease-spring: cubic-bezier(.16, 1, .3, 1);
--ease-exit: cubic-bezier(.4, 0, 1, 1);
```

### Reduced Motion

When reduced motion is requested:

- remove nonessential translation and scale;
- use near-immediate fades or state changes;
- preserve orientation and feedback;
- do not disable functionality;
- avoid parallax, continuous motion, and autoplay animation.

## Iconography

- Use one coherent icon family per product surface.
- Prefer simple outline construction and consistent optical weight.
- Default icon size should align with text, not dominate it.
- Icons support recognition; typography carries meaning.
- Pair unfamiliar icons with labels.
- Adjust icons optically rather than treating mathematical bounds as visual alignment.
- Use filled icons only for a meaningful selected state or strong platform convention.
- Do not mix playful, technical, skeuomorphic, and geometric icon styles.
- Do not use icons as decoration beside every heading.

## Illustrations

Illustration is optional, not a required expression of friendliness.

When used, illustration should:

- explain a concept or provide meaningful orientation;
- use restrained composition and the ARQ material palette;
- feel editorial and human;
- respect the seriousness of the product context;
- remain secondary to product information.

Avoid:

- mascots by default;
- childish characters;
- generic 3D objects;
- floating geometric blobs;
- stock fintech metaphors;
- piggy banks, rockets, trophies, coins, and glowing brains;
- illustration that occupies space but communicates nothing.

## App Icons

An ARQ app icon must:

- clearly belong to the ARQ family;
- remain recognizable at small sizes;
- use one strong structural idea;
- avoid text smaller than the platform can render;
- use restrained depth;
- work in light, dark, monochrome, and platform-tinted contexts;
- survive cropping and mask variations;
- avoid screenshots, detailed illustrations, and multiple competing symbols.

Product differentiation should come from a controlled internal structure, not unrelated colors or styles.

## Website

The ARQ website is editorial, not a gallery of floating product cards.

- Lead with a clear product statement.
- Use real product behavior and real content.
- Let typography, sequence, and space create premium quality.
- Explain one idea per section.
- Keep navigation short.
- Use motion only to clarify product relationships.
- Avoid scroll hijacking.
- Avoid decorative device mockups when a direct product view is clearer.
- Keep performance, accessibility, and reading quality central.
- Marketing claims must be demonstrably true.

## Marketing

ARQ marketing should feel like the product: calm, precise, and confident.

- Show the value before the feature list.
- Use real situations and specific outcomes.
- Prefer one strong image to a collage.
- Keep product UI accurate.
- Use the same terminology as the product.
- Avoid fear, urgency, superiority claims, and exaggerated transformation.
- Never describe routine automation as magic.
- Do not promise certainty where the product provides assistance.
- Do not use “revolutionary,” “game-changing,” or similar unsupported language.

## Do / Don't

These examples are normative. They illustrate the reasoning expected across products.

### Composition and hierarchy

| Do | Don’t |
|---|---|
| Give one idea unmistakable visual priority. | Make every section equally prominent. |
| Use whitespace to separate concepts. | Put every concept in a rounded card. |
| Align repeated values to a stable grid. | Center elements independently without shared alignment. |
| Let a primary number occupy open space. | Add a card, gradient, icon, and badge around the number. |
| Keep supporting actions visually quiet. | Let secondary controls compete with the main task. |
| Recompose relationships on small screens. | Shrink a desktop layout until it technically fits. |
| Use a hairline when a boundary is needed. | Add shadows to every group. |
| Keep page edges stable across routes. | Change horizontal padding arbitrarily per screen. |

### Typography

| Do | Don’t |
|---|---|
| Use display typography for a small number of defining moments. | Use oversized type for every heading. |
| Use tabular figures for changing values. | Let columns jump as numbers change. |
| Format numbers according to locale. | Hard-code separators or currency order. |
| Use weight sparingly. | Make every label bold. |
| Preserve readable body size. | Reduce text to make a layout look cleaner. |
| Use quiet labels with enough contrast. | Use pale uppercase microcopy that cannot be read. |
| Keep headings descriptive. | Write promotional headings inside workflows. |

### Color

| Do | Don’t |
|---|---|
| Begin with Paper, Stone, and Graphite. | Begin by assigning a color to every category. |
| Use the accent for focus and primary action. | Spread the accent across every icon and heading. |
| Mute semantic colors. | Use saturated green and red as decoration. |
| Pair color with another signal. | Make status understandable only by color. |
| Test light and dark themes independently. | Invert the light palette mechanically. |
| Maintain contrast in disabled and secondary states. | Make inactive content disappear. |
| Use solid material color. | Add decorative gradients for perceived quality. |

### Geometry and surfaces

| Do | Don’t |
|---|---|
| Use geometry to express structure or physical layer. | Scatter circles and arcs in empty areas. |
| Maintain consistent corner logic. | Use a different radius on every component. |
| Reserve strong rounding for real layers. | Turn every rectangle into a pill. |
| Use one approved signature shape consistently. | Invent a new brand shape per screen. |
| Let lists remain open. | Wrap every list row in its own card. |
| Use raised surfaces only when elevation means something. | Add shadows because flat composition feels unfinished. |
| Draw from architectural principles. | Illustrate buildings to prove the brand is architectural. |

### Components

| Do | Don’t |
|---|---|
| Use one primary button per decision context. | Present several equally strong primary buttons. |
| Keep labels visible on filled inputs. | Use placeholders as the only label. |
| Explain how to fix an error. | Display “Invalid input.” |
| Use a FAB for one persistent primary action. | Use a FAB as generic decoration or navigation. |
| Make entire rows tappable when they represent one action. | Provide a tiny unlabeled tap target. |
| Use a sheet for a focused temporary task. | Put a multi-stage complex workflow in one sheet. |
| Keep bottom navigation for destinations. | Put “Add” in navigation when it is an action. |
| Provide loading, empty, error, and disabled states. | Design only the ideal populated state. |

### Icons and charts

| Do | Don’t |
|---|---|
| Use icons where they accelerate recognition. | Add an icon beside every piece of text. |
| Pair ambiguous icons with words. | Make users memorize custom symbols. |
| Keep icon weight optically consistent. | Mix outline, filled, emoji, and 3D icons. |
| Use a ranked list for simple comparisons. | Use a complex chart to imply sophistication. |
| Label values directly. | Require a legend for three simple values. |
| Keep chart scales honest. | Crop an axis to exaggerate movement. |
| Provide an accessible summary. | Treat the visual chart as the only source. |

### Motion

| Do | Don’t |
|---|---|
| Use motion to show where an element came from. | Animate unrelated elements for atmosphere. |
| Use a restrained spring for sheets and spatial changes. | Add playful bounce to serious workflows. |
| Give pressed controls immediate feedback. | Delay feedback to make animation visible. |
| Fade supporting layers quietly. | Blur and scale the entire interface repeatedly. |
| Respect reduced motion. | Treat reduced motion as optional polish. |
| Keep loading motion low contrast. | Use fast, bright shimmer across the whole screen. |

### Content and behavior

| Do | Don’t |
|---|---|
| Say what happened: “Saved.” | Celebrate routine actions: “Amazing! You did it!” |
| Name consequences before destructive actions. | Ask only “Are you sure?” |
| Use natural language in each locale. | Translate interface strings literally. |
| Explain limitations honestly. | Hide uncertainty behind confident language. |
| Let the user dismiss nonessential information. | Use repeated interruptions to drive engagement. |
| Preserve user agency in automation. | Make consequential changes silently. |
| Keep product terminology consistent. | Rename the same concept across screens. |

### Brand expression

| Do | Don’t |
|---|---|
| Make ARQ recognizable through repeated discipline. | Place the logo everywhere to create recognition. |
| Let products share a clear family resemblance. | Give every product an unrelated color and visual style. |
| Extend the system for a real product need. | Create exceptions to make one screen more exciting. |
| Document approved evolution. | Let temporary experiments become permanent silently. |
| Present ARQ with quiet confidence. | Imitate luxury, banking, crypto, or AI aesthetics. |

When uncertain, return to the priority order: content, hierarchy, space, interaction, expression.
