# Personality Builder Visual Direction

The screen should feel like part of the existing e-commerce app, but a bit more playful and expressive.

## Mood

Dark, glassy, colorful, modern, playful, high end editorial and digital design.

## References

Real life style references: Koln studio, Koto Studio, How&How.

References live here:

    docs/personality-builder/references/

Do not copy them exactly. Use them as mood and structure references.

## Background

Use the existing dark grey background from the app.

Add soft abstract colorful elements, using:

- existing main pink from global CSS
- optional bright accents like cyan, violet, yellow, orange, or lime

The colorful elements should feel atmospheric, not distracting.

## Main Container

Put the content inside a glass-like panel.

Suggested style direction:

    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 28px;
    box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);

Follow the project’s existing styling approach. Do not add a new styling library.

## Layout

Desktop:

- left side: title, description, preview
- right side: sliders

Mobile:

- stack everything vertically
- keep sliders easy to use

## UI Content

Suggested title:

    Build your shopping assistant

Suggested subtitle:

    Adjust how your AI style companion talks, helps, and recommends products.

Suggested buttons:

    Apply personality
    Reset

## Slider Style

Each slider should show two opposite labels.

Example:

    Casual ---------------- Formal

Use the existing app colors where possible. The slider thumb can use the main pink.

Keep labels readable, states accessible, and keyboard interaction working.

## Avoid

- making it look like a boring settings page
- adding too many controls
- copying the workshop screenshots exactly
- overengineering the feature
