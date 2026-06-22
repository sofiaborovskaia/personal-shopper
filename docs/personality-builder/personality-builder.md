# Personality Builder

A small playful feature that lets users shape the personality of the AI shopping assistant.

The user can adjust a few sliders, preview the vibe, and apply the personality to the assistant.

## Goal

Make the shopping assistant feel more personal and fun without overbuilding the feature.

This is not a full onboarding flow, prompt management system, or training tool. It is a simple UI that turns slider values into lightweight assistant tone settings.

## Personality Traits

Use these sliders:

- Casual ↔ Formal
- Playful ↔ Serious
- Warm ↔ Distant
- Enthusiastic ↔ Neutral
- Concise ↔ Detailed
- Spontaneous ↔ Structured

Each slider should have:

- left label
- right label
- value from 0 to 100

## Default Personality

Default vibe:

- friendly
- warm
- slightly playful
- helpful
- not too formal
- not too chaotic
- concise unless detail is useful

Example default values:

    const defaultPersonality = {
      casualFormal: 35,
      playfulSerious: 40,
      warmDistant: 25,
      enthusiasticNeutral: 35,
      conciseDetailed: 40,
      spontaneousStructured: 45,
    };

## Preview

Show a small preview message so users understand what they are changing.

Example:

> Nice choice — I can help you find something that fits your style, budget, and mood. Want me to suggest a few options?

The preview can be static or lightly conditional for now. It does not need to call the AI API.

## First Version Scope

Build:

- Personality Builder page or section
- intro title and short description
- sliders for the traits
- preview message/card
- Apply button
- Reset button if it fits naturally
- local state for slider values

Do not build yet:

- user needs / pain points flow
- multiple saved personas
- backend persistence
- AI-generated previews
- complex prompt management

## Future Idea

Later, slider values can be translated into a short assistant instruction and passed into the chat prompt.

Example:

    Respond in a warm, fairly casual, lightly playful style. Keep answers concise unless the user asks for more detail.
