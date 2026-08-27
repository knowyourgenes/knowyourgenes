===============================================================================
TEST PAGE IMAGES - WHAT WENT IN, WHAT IS STILL PENDING
Updated 2026-08-27  (supersedes the 2026-08-14 pass)
===============================================================================

## SUMMARY - the five pages in testpagesimages/

                        slots   filled   pending
  Eye                      10       10         0   COMPLETE
  Immunity                 21       20         1
  Skin                     13       13         0   COMPLETE
  Kidney                   10        8         2
  Sleep                     4        3         1
                        -----   ------   -------
                            58       54         4

This pass placed 28 images from testpagesimages/, converted to WebP:
49.3 MB of PNG became 2.01 MB of WebP, longest edge capped at 1600px,
quality 82. Verified in a real browser: all five pages paint every image,
zero 404s.

Skin is now complete. Immunity went from 8/21 to 20/21.

===============================================================================
PART A - THE FOUR SLOTS STILL EMPTY
These sections render a grey 137-byte placeholder. Nothing in the supplied
set matches them, so they were deliberately left rather than approximated.
===============================================================================

1.  IMMUNITY  bodymap-figure
    needs: an anatomical figure marking the six immune sites

2.  SLEEP     bodymap-figure
    needs: an anatomical figure marking the four sleep sites

    Both body maps want a labelled anatomical illustration. No page in the
    supplied set has one - "Kidney - Anatomy" and "Skin - Anatomy" are organ
    close-ups, not whole-body figures with markers.

3.  KIDNEY    why-reactive
    needs: unfiltered water beside filtered water

    "Kidney - Worth" was the only candidate and was opened to check: it is a
    lifestyle portrait of a man on a sofa, not a before/after of water. It
    would read as decoration in a section whose whole job is the contrast.

4.  KIDNEY    risk-nephrotic
    needs: protein leaking through damaged filtering units

    "Kidney - Immune" was the only candidate and went to risk-membranous
    instead, which it fits precisely - it shows immune deposits thickening a
    membrane, which is membranous nephropathy. Nephrotic syndrome needs its
    own image.

===============================================================================
PART B - WHAT WENT WHERE
Matched by MEANING, not by filename: the supplied names describe the subject
("Malaria Resistance") while the slots are named after the card they fill
("risk-parasitic"). Every pair was read against the slot's own alt text.
===============================================================================

## IMMUNITY - 12 placed, all from Immunity/More/

  contrast-never      <- Before.png
  contrast-tested     <- After.png
  why-reactive        <- Reactive vs Preventive.png
  risk-asthma         <- Asthma.png
  risk-bacterial      <- Bacterial Infection.png
  risk-covid          <- COVID Severity.png
  risk-fungal         <- Fungal.png
  risk-gramneg        <- Gram-Negative.png
  risk-hiv            <- Viral Load.png
  risk-ibd            <- Gut Inflammation.png
  risk-parasitic      <- Malaria Resistance.png
  risk-sars           <- SARS Susceptibility.png

  The More/ folder covered the nine pathogen cards the last pass called out
  as needing a fresh batch from the designer. That batch is what arrived.

## SKIN - 7 placed, all from Skin/More/ - page now COMPLETE

  why-reactive        <- Reactive vs Preventive.png
  risk-acne           <- Acne.png
  risk-age            <- Biological Age.png
  risk-cellulite      <- Cellulite.png
  risk-glycation      <- Glycation.png
  risk-pollution      <- Pollution.png
  risk-stretch        <- Stretch Marks.png

  A clean 7-for-7. The Skin More/ folder was built to exactly this list.

## KIDNEY - 8 placed, from Kidney/ (no More/ folder was supplied)

  hero-filter         <- Kidney - Hero.png
  counsellor          <- Kidney - Expert.png
  risk-ckd            <- Kidney - CKD.png
  risk-hyperuricemia  <- Kidney - Hyperuricemia.png
  risk-magnesium      <- Kidney - Magnesium.png
  risk-membranous     <- Kidney - Immune.png      (opened and checked)
  risk-polycystic     <- Kidney - PKD.png         (PKD = polycystic kidney disease)
  risk-stones         <- Kidney - Stones.png

  Kidney had NOTHING placed before this pass - all ten slots were grey.

## SLEEP - 1 placed

  why                 <- Sleep - Who.png          (opened and checked)

  ALT TEXT WAS REWRITTEN for this one. The slot was briefed for "a bedroom at
  3am, ceiling lit by a phone"; the supplied image is morning exhaustion in
  daylight. It carries the section either way, but alt text has to describe
  what is on screen, so it now reads "Someone sitting on the edge of a bed,
  rubbing their eyes, still tired".

===============================================================================
PART C - SUPPLIED IMAGES WITH NOWHERE TO GO
Unchanged from the last pass unless noted. These are not mistakes - they are
sections that do not exist yet.
===============================================================================

## THE GENE TRIO - 12 images across 4 pages

  Eye / Skin / Sleep / Kidney - Gene 1 (Born With), Gene 2 (Later In Life),
  Gene 3 (Caught Early)

  Only the Immunity page has the three-card explainer section these fill.
  Adding that same section to the other four pages would use all twelve.

## MARKER-GROUP SUBJECTS - 11 images

  Immunity - Detox, Infection Defense, Nutrients, Oxidative Stress
  Sleep    - Body Clock, Disorders, Nutrients, Restless Legs, Sleep Quality, Rested
  Skin     - Nutrients

  Named after MARKER GROUPS, not risk cards. The marker grids on those pages
  are icon-and-text only and have no image field at all.

## ONE-OFFS - 4 images

  Skin - Anatomy      no body-map section on the skin page
  Skin - Thriving     pairs with Skin - Regret as a before/after; the skin page
                      has no contrast section (Immunity does)
  Kidney - Anatomy    no body-map section on the kidney page
  Kidney - Worth      no aspiration section on the kidney page

  "Regret" and "Thriving" are clearly a matched pair. Adding the Immunity
  page's contrast section to Skin would use both as intended.

===============================================================================
NOTES FOR NEXT TIME
===============================================================================

* Placement is keyed on what is actually on disk, not on a list. A reference
  is only repointed to .webp once that .webp really exists - a blanket
  png -> webp rewrite would point empty slots at files that are not there, and
  Next serves those as a 404 rather than falling back, so a visible grey box
  becomes an invisible broken image.

* scripts used, in scratchpad: place_test_images.py (convert + place),
  repoint_refs.py (update the .ts references), verify_refs.py (every reference
  resolves), verify_images_render.py (the browser actually paints them).
