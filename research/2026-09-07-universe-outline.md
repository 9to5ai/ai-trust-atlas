# Universe outline

Implemented an additional Universe / List projection. Sources are organised by topic and concept, risks by MIT domain and risk type, controls by family and objective. Source sections and labelled legal foundations remain expandable. References use canonical IDs with unique appearance paths; they do not duplicate source records or imply legal containment.

The canvas exposes a snapshot of projected node coordinates. Visible list symbols provide measured destinations. A bounded, clipped animation layer moves symbols and existing graph connections between those positions, with collapsed nodes gathering towards a visible node of their colour. The accessible DOM hierarchy handles reading and navigation after the animation. Reduced-motion users skip travelling symbols. Canvas rendering stops in List mode and camera coordinates survive toggling at unchanged viewport dimensions.

State retained within the session: selected object, filters, expanded appearances and scroll position per lens. Selecting a linked source from a risk/control branch retains the list context; returning to the universe changes lens if necessary to show that selected object.

Checks cover corpus integrity, source and provision coverage, repeated references, legal scope, search ancestor context, source filtering, seven risk domains, six control families, keyboard expansion, source-to-Act navigation and projection switching. Browser visual verification was unavailable because the Mac was locked; do not treat automated DOM checks as visual confirmation.
