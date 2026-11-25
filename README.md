# Assembly

Assembly is a fictional independent hospitality and events concept by PerPixel. This repository contains the standalone public-facing demo, with nine connected pages and three interactive experiences.

## Run

No runtime dependencies are required. With Node.js 22 or newer:

```sh
npm run build
npm test
```

Serve `dist/` with any static file server. Vercel is configured through `vercel.json` to run the build and serve `dist/`.

## Experiences

- **Assembly Planner:** occasion, guest count, dining, direction, services and optional location details; choices remain in browser local storage while navigating. The review is editable by stepping back, and can be copied or exported as a PDF.
- **Culinary Atelier:** illustrative dishes and service formats, with selections transferred into the Planner.
- **Space in Transformation:** a keyboard-operable comparison of the same illustrated room before and after an event treatment.

The planner never submits a real enquiry, sends email or quotes a price. No contact details are collected. Reset clears both planner and Atelier choices. The menu's dietary labels are illustrative and do not claim allergy safety.

## Creative and technical decisions

- The visual identity follows the supplied warm industrial palette and editorial geometry. The two supplied JPEGs are used as photographic references and imagery. The room comparison is an original paired SVG/CSS illustration for exact camera alignment.
- The source is dependency-free HTML, CSS and JavaScript, generated into individual static routes by `scripts/build.cjs`. This keeps the concept portable and fast while preserving direct route access.
- The PDF writer is local and dependency-free. Exported PDFs include the current event and menu selections, with no network call.
- A visible disclaimer distinguishes the fictional concept and editorial studies from real client work.

## Deployment status

The intended host is Vercel and the proposed domain is `assembly.perpixel.agency`. Production deployment, repository push and DNS verification require network access to GitHub and Vercel. The build and test suite run locally without those services.
