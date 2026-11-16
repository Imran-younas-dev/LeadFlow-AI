# Problem

Northwind Studio is a fictional web design and marketing agency used for this portfolio case. The numbers below are planning assumptions from the 20-day plan (a person spends 5 to 10 minutes per lead). They are not measured results. Replace them in `docs/evaluation.md` only after a real test run.

## What happens today

About 25 inquiries arrive each week from the website form. A person spends about 8 minutes on each one: read the message, guess if it is a real project, copy it into a spreadsheet, and write a reply. That is about 200 minutes a week.

What goes wrong:

- A hot lead can sit until the next morning, then go cold.
- Spam and vague messages take the same time as a real project.
- Budget, urgency, and the reply are not recorded in one place, so the next person starts from scratch.

The system should cut that 8 minutes of manual sorting. The target to beat later is 8 minutes from form submit to a human alert on a hot lead, with the lead already stored.

## Scoring rubric

- **Hot:** a real project, a budget the sender states, and an urgent timeline. A person must approve any reply. The system alerts and saves a draft.
- **Warm:** real interest, and either the budget or the timeline is missing. Send one personal reply and one follow-up if they do not answer.
- **Cold:** vague, a student, or unrelated to a paid project. Send a short fixed template and log it.
- **Spam:** ads, link dumps, or nonsense, including a filled honeypot. Log it and do not email anyone.

The model may suggest the category. The workflow accepts only `hot`, `warm`, `cold`, or `spam` after a code check. Anything else, or a failed model call, is `needs_manual_review`.
